import React from 'react'
import './Player.style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward, faList } from '@fortawesome/free-solid-svg-icons';

const Player = ({ track, paused, togglePlaylists, handlePlayPause, handleNextTrack, handlePrevTrack }) => {
    return (
        <div className='player-container'>
            <div className='now-playing'>
                {track && (
                    <div className='playtrack-info'>
                        <img className='playtrack-img' src={track.album.images[0].url} alt={track.name} />
                        <div className="playback-details">
                            <div className='playtrack-name'>{track.name}</div>
                            <div className='playtrack-artist'>{track.artists[0].name}</div>
                        </div>
                    </div>
                )}
            </div>
            <div className="player-btn">
                <button onClick={togglePlaylists}><FontAwesomeIcon icon={faList} /></button>
                <button onClick={handlePrevTrack}><FontAwesomeIcon icon={faBackward} /></button>
                <button onClick={handlePlayPause}><FontAwesomeIcon icon={paused ? faPlay : faPause} /></button>
                <button onClick={handleNextTrack}><FontAwesomeIcon icon={faForward} /></button>
            </div>
        </div>
    )
}

export default Player