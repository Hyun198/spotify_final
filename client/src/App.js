import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './App.css';
import { getToken, getAccessTokenFromUrl } from './Component/Auth';
import Header from './Component/Header/Header';
import SearchResult from './Component/SearchResult/SearchResult';
import Translate from './Component/Translate/Translate';
import Loading from './Component/Loading/Loading';
import Playlist from './Component/PlayList/PlayList'
import Player from './Component/Player/Player';

function App() {
  const [searchKey, setSearchKey] = useState("");
  const [topArtist, setTopArtist] = useState(null);
  const [topArtistTracks, setTopArtistTracks] = useState([]);
  const [searchTracks, setSearchTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState('');
  const [lyrics, setLyrics] = useState(''); //원본 가사
  const [translatedLyrics, setTranslatedLyrics] = useState(''); //번역된 가사
  const [targetLang, setTargetLang] = useState('KO');
  const [isTranslated, setIsTranslated] = useState(false) //번역되어있는지 flag

  const [loading, setLoading] = useState(false);

  /*player*/
  const [token, setToken] = useState(null);
  const [player, setPlayer] = useState(null);
  const [track, setTrack] = useState(null);
  const [position, setPosition] = useState(null);
  const [duration, setDuration] = useState(null);
  const [paused, setPaused] = useState(true);

  const [showPlaylists, setShowPlaylists] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);

  useEffect(() => {
    const accessToken = getAccessTokenFromUrl();
    if (accessToken) {
      setToken(accessToken);
    }
  }, [])

  useEffect(() => {
    if (token) {
      const script = document.createElement('script');
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: 'Web Playback SDK Quick Start Player',
          getOAuthToken: cb => { cb(token); },
          volume: 0.5
        });

        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          axios.put('https://api.spotify.com/v1/me/player', {
            device_ids: [device_id],
            play: false,
          }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        });

        player.addListener('player_state_changed', (state) => {
          if (!state) {
            return;
          }
          setTrack(state.track_window.current_track);
          setPaused(state.paused);
          setPosition(state.position);
          setDuration(state.duration);
        })

        player.connect();
        setPlayer(player);
      };
    }
  }, [token]);


  const searchArtists = async (e) => {
    e.preventDefault();
    const searchTerm = searchKey.trim();

    if (!searchTerm) {
      alert("검색어를 입력하세요.");
      return;
    }
    try {
      const response = await axios.post("/api/search", { searchTerm });
      if (response.status !== 200) {
        throw new Error("Failed to search artists");
      }
      const data = await response.data;

      setTopArtist(data.artist)
      setTopArtistTracks(data.artistTracks.slice(0, 6)); // 상위 6개 트랙
      setSearchTracks(data.searchTracks.slice(0, 1)); // 상위 1개 트랙

    } catch (error) {
      console.error(error.message);
    }
  };

  const handleTrackSelect = async (track) => {
    try {
      setSelectedTrack(track.name);
      setLoading(true);
      const response = await axios.post('/api/track/select', track);

      if (response.status !== 200) {
        throw new Error("Failed to send track");
      }

      const data = response.data;
      const Lyrics = data.lyrics;

      setLyrics(Lyrics);
      setTranslatedLyrics('');
      setIsTranslated(false); //false
      setLoading(false);

      const trackId = track.id;
      console.log("trackId: " + trackId);
      await axios.put(`https://api.spotify.com/v1/me/player/play`, {
        uris: [`spotify:track:${trackId}`]
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  }

  const handleTranslate = async () => {
    try {
      const response = await axios.post('/api/translate', { lyrics, targetLang });
      setTranslatedLyrics(response.data.text);
      setIsTranslated(true); //true
    } catch (error) {
      console.error('Error translating lyrics:', error.message);
    }
  }

  const toggleTranslation = () => {
    if (isTranslated) {
      setIsTranslated(false);
    } else {
      handleTranslate();
      setIsTranslated(true)
    }
  }

  const togglePlaylists = () => {
    setShowPlaylists(!showPlaylists);
  }

  const togglePlayer = () => {
    setShowPlayer(!showPlayer);
  }

  const handleLogout = () => {
    localStorage.removeItem('spotifyToken');
    setToken(null);
    window.location.href = '/'
  }


  return (
    <div className="App">
      <Header
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        searchArtists={searchArtists}
      />
      <Container>
        {topArtist ? (
          <SearchResult
            topArtist={topArtist}
            topArtistTracks={topArtistTracks}
            searchTracks={searchTracks}
            handleTrackSelect={handleTrackSelect}
          />
        ) : (
          <div className="hero">
            <h1>음악과 가사를 만나보세요!</h1>
            <p>좋아하는 아티스트를 검색하고, 노래의 가사와 번역을 감상하세요.</p>
          </div>
        )}
        {selectedTrack && (
          <Row>
            <Col>
              {loading ? (
                <Loading />
              ) : (
                <Translate
                  selectedTrack={selectedTrack}
                  lyrics={lyrics}
                  translatedLyrics={translatedLyrics}
                  isTranslated={isTranslated}
                  toggleTranslation={toggleTranslation}
                />
              )}
            </Col>
          </Row>
        )}
      </Container>

      {token && (
        <Playlist accessToken={token} showPlaylists={showPlaylists} />
      )}
      <div className={`player ${showPlayer ? 'expanded' : 'collapsed'}`}>
        {!token ? (
          <span onClick={getToken}>Login</span>
        ) : (
          <>
            <span onClick={handleLogout}>Logout</span>
            <Player
              track={track}
              paused={paused}
              togglePlaylists={togglePlaylists}
              player={player}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;