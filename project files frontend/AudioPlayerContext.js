import React, { createContext, useContext, useState } from 'react';

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const playTrack = (track, songs = []) => {
        setPlaylist(songs);
        const index = songs.findIndex((song) => song.id === track.id);
        setCurrentIndex(index);
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const skipToNext = () => {
        if (currentIndex < playlist.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setCurrentTrack(playlist[nextIndex]);
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    };

    const skipToPrevious = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            setCurrentTrack(playlist[prevIndex]);
            setIsPlaying(true);
        }
    };

    return (
        <AudioPlayerContext.Provider value={{
            currentTrack,
            setCurrentTrack,
            isPlaying,
            setIsPlaying,
            playTrack,
            skipToNext,
            skipToPrevious
        }}>
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
