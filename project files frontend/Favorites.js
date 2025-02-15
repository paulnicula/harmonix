import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import SongList from './SongList';
import { Container, Typography } from '@mui/material';

const Favorites = () => {
    const [favoriteTracks, setFavoriteTracks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get('/api/audiomanager/get_favorites/');
                setFavoriteTracks(response.data.music_list);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                setError('Failed to load favorites. Please try again later.');
            }
        };

        fetchFavorites();
    }, []);

    const playTrack = (track) => {
        console.log('Playing track:', track);
    };

    return (
        <Container>
            {error && <Typography color="error">{error}</Typography>}
            <SongList songs={favoriteTracks} onPlay={playTrack} />
        </Container>
    );
};

export default Favorites;
