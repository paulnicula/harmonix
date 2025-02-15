import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import SongList from './SongList';
import { Container, Typography } from '@mui/material';

const MainContent = () => {
    const [songs, setSongs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get('/api/audiomanager/list_music/');
                setSongs(response.data.music_list);
            } catch (error) {
                console.error('Error fetching songs:', error);
                setError('Failed to load songs. Please try again later.');
            }
        };

        fetchSongs();
    }, []);

    const playTrack = (track) => {
        console.log('Playing track:', track);
    };

    return (
        <Container>
            {error && <Typography color="error">{error}</Typography>}
            <SongList songs={songs} onPlay={playTrack} />
        </Container>
    );
};

export default MainContent;
