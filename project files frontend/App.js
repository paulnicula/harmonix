import React, { useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Playlists from './components/Playlists';
import Genres from './components/Genres';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import theme from './Theme';
import { AuthProvider } from './components/AuthContext';
import UserDetails from "./components/UserDetails";
import UpgradePlan from "./components/UpgradePlan";
import UploadMusic from "./components/UploadMusic";
import Favorites from './components/Favorites';
import { AudioPlayerProvider } from './components/AudioPlayerContext';
import AuthRouteProtection from "./components/AuthRouteProtection";
import AudioPlayerComponent from "./components/AudioPlayer";
import PremiumPlanProtection from "./components/PremiumPlanProtection";
import SearchResults from "./components/SearchResults";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <ThemeProvider theme={theme}>
            <AudioPlayerProvider>
                <AuthProvider>
                    <Router>
                        <div className="app">
                            <CssBaseline />
                            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                            <div
                                className={`main ${isSidebarOpen ? 'main-shift' : ''}`}
                                style={{ marginLeft: isSidebarOpen ? 200 : 0 }}
                            >
                                <Navbar toggleSidebar={toggleSidebar} />
                                <div className="content">
                                    <Routes>
                                        <Route path="/" element={<Navigate to="/home" />} />
                                        <Route path="/home" element={<MainContent />} />
                                        <Route path="/playlists" element={<PremiumPlanProtection component={Playlists} />} />
                                        <Route path="/genres" element={<Genres />} />
                                        <Route path="/favorites" element={<AuthRouteProtection component={Favorites} />} />
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/register" element={<Register />} />
                                        <Route path="/user" element={<AuthRouteProtection component={UserDetails} />} />
                                        <Route path="/upgrade" element={<AuthRouteProtection component={UpgradePlan} />} />
                                        <Route path="/upload" element={<AuthRouteProtection component={UploadMusic} />} />
                                        <Route path="/search" element={<SearchResults />} />
                                    </Routes>
                                    <AudioPlayerComponent />
                                </div>
                            </div>
                            <div className="footer">
                                <Footer />
                            </div>
                        </div>
                    </Router>
                </AuthProvider>
            </AudioPlayerProvider>
        </ThemeProvider>
    );
}

export default App;
