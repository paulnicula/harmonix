import React from 'react';
import SongItem from './SongItem';
import { Container, Typography } from '@mui/material';
import { useAudioPlayer } from './AudioPlayerContext';

const SongList = ({ songs, playlistId, onDeleteSong, canDelete = false }) => {
    const { playTrack } = useAudioPlayer();

    const handlePlay = (track) => {
        playTrack(track, songs);
    };

    return (
        <Container>
            {songs.length > 0 ? (
                songs.map((track) => (
                    <SongItem
                        key={track.id}
                        track={track}
                        onPlay={handlePlay}
                        canDelete={canDelete}
                        onDeleteSong={onDeleteSong}
                    />
                ))
            ) : (
                <Typography variant="body1" color="textSecondary">
                    No songs available.
                </Typography>
            )}
        </Container>
    );
};

export default SongList;
