import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import SongList from './SongList';
import axios from './axiosConfig';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
    const [songs, setSongs] = useState([]);
    const [error, setError] = useState(null);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        if (query) {
            const fetchSongs = async () => {
                try {
                    const response = await axios.get(`/api/audiomanager/search_songs/?query=${encodeURIComponent(query)}`);
                    setSongs(response.data.music_list);
                } catch (error) {
                    console.error('Error fetching search results:', error);
                    setError('Failed to load search results. Please try again later.');
                }
            };

            fetchSongs();
        }
    }, [query]);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Search Results for "{query}"
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            {songs.length > 0 ? (
                <SongList songs={songs} />
            ) : (
                <Typography variant="body1" color="textSecondary">
                    No songs found.
                </Typography>
            )}
        </Container>
    );
};

export default SearchResults;
