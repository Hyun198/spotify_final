import React from 'react'
import { Row, Col } from 'react-bootstrap';

const SearchResult = ({ topArtist, topArtistTracks, searchTracks, handleTrackSelect }) => {
    return (
        <Row className="search-result">
            <Col className="top-artist-column">
                <div className="top-artist">
                    <img className="topArtist_img" src={topArtist.images[0].url} alt={topArtist.name} />
                    <p className="top-artist-name">{topArtist.name}</p>
                    <div className='top-artist-info'>
                        {topArtist.genres.map(genre => (
                            <p key={genre} className='genre'>{genre}</p>
                        ))}
                    </div>
                </div>
                {searchTracks.length > 0 && (
                    <div className="top-track" onClick={() => handleTrackSelect({ name: searchTracks[0].name, artist: searchTracks[0].artists[0].name })}>
                        <img className="top-track-image" src={searchTracks[0].album.images[0].url} alt={searchTracks[0].album.name} />
                        <div className="top-track-name">{searchTracks[0].name}</div>
                    </div>
                )}

            </Col>
            <Col className="top-artist-tracks-column">
                <h2>Related Tracks</h2>
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
    )
}

export default SearchResult