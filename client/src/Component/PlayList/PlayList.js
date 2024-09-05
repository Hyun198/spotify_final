import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './PlayList.style.css'

const Playlist = ({ accessToken, showPlaylists, handleAddToPlaylist }) => {

    const [playlists, setPlaylists] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

    useEffect(() => {
        const fetchPlayLists = async () => {
            try {
                const response = await axios.get(`https://api.spotify.com/v1/me/playlists`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setPlaylists(response.data.items);
            } catch (error) {
                console.error('error fetching playlists: ', error);
            }
        };

        if ([accessToken && showPlaylists]) {
            fetchPlayLists();
        }
    }, [accessToken]);

    const fetchTracks = async (playlistId) => {
        try {
            const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setTracks(response.data.items);
        } catch (error) {
            console.error('error fetching tracks in playlist: ', error);
        }
    };

    const handlePlaylistClick = (playlistId) => {
        setSelectedPlaylistId(playlistId);
        fetchTracks(playlistId);
    }



    return (
        <div className={`playlists ${showPlaylists ? 'show' : 'hide'}`}>
            <div className="playlists-header">
                <span>Playlists</span>
            </div>
            <ul className="playlist-list">
                {playlists.map((playlist) => (
                    <li key={playlist.id} onClick={() => handlePlaylistClick(playlist.id)}>
                        {playlist.name}
                    </li>
                ))}
            </ul>
            {selectedPlaylistId && (
                <div className="tracks-header">
                    <span>Tracks</span>
                    <ul>
                        {tracks.map((trackItem) => (
                            <li key={trackItem.track.id}>
                                {trackItem.track.name}
                                <button onClick={() => handleAddToPlaylist(selectedPlaylistId, trackItem.track.uri)}>Add</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Playlist