import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from './axiosConfig';
import PayPalButton from './PayPalButton';
import Notification from './Notification';
import '../UpgradePlan.css';

const UpgradePlan = () => {
    const navigate = useNavigate();
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const handleSuccess = async (details, planId) => {
        console.log('Payment Successful:', details);
        try {
            const response = await axios.post('/api/userauth/update-user-plan/', {
                planId,
                paymentDetails: details,
            });
            console.log('Plan update successful:', response.data);
            setNotification({ open: true, message: 'Plan updated successfully!', severity: 'success' });
            setTimeout(() => {
                navigate('/home');
            }, 2000);
        } catch (error) {
            console.error('Error updating user plan:', error);
            setNotification({ open: true, message: 'Failed to update plan. Please try again.', severity: 'error' });
        }
    };

    const handleError = (err) => {
        console.error('Payment Error:', err);
        setNotification({ open: true, message: 'Payment failed. Please try again.', severity: 'error' });
    };

    const handleNotificationClose = () => {
        setNotification({ open: false, message: '', severity: 'success' });
    };

    return (
        <Container>
            <Box className="upgrade-plan-container">
                <Typography className="upgrade-plan-header" variant="h4" gutterBottom>
                    Upgrade Your Plan
                </Typography>
                <Card className="upgrade-plan-card">
                    <CardContent>
                        <Typography className="upgrade-plan-text" variant="h5" component="div">
                            Premium Plan
                        </Typography>
                        <Typography className="upgrade-plan-price" variant="body2">
                            $20 one time payment
                        </Typography>
                        <ul>
                            <li>Ad-supported streaming</li>
                            <li>Create playlists</li>
                        </ul>
                        <PayPalButton amount="20.00" onSuccess={(details) => handleSuccess(details, 'premium')} onError={handleError} planId="premium" />
                    </CardContent>
                </Card>
            </Box>
            <Notification
                open={notification.open}
                message={notification.message}
                onClose={handleNotificationClose}
                severity={notification.severity}
            />
        </Container>
    );
};

export default UpgradePlan;
