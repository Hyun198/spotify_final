import React, { useEffect, useState } from 'react'
import axios from 'axios'
const Playlists = ({ accessToken }) => {

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
                console.log(response);
                setPlaylists(response.data.items);
            } catch (error) {
                console.error('error fetching playlists: ', error);
            }
        };

        if (accessToken) {
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
            console.log(response);
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
        <div>Playlists
            <ul>
                {playlists.map((playlist) => (
                    <li key={playlist.id} onClick={() => handlePlaylistClick(playlist.id)}>
                        {playlist.name}
                    </li>
                ))}
            </ul>
            {selectedPlaylistId && (
                <div className="tracks">
                    <h3>Tracks</h3>
                    <ul>
                        {tracks.map((trackItem) => (
                            <li key={trackItem.track.id}>{trackItem.track.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Playlists