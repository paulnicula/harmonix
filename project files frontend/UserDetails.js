import React, { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import axios from './axiosConfig';
import '../UserDetails.css';

const UserDetails = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get('/api/userauth/user/');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container>
            <Box className="user-details-container">
                <Typography className="user-details-header" variant="h4" gutterBottom>
                    User Details
                </Typography>
                <Typography className="user-details-item" variant="body1">
                    <span className="user-details-label">Username:</span> {user.username}
                </Typography>
                <Typography className="user-details-item" variant="body1">
                    <span className="user-details-label">Email:</span> {user.email}
                </Typography>
                <Typography className="user-details-item" variant="body1">
                    <span className="user-details-label">Current Plan:</span> {user.plan_type}
                </Typography>
            </Box>
        </Container>
    );
};

export default UserDetails;
