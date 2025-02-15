import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from './axiosConfig';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import '../UploadMusic.css';

const UploadMusic = () => {
    const [artistName, setArtistName] = useState('');
    const [audioName, setAudioName] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [genre, setGenre] = useState('');
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const navigate = useNavigate();

    const genres = ['Pop', 'Rock', 'Jazz', 'Classical', 'Hip-Hop', 'Electronic', 'Country', 'Drum and Bass', 'Techno', 'Electronic'];

    const handleAudioFileChange = (e) => {
        setAudioFile(e.target.files[0]);
    };

    const handleCoverImageChange = (e) => {
        setCoverImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('artist_name', artistName);
        formData.append('audio_name', audioName);
        formData.append('audio_file', audioFile);
        formData.append('image', coverImage);
        formData.append('genre', genre);

        try {
            await axios.post('/api/audiomanager/upload_music/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setNotification({ open: true, message: 'Music uploaded successfully', severity: 'success' });
        } catch (error) {
            console.error('Upload failed:', error);
            setNotification({ open: true, message: 'Upload failed', severity: 'error' });
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
        if (notification.severity === 'success') {
            navigate('/home');
        }
    };

    return (
        <div className="upload-music-container">
            <form className="upload-form" onSubmit={handleSubmit}>
                <h2>Upload Music</h2>
                <TextField
                    label="Artist Name *"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    required
                />
                <TextField
                    label="Audio Name *"
                    value={audioName}
                    onChange={(e) => setAudioName(e.target.value)}
                    required
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="genre-label">Genre</InputLabel>
                    <Select
                        labelId="genre-label"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        required
                    >
                        {genres.map((genreOption) => (
                            <MenuItem key={genreOption} value={genreOption}>
                                {genreOption}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <label htmlFor="audio-upload" className="file-input-label">
                    {audioFile ? audioFile.name : 'CHOOSE AUDIO FILE'}
                </label>
                <input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileChange}
                    required
                />
                <label htmlFor="cover-upload" className="file-input-label">
                    {coverImage ? coverImage.name : 'CHOOSE COVER IMAGE'}
                </label>
                <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    required
                />
                <Button type="submit" variant="contained" color="primary" className="upload-button">
                    UPLOAD
                </Button>
            </form>
            {audioFile && (
                <div className="upload-preview">
                    <p>Selected Audio: {audioFile.name}</p>
                </div>
            )}
            {coverImage && (
                <div className="upload-preview">
                    <p>Selected Cover Image:</p>
                    <img src={URL.createObjectURL(coverImage)} alt="Cover Preview" />
                </div>
            )}
            <Notification
                open={notification.open}
                message={notification.message}
                onClose={handleCloseNotification}
                severity={notification.severity}
            />
        </div>
    );
};

export default UploadMusic;
