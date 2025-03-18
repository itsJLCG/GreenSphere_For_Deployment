import { Button, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { SetIsLoggedInContext } from '../App';
import LogoutIcon from '@mui/icons-material/ExitToApp';

const Logout = () => {
    const setIsLoggedIn = useContext(SetIsLoggedInContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            const response = await axios.post("http://localhost:3001/logout", null, { withCredentials: true });
            if (response.status === 200) {
                setIsLoggedIn(false);
                navigate("/login");
            }
        } catch (error) {
            console.log("Error logging out", error);
        }
    };

    // Consistent button styling with the Navbar design
    const buttonStyle = {
        marginRight: '12px',
        fontSize: '0.9rem',
        fontWeight: '500',
        padding: '0.5rem 1.2rem',
        borderRadius: '8px',
        textTransform: 'none', // Prevent uppercase transformation
        transition: 'all 0.3s ease',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white
        color: '#FFFFFF', // White text
        border: '1px solid rgba(255, 255, 255, 0.3)', // Subtle border
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slightly brighter on hover
            borderColor: 'rgba(255, 255, 255, 0.5)', // Brighter border on hover
            transform: 'translateY(-1px)', // Slight lift effect
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow on hover
        },
    };

    // Check if the user is on the admin page
    const isAdminPage = location.pathname === "/adminhome";

    return isAdminPage ? (
        <ListItem 
            button 
            onClick={handleLogout} 
            sx={{ 
                color: '#FFFFFF', // White text
                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
                border: '1px solid rgba(255, 255, 255, 0.3)', // Subtle border
                borderRadius: '8px',
                marginRight: '12px',
                transition: 'all 0.3s ease',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Brighter on hover
                    borderColor: 'rgba(255, 255, 255, 0.5)', // Brighter border on hover
                    transform: 'translateY(-1px)', // Slight lift effect
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow on hover
                },
            }}
        >
            <ListItemIcon sx={{ color: '#FFFFFF' }}>
                <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: '#FFFFFF' }} />
        </ListItem>
    ) : (
        <Button 
            sx={buttonStyle} 
            onClick={handleLogout}
            variant="outlined"
        >
            Logout
        </Button>
    );
};

export default Logout;