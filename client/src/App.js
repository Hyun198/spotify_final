import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './App.css';

import { getToken, getAccessTokenFromUrl } from './Component/Auth';
import Header from './Component/Header';
import SearchResult from './Component/SearchResult';
import Translate from './Component/Translate';
import Loading from './Component/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward } from '@fortawesome/free-solid-svg-icons';

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

        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
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

  const handlePlayPause = () => {
    player.togglePlay().then(() => {
      console.log('Toggled playback!');
    }).catch(error => {
      console.error('Error toggling playback', error);
    });
  };

  const handleNextTrack = () => {
    player.nextTrack().then(() => {
      console.log('Skipped to next track!');
    }).catch(error => {
      console.error('Error skipping to next track', error);
    });
  };

  const handlePrevTrack = () => {
    player.previousTrack().then(() => {
      console.log('Skipped to previous track!');
    }).catch(error => {
      console.error('Error skipping to previous track', error);
    });
  };





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
      <div className="player">
        {!token ? (
          <button onClick={getToken}>Login with Spotify</button>
        ) : (
          <div className='player-container'>
            <div className='now-playing'>
              {track && (

                <div className='playtrack-info'>
                  <img className='playtrack-img' src={track.album.images[0].url} alt={track.name} />
                  <div className="playback-details">
                    <div className='playtrack-name'>{track.name}</div>
                    <div className='playtrack-artist'>{track.artists[0].name}</div>
                    {/*  <div className='playtrack-progress'> {position} / {duration}</div> */}

                  </div>

                </div>
              )}
            </div>
            <div className="player-btn">
              <button onClick={handlePrevTrack}><FontAwesomeIcon icon={faBackward} /></button>
              <button onClick={handlePlayPause}><FontAwesomeIcon icon={paused ? faPlay : faPause} /></button>
              <button onClick={handleNextTrack}><FontAwesomeIcon icon={faForward} /></button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;