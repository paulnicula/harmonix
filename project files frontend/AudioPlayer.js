import React, { useEffect, useRef, useState } from 'react';
import ReactH5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useAudioPlayer } from './AudioPlayerContext';
import Hls from 'hls.js';
import '../AudioPlayer.css';
import { IconButton } from '@mui/material';
import {CloseFullscreen, SettingsOverscan} from "@mui/icons-material";

const AudioPlayerComponent = () => {
    const { currentTrack, isPlaying, setIsPlaying, skipToNext, skipToPrevious } = useAudioPlayer();
    const audioPlayerRef = useRef(null);
    const hls = useRef(null);
    const currentTime = useRef(0);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const activeElement = document.activeElement;
            const isInputFocused =
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.isContentEditable;

            if (!isInputFocused && event.code === 'Space') {
                event.preventDefault();
                if (audioPlayerRef.current) {
                    if (isPlaying) {
                        currentTime.current = audioPlayerRef.current.audio.current.currentTime;
                        audioPlayerRef.current.audio.current.pause();
                    } else {
                        audioPlayerRef.current.audio.current.currentTime = currentTime.current;
                        audioPlayerRef.current.audio.current.play();
                    }
                    setIsPlaying(!isPlaying);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPlaying, setIsPlaying]);

    useEffect(() => {
        if (!currentTrack?.hls_file) {
            console.error('Wrong Hls File!!');
            return;
        }

        currentTime.current = 0;

        const audio = audioPlayerRef.current.audio.current;

        if (Hls.isSupported()) {
            if (hls.current) {
                hls.current.destroy();
            }

            const hlsInstance = new Hls();
            hls.current = hlsInstance;

            hlsInstance.loadSource(currentTrack.hls_file.trim());
            hlsInstance.attachMedia(audio);

            hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                audio.currentTime = currentTime.current;
            });

            hlsInstance.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.error('HLS fatal error:', data.type);
                    hlsInstance.destroy();
                }
            });

            return () => {
                hlsInstance.destroy();
            };
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            audio.src = currentTrack.hls_file;
            audio.currentTime = currentTime.current;
        }
    }, [currentTrack]);

    const handleToggleMinimize = () => {
        setIsMinimized((prev) => !prev);
    };

    return (
        <div className={`audio-player ${isMinimized ? 'minimized' : ''}`}>
            <ReactH5AudioPlayer
                ref={audioPlayerRef}
                autoPlay={true}
                onPlay={() => setIsPlaying(true)}
                onPause={() => {
                    currentTime.current = audioPlayerRef.current.audio.current.currentTime;
                    setIsPlaying(false);
                }}
                onEnded={skipToNext}
                showSkipControls={true}
                showJumpControls={true}
                layout="stacked-reverse"
                listenInterval={1000}
                onClickPrevious={skipToPrevious}
                onClickNext={skipToNext}
                onClickProgress={(e) => {
                    const audio = audioPlayerRef.current.audio.current;
                    const progressWidth = e.currentTarget.clientWidth;
                    const clickPosition = e.nativeEvent.offsetX;
                    const duration = audio.duration;
                    const bufferedEnd = audio.buffered.length ? audio.buffered.end(audio.buffered.length - 1) : 0;
                    const clickTime = (clickPosition / progressWidth) * duration;

                    if (clickTime <= bufferedEnd) {
                        audio.currentTime = clickTime;
                    } else {
                        console.log('Clicked on unbuffered area');
                    }
                }}
                customAdditionalControls={[
                    <IconButton key="minimize" onClick={handleToggleMinimize} style={{ color: '#ffffff' }}>
                        {isMinimized ? <SettingsOverscan /> : <CloseFullscreen />}
                    </IconButton>,
                ]}
            />
        </div>
    );
};

export default AudioPlayerComponent;
