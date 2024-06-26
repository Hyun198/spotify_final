import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import React from 'react';
import './App.css';
import Header from './Component/Header';
import SearchResult from './Component/SearchResult';
import Translate from './Component/Translate';


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
      console.log(track);
      setSelectedTrack(track.name);
      const response = await axios.post('/api/track/select', track);

      if (response.status !== 200) {
        throw new Error("Failed to send track");
      }

      const data = response.data;
      const Lyrics = data.lyrics;

      setLyrics(Lyrics);
      setTranslatedLyrics('');
      setIsTranslated(isTranslated) //false

    } catch (error) {
      console.error(error.message);
    }
  }

  const handleTranslate = async () => {
    try {
      const response = await axios.post('/api/translate', { lyrics, targetLang });
      setTranslatedLyrics(response.data.text);
      setIsTranslated(!isTranslated); //true
      console.log('번역완료');

    } catch (error) {
      console.error('Error translating lyrics:', error.message);
    }
  }

  const toggleTranslation = () => {
    handleTranslate();
    setIsTranslated(!isTranslated)
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
          <Translate
            selectedTrack={selectedTrack}
            lyrics={lyrics}
            translatedLyrics={translatedLyrics}
            isTranslated={isTranslated}
            toggleTranslation={toggleTranslation}
          />
        )}
      </Container>

    </div>
  );
}

export default App;