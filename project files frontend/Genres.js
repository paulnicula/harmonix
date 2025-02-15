import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import Playlist from './Playlist';
import { Container, Typography } from '@mui/material';

const Genres = () => {
    const [playlists, setPlaylists] = useState({});
    const [error, setError] = useState(null);



    useEffect(() => {
        const fetchSongsByGenre = async (genre) => {
            try {
                const response = await axios.get(`/api/audiomanager/songs_by_genre/${genre}/`);
                return response.data.music_list;
            } catch (error) {
                console.error(`Error fetching songs for genre ${genre}:`, error);
                setError(`Failed to load songs for ${genre}. Please try again later.`);
                return [];
            }
        };

        const fetchAllPlaylists = async () => {
            const playlistMap = {};
            const genres = ['Pop', 'Rock', 'Jazz', 'Classical', 'Hip-Hop', 'Electronic', 'Country', 'Drum and Bass', 'Techno', 'Electronic'];
            for (const genre of genres) {
                const songs = await fetchSongsByGenre(genre);
                playlistMap[genre] = songs;
            }

            setPlaylists(playlistMap);
        };

        fetchAllPlaylists();
    }, []);

    return (
        <Container>
            {error && <Typography color="error">{error}</Typography>}
            {Object.keys(playlists).map((genre) => (
                <Playlist key={genre} name={genre} songs={playlists[genre]} />
            ))}
        </Container>
    );
};

export default Genres;
