import React, { useState } from 'react';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import axios from './axiosConfig';
import '../SongItem.css';
import { Menu, MenuItem } from '@mui/material';
import Notification from './Notification';

const SongItem = ({ track, onToggleFavorite, onPlay, canDelete = false, onDeleteSong }) => {
    const [isFavorited, setIsFavorited] = useState(track.is_favorited);
    const [playlists, setPlaylists] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const handlePlay = () => {
        onPlay(track);
    };

    const toggleFavorite = async () => {
        try {
            await axios.post(`/api/audiomanager/toggle_favorite/${track.id}/`);
            setIsFavorited(!isFavorited);
            console.log(`Toggled favorite status for track ID ${track.id}`);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleDeleteSong = (e) => {
        e.stopPropagation();
        onDeleteSong(track.id);
    };

    const fetchUserPlaylists = async () => {
        try {
            const response = await axios.get('/api/audiomanager/playlists/');
            setPlaylists(response.data.playlists);
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    const handleAddToPlaylist = async (playlistId, e) => {
        e.stopPropagation();
        try {
            await axios.post(`/api/audiomanager/playlists/${playlistId}/add/`, { track_id: track.id });
            setNotificationMessage('Track added to playlist successfully!');
            setNotificationOpen(true);
            setAnchorEl(null);
        } catch (error) {
            console.error('Error adding track to playlist:', error);
            setNotificationMessage('Failed to add track to playlist');
            setNotificationOpen(true);
        }
    };

    const handleClick = (event) => {
        event.stopPropagation();
        fetchUserPlaylists();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const handleNotificationClose = () => {
        setNotificationOpen(false);
    };

    return (
        <div className="track-item" onClick={handlePlay}>
            <img
                src={track.image}
                alt={track.audio_name}
                className="track-image"
            />
            <div className="track-info">
                <h3>{track.artist_name} - {track.audio_name}</h3>
                <button
                    className="favorite-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite();
                    }}
                >
                    {isFavorited ? (
                        <FavoriteIcon className="favorite-icon" />
                    ) : (
                        <FavoriteBorderIcon className="favorite-icon" />
                    )}
                </button>
                {canDelete && (
                    <IconButton onClick={handleDeleteSong}>
                        <DeleteIcon />
                    </IconButton>
                )}
                <IconButton
                    onClick={handleClick}
                >
                    <PlaylistAddIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {playlists.map((playlist) => (
                        <MenuItem key={playlist.id} onClick={(e) => handleAddToPlaylist(playlist.id, e)}>
                            {playlist.name}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
            <PlayCircleOutlineIcon className="play-icon" />
            <Notification
                open={notificationOpen}
                message={notificationMessage}
                onClose={handleNotificationClose}
                severity={notificationMessage.includes('successfully') ? 'success' : 'error'}
            />
        </div>
    );
};

export default SongItem;
