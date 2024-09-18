import React from 'react'
import './SearchResult.style.css';

const SearchResult = ({ topArtist, topArtistTracks, searchTracks, handleTrackSelect }) => {

    if (!topArtist || (topArtistTracks.length === 0 && searchTracks.length === 0)) {
        return <div className="no-result">검색 결과가 없습니다.</div>
    }

    return (
        <div className="search-result">
            <div className="top-artist-column">
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


            </div>
            <div className="top-artist-tracks-column">
                <h2>Related Tracks</h2>
                <div className="top-artist-tracks">

                    {topArtistTracks.slice(0, 6).map((track) => (
                        <div key={track.id} className="top-artist-track" onClick={() => handleTrackSelect({ id: track.id, name: track.name, artist: track.artists[0].name })}>
                            <img className="track-image" src={track.album.images[0].url} alt={track.album.name} />
                            <div className="track-name">{track.name}</div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SearchResult