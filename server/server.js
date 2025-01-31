require('dotenv').config();
const express = require('express');
const axios = require('axios');
const qs = require('qs');
const app = express();
const cors = require('cors');

const getLyrics = require('./lib/getLyrics');
const getSong = require('./lib/getSong');
const deepl = require('deepl-node')

const PORT = process.env.PORT || 5000;


app.use(express.json())
app.use(cors());

//Spotify api 설정
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const AUTH_ENDPOINT = "https://accounts.spotify.com/api/token"



const getAccessToken = async () => {
    try {
        const data = qs.stringify({
            'grant_type': 'client_credentials',
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
        });
        const response = await axios.post(AUTH_ENDPOINT, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Error getting access token:", error.message);
        throw new Error("Failed to get access token");
    }
}
const fetchArtist = async (token, searchTerm) => {
    try {
        const response = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchTerm,
                type: "artist",
                market: "KR",
                limit: 1
            }
        });

        return response.data.artists.items[0]; // 첫 번째 가수 정보 반환
    } catch (error) {
        console.error('Error fetching artist:', error);
        return null;
    }
};

const fetchTrack = async (token, searchTerm) => {
    try {
        const response = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: `"${searchTerm}"`,
                type: "track",
                market: "KR",
                limit: 20
            }
        });
        return response.data.tracks.items; // 노래 목록 반환
    } catch (error) {
        console.error('Error fetching track:', error);
        return [];
    }
};


app.post('/api/search', async (req, res) => {
    const { searchTerm } = req.body;
    try {
        const token = await getAccessToken();
        const [artist, tracks] = await Promise.all([
            fetchArtist(token, searchTerm),
            fetchTrack(token, searchTerm)
        ]);

        let topArtistData = null;

        if (artist) {
            const topArtistTracks = await axios.get(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    market: "KR"
                }
            });

            topArtistData = {
                artist,
                tracks: topArtistTracks.data.tracks
            };

        }



        // 검색어와 일치하는 트랙을 우선적으로 정렬
        const sortedTracks = tracks.sort((a, b) => {
            const aMatch = a.name.toLowerCase() === searchTerm.toLowerCase();
            const bMatch = b.name.toLowerCase() === searchTerm.toLowerCase();
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
        });
        res.json({
            artist: topArtistData ? topArtistData.artist : null,
            artistTracks: topArtistData ? topArtistData.tracks : [],
            searchTracks: sortedTracks.slice(0, 10) // 최대 10개의 트랙 반환
        });


    } catch (error) {
        console.error("Error searching artists:", error.message);
        res.status(500).json({ error: "Failed to search artists" });
    }
});

//track정보 받아오기
app.post('/api/track/select', async (req, res) => {
    try {
        const { name, artist } = req.body;
        /* console.log(name, artist); */
        const apiKey = process.env.GENIUS_API_KEY;
        const options = {
            apiKey: apiKey,
            title: name,
            artist: artist,
            optimizeQuery: true,
        };
        const lyrics = await getLyrics(options)

        if (!lyrics) {
            throw new Error('가사 불러오기 실패');
        }

        res.json({ lyrics: lyrics }); //가사 불러오기 성공

    } catch (error) {
        console.error('error selected track:', error.message);
        if (error.message === '가사 불러오기 실패') {
            res.status(404).json({ error: '해당 트랙의 가사 정보가 없습니다.' });
        } else {
            res.status(500).json({ error: '트랙 선택에 실패했습니다.' });
        }
    }
})

app.post('/api/translate', async (req, res) => {
    try {
        const { lyrics, targetLang } = req.body;
        /* console.log(lyrics, targetLang); */
        const apiKey = process.env.DEEPL_API_KEY;
        const translator = new deepl.Translator(apiKey);
        const result = await translator.translateText(lyrics, null, targetLang);
        res.json(result);
    } catch (error) {
        console.error("Error translating lyrics:", error.message);
        res.status(500).json({ error: "Failed to translate lyrics" });
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});