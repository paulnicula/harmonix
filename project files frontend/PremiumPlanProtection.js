import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import axios from './axiosConfig';
import {Box, Container, Typography} from "@mui/material";

const PremiumPlanProtection = ({ component: Component, ...rest }) => {
    const { authState } = useAuth();
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserPlan = async () => {
            try {
                const response = await axios.get('/api/userauth/get-user-plan/');
                setIsPremium(response.data.plan_type === 'premium');
            } catch (error) {
                console.error('Failed to fetch user plan:', error);
            } finally {
                setLoading(false);
            }
        };

        if (authState.isAuthenticated) {
            fetchUserPlan();
        } else {
            setLoading(false);
        }
    }, [authState]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (authState.isAuthenticated && isPremium) {
        return <Component {...rest} />;
    } else {
        return (
            <Container style={{ textAlign: 'center', marginTop: '50px' }}>
                <Typography variant="h4" color="error">
                    Access Restricted
                </Typography>
                <Typography variant="body1" color="#ffffff">
                    You must be a premium user to access the content of this page.
                </Typography>
                <Box mt={2}>
                    <Typography variant="body2" color="#ffffff">
                        Go to our <a href="/upgrade" style={{ textDecoration: 'none', color: '#3f51b5' }}>upgrade plan page</a> and purchase the premium plan to get full access.
                    </Typography>
                </Box>
            </Container>
        );
    }

};

export default PremiumPlanProtection;
