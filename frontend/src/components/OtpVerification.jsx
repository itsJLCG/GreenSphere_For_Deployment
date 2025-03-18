import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import greensphereLogo from "../assets/images/greenspherelogo.png";

const OtpVerification = () => {
    const location = useLocation();
    const [email] = useState(location.state?.email || '');
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const inputRefs = useRef([]);
    const [resendCooldown, setResendCooldown] = useState(30);
    const [isResending, setIsResending] = useState(false);

    // Function to mask email for privacy
    const maskEmail = (email) => {
        if (!email.includes('@')) return email;
        const [name, domain] = email.split("@");
        const maskedName = name.substring(0, 2) + "*".repeat(Math.max(0, name.length - 2));
        return `${maskedName}@${domain}`;
    };

    useEffect(() => {
        inputRefs.current[0]?.focus(); // Auto-focus first input
    }, []);

    useEffect(() => {
        let interval;
        if (resendCooldown > 0) {
            interval = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendCooldown]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Allow only numbers

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-move focus
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all boxes are filled
        if (newOtp.join('').length === 6) {
            handleVerifyOtp(newOtp.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = async (enteredOtp) => {
        try {
            const response = await axios.post('http://localhost:3001/verify-otp', { email, otp: enteredOtp });
            if (response.status === 200) {
                toast.success('OTP Verified Successfully!', {
                    position: "top-center",
                    autoClose: 2000,
                    theme: "dark"
                });
                setTimeout(() => navigate('/login'), 2500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
            toast.error('Invalid OTP! Please try again.', {
                position: "top-center",
                autoClose: 2000,
                theme: "dark"
            });
        }
    };

    const handleResendOtp = async () => {
        setIsResending(true);
        try {
            await axios.post('http://localhost:3001/resend-otp', { email });
            toast.success('New OTP sent to your email!', {
                position: "top-center",
                autoClose: 2000,
                theme: "dark"
            });
            setResendCooldown(30); // Reset cooldown
        } catch (error) {
            toast.error('Failed to resend OTP. Please try again.', {
                position: "top-center",
                autoClose: 2000,
                theme: "dark"
            });
        }
        setIsResending(false);
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            backgroundColor: '#0d0935',
            color: 'white' 
        }}>
            <Paper sx={{ 
                padding: '2.5rem', 
                borderRadius: '12px', 
                maxWidth: '420px', 
                width: '100%', 
                textAlign: 'center',
                backgroundColor: '#1a1a3c',
                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)'
            }}>
                
                {/* GreenSphere Logo */}
                <Box sx={{ mb: 2 }}>
                    <img 
                        src={greensphereLogo}
                        alt="GreenSphere Logo"
                        style={{ width: "150px" }}
                    />
                </Box>

                {/* Header */}
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1rem', color: '#ffffff' }}>
                    Verify Your OTP
                </Typography>

                {/* Body Text */}
                <Typography sx={{ color: '#bdbdbd', marginBottom: '1rem' }}>
                    Enter the 6-digit code sent to <strong>{maskEmail(email)}</strong>.
                </Typography>

                {/* OTP Input Fields */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '1rem' }}>
                    {otp.map((digit, index) => (
                        <TextField
                            key={index}
                            inputRef={(el) => (inputRefs.current[index] = el)}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            variant="outlined"
                            size="small"
                            sx={{
                                input: {
                                    textAlign: 'center', 
                                    fontSize: '22px', 
                                    width: '50px',
                                    color: '#ffffff'
                                },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    backgroundColor: '#282852',
                                    borderColor: 'white'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#6666cc',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#8888ff',
                                },
                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#aaaaff',
                                }
                            }}
                        />
                    ))}
                </Box>

                {/* Error Message */}
                {error && <Typography color="error" sx={{ marginBottom: '1rem' }}>{error}</Typography>}

                {/* Submit Button */}
                <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{
                        backgroundColor: '#4a47a3',
                        '&:hover': {
                            backgroundColor: '#605ccf'
                        },
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                    onClick={() => handleVerifyOtp(otp.join(''))}
                >
                    Verify OTP
                </Button>

                {/* Resend OTP Section */}
                <Typography sx={{ color: '#bdbdbd', fontSize: '0.9rem', marginTop: '1rem' }}>
                    Didn't receive a code?  
                    {resendCooldown > 0 ? (
                        <strong style={{ color: '#8888ff' }}> Resend in {resendCooldown}s</strong>
                    ) : (
                        <strong 
                            onClick={handleResendOtp} 
                            style={{ color: '#8888ff', cursor: isResending ? 'not-allowed' : 'pointer' }}
                        >
                            Resend
                        </strong>
                    )}
                </Typography>
            </Paper>

            {/* Toast Notifications */}
            <ToastContainer />
        </Box>
    );
};

export default OtpVerification;
