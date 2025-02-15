import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4f4f4f', // Primary color
        },
        secondary: {
            main: '#ff4081', // Secondary color
        },
        background: {
            default: '#1a1a1a',
        },
    },
    typography: {
        h6: {
            fontSize: '1.5rem',
        },
        body1: {
            fontSize: '1rem',
            color: "#FFFFFFFF",
        },

    },
    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#4F4F4FFF', // Example to change background color of drawer
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    color: '#FFFFFFFF', // Customize text color
                    fontSize: '15px', // Customize font size
                },
            },
        },
    },
});

export default theme;
