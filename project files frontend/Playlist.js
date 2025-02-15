import React, { useState } from 'react';
import { Container, Typography, Collapse, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SongList from './SongList';
import axios from './axiosConfig';

const Playlist = ({ id, name, songs, onDelete, canDelete = false }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openDeleteSongDialog, setOpenDeleteSongDialog] = useState(false);
    const [selectedSongId, setSelectedSongId] = useState(null);
    const [playlistSongs, setPlaylistSongs] = useState(songs);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleDeleteClick = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`/api/audiomanager/playlists/${id}/delete/`);
            onDelete(id);
        } catch (error) {
            console.error('Error deleting playlist:', error);
        } finally {
            handleCloseDialog();
        }
    };

    const handleDeleteSongClick = (songId) => {
        setSelectedSongId(songId);
        setOpenDeleteSongDialog(true);
    };

    const handleCloseSongDialog = () => {
        setOpenDeleteSongDialog(false);
        setSelectedSongId(null);
    };

    const handleConfirmDeleteSong = async () => {
        try {
            await axios.post(`/api/audiomanager/playlists/${id}/remove/`, { track_id: selectedSongId });
            setPlaylistSongs(playlistSongs.filter(song => song.id !== selectedSongId));
        } catch (error) {
            console.error('Error deleting song from playlist:', error);
        } finally {
            handleCloseSongDialog();
        }
    };

    return (
        <Container>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button onClick={toggleExpand} variant="outlined" fullWidth style={{ marginBottom: '10px' }}>
                    <Typography variant="h6">
                        {name}
                    </Typography>
                </Button>
                {canDelete && (
                    <IconButton onClick={handleDeleteClick}>
                        <DeleteIcon />
                    </IconButton>
                )}
            </div>
            <Collapse in={isExpanded}>
                <SongList
                    songs={playlistSongs}
                    playlistId={id}
                    onDeleteSong={handleDeleteSongClick}
                    canDelete={canDelete}
                />
            </Collapse>


            {canDelete && (
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleCloseDialog}
                >
                    <DialogTitle>{"Delete Playlist"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete the playlist "{name}"? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            )}


            <Dialog
                open={openDeleteSongDialog}
                onClose={handleCloseSongDialog}
            >
                <DialogTitle color="secondary">{"Delete Song"}</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ color: '#ffffff'}}>
                        Are you sure you want to remove this song from the playlist? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSongDialog} style={{ color: '#ffffff'}}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDeleteSong} color="secondary" autoFocus>
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Playlist;
