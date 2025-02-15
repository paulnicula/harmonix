import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, TextField, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Navbar = ({ toggleSidebar }) => {
    const { authState } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        if (event.key === 'Enter') {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#333' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ marginLeft: 2 }}>
                        <Link to="/home" style={{ color: 'inherit', textDecoration: 'none' }}>
                            Harmonix
                        </Link>
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    <TextField
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchSubmit}
                        placeholder="Search songs..."
                        variant="outlined"
                        size="small"
                        sx={{
                            backgroundColor: '#444',
                            borderRadius: 1,
                            input: { color: '#fff' },
                            width: '60%',
                            maxWidth: '400px',
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {authState.isAuthenticated ? (
                        <div>
                            <Button color="inherit" component={Link} to="/upload">
                                Upload
                            </Button>
                            <Button color="inherit" component={Link} to="/user">
                                {authState.user ? authState.user.username : 'User'}
                            </Button>
                        </div>
                    ) : (
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
