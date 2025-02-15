import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import CategoryIcon from '@mui/icons-material/Category';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';

const SIDEBAR_WIDTH = 200;

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toggleSidebar();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Drawer
            sx={{
                width: SIDEBAR_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: SIDEBAR_WIDTH,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                },
            }}
            variant="temporary"
            anchor="left"
            open={isOpen}
            onClose={toggleSidebar}
            ModalProps={{
                keepMounted: true,
            }}
        >
            <List sx={{ flexGrow: 1 }}>
                <Box sx={{ mt: 7 }} />
                <ListItem button component={Link} to="/home" onClick={toggleSidebar}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/playlists" onClick={toggleSidebar}>
                    <ListItemIcon>
                        <PlaylistPlayIcon />
                    </ListItemIcon>
                    <ListItemText primary="Playlists" />
                </ListItem>
                <ListItem button component={Link} to="/genres" onClick={toggleSidebar}>
                    <ListItemIcon>
                        <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Genres" />
                </ListItem>
                <ListItem button component={Link} to="/favorites" onClick={toggleSidebar}>
                    <ListItemIcon>
                        <FavoriteIcon />
                    </ListItemIcon>
                    <ListItemText primary="Favorites" />
                </ListItem>
            </List>
            <List>
                <ListItem button component={Link} to="/upgrade" onClick={toggleSidebar}>
                    <ListItemIcon>
                        <UpgradeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Upgrade Plan" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sign Out" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
