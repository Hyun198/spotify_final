import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './App.css';
import Header from './Component/Header';
import SearchResult from './Component/SearchResult';
import Translate from './Component/Translate';
import Loading from './Component/Loading';

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


  return (
    <div className="App">
      <h1 className='title'><a href="/">Spotify Genius</a></h1>

      <Header
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        searchArtists={searchArtists}

      />

      <Container>
        {topArtist && (
          <SearchResult
            topArtist={topArtist}
            topArtistTracks={topArtistTracks}
            searchTracks={searchTracks}
            handleTrackSelect={handleTrackSelect}

          />
        )}
        {selectedTrack && (
          <Row>
            <Col>
              {loading ? (
                <Loading />
              ) : (<Translate
                selectedTrack={selectedTrack}
                lyrics={lyrics}
                translatedLyrics={translatedLyrics}
                isTranslated={isTranslated}
                toggleTranslation={toggleTranslation}
              />)}
            </Col>
          </Row>

        )}
      </Container>

    </div>
  );
}

export default App;