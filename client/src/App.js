import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import React from 'react';
import './App.css';

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
      console.log(data);

      setTopArtist(data.artist)
      setTopArtistTracks(data.artistTracks);
      setSearchTracks(data.searchTracks);
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
      <h1 className='title'>Spotify Clone</h1>

      <header className="header_container">
        <form className="search_box" onSubmit={searchArtists} >
          <box-icon name='search-alt'></box-icon>
          <input className="search-input" type="text" placeholder='아티스트,노래' value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />
          <button className="search-btn" type="submit">검색</button>
        </form>
      </header>
      <Container>
        <Row className="search-result">
          <Col className="top-artist-column">
            {topArtist && (
              <div className="top-artist">
                <img className="topArtist_img" src={topArtist.images[0].url} alt={topArtist.name} />
                <p className="top-artist-name">{topArtist.name}</p>
                <div className='top-artist-info'>
                  {topArtist.genres.map(genre => (
                    <p key={genre} className='genre'>{genre}</p>
                  ))}
                </div>
              </div>
            )}
          </Col>
          <Col className="top-artist-tracks-column">
            <div className="top-artist-tracks">
              {topArtistTracks.slice(0, 6).map((track) => (
                <div key={track.id} className="top-artist-track" onClick={() => handleTrackSelect({ name: track.name, artist: track.artists[0].name })}>
                  <img className="track-image" src={track.album.images[0].url} alt={track.album.name} />
                  <div className="track-name">{track.name}</div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="lyrics_container">
              <h2 className="selectedTrack-title">{selectedTrack}</h2>
              <button className="translate-btn" onClick={toggleTranslation}>
                {isTranslated ? '돌아가기' : '번역'}
              </button>
              <pre className='lyrics'>{isTranslated ? translatedLyrics : lyrics}</pre>
            </div>
          </Col>
        </Row>
      </Container>

    </div>
  );
}

export default App;