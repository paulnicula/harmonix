import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import Playlist from './Playlist';
import { Container, Typography, TextField, Button } from '@mui/material';

const Playlists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState(null);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axios.get('/api/audiomanager/playlists/');
                setPlaylists(response.data.playlists);
            } catch (error) {
                console.error('Error fetching playlists:', error);
                setError('Failed to load playlists. Please try again later.');
            }
        };

        fetchPlaylists();
    }, []);

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) {
            alert("Playlist name cannot be empty.");
            return;
        }

        try {
            const response = await axios.post('/api/audiomanager/playlists/create/', { name: newPlaylistName });
            setPlaylists([...playlists, { id: response.data.playlist_id, name: newPlaylistName, tracks: [] }]);
            setNewPlaylistName('');
        } catch (error) {
            console.error('Error creating playlist:', error);
            setError('Failed to create playlist. Please try again later.');
        }
    };

    const handleDeletePlaylist = (playlistId) => {
        setPlaylists(playlists.filter(playlist => playlist.id !== playlistId));
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Your Playlists
            </Typography>
            {error && <Typography color="error">{error}</Typography>}

            <div style={{ marginBottom: '20px' }}>
                <TextField
                    label="New Playlist Name"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={handleCreatePlaylist}>
                    Create Playlist
                </Button>
            </div>

            {playlists.map((playlist) => (
                <Playlist
                    key={playlist.id}
                    id={playlist.id}
                    name={playlist.name}
                    songs={playlist.tracks}
                    canDelete={true}
                    onDelete={handleDeletePlaylist}
                />
            ))}
        </Container>
    );
};

export default Playlists;
