import React from 'react';
import { useAuth } from './AuthContext';
import {Box, Container, Typography} from '@mui/material';

const AuthRoute = ({ component: Component, ...rest }) => {
    const { authState } = useAuth();

    if (authState.isAuthenticated) {
        return <Component {...rest} />;
    } else {
        return (
            <Container style={{ textAlign: 'center', marginTop: '50px' }}>
                <Typography variant="h4" color="error">
                    Access Restricted
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    You must be logged in to access all features of this page.
                </Typography>
                <Box mt={2}>
                    <Typography variant="body2" color="textSecondary">
                        Please <a href="/login" style={{ textDecoration: 'none', color: '#3f51b5' }}>log in</a> or <a href="/register" style={{ textDecoration: 'none', color: '#3f51b5' }}>register</a> to get full access.
                    </Typography>
                </Box>
            </Container>
        );
    }
};

export default AuthRoute;
