import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box component="footer" sx={{ p: 2, backgroundColor: '#4f4f4f', textAlign: 'center' }}>
            <Typography variant="body2" color="#ffffff">
                This is the Harmonix Application.
            </Typography>
        </Box>
    );
};

export default Footer;
