import React, { useContext, useState } from "react";
import {
  Grid,
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SetIsLoggedInContext, SetUserRoleContext } from "../App"; 
import greensphereLogo from "../assets/images/greenspherelogo.png";
import greensphereImage from "../assets/images/greensphereloginsignup.png";

const Login = () => {
  const setIsLoggedIn = useContext(SetIsLoggedInContext);
  const setUserRole = useContext(SetUserRoleContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        { email, password },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
  
      console.log("Login response:", loginResponse.data);
  
      // Handle OTP verification redirect
      if (loginResponse.data.redirect) {
        toast.info("Please verify your email with the OTP sent to you.", {
          position: "top-right",
          autoClose: 5000,
        });
  
        setTimeout(() => {
          navigate(loginResponse.data.redirect, { state: { email: email } });
        }, 3000);
        return;
      }
  
      // Handle successful login
      if (loginResponse.data.message === "Success") {
        // Get user data after login
        const userResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user`,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
  
        if (userResponse.data.user) {
          setIsLoggedIn(true);
          setUserRole(userResponse.data.user.role);
          
          toast.success("Login successful!", {
            position: "top-right",
            autoClose: 5000
          });
  
          setTimeout(() => {
            navigate(userResponse.data.user.role === "admin" ? "/adminhome" : "/home");
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
  
      if (error.response && error.response.status === 401) {
        toast.error(error.response.data.message || "Incorrect credentials!", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        toast.error("An error occurred. Please try again later.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <Grid
      container
      sx={{
        height: "100vh",
        background: "linear-gradient(to right, #05002E, #191540)",
      }}
    >
      <ToastContainer /> {/* ✅ Toastify Container for notifications */}

      {/* Left Section */}
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 4 }}>
          <img src={greensphereLogo} alt="GreenSphere Logo" style={{ width: "150px" }} />
        </Box>
        <Paper
          elevation={3}
          sx={{
            padding: "2rem",
            borderRadius: "1rem",
            width: "100%",
            maxWidth: "400px",
            background: "#0F1238",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#FFFFFF",
              textAlign: "center",
              mb: 2,
            }}
          >
            Welcome Back!
          </Typography>
          <Typography sx={{ color: "#CCCCCC", textAlign: "center", mb: 3 }}>
            Sign in to your Account!
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              type="email"
              label="Email"
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiInputLabel-root": { color: "#CCCCCC" },
                "& .MuiOutlinedInput-root": {
                  color: "#FFFFFF",
                  "& fieldset": { borderColor: "#3333FF" },
                },
              }}
            />
            <TextField
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              type="password"
              label="Password"
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiInputLabel-root": { color: "#CCCCCC" },
                "& .MuiOutlinedInput-root": {
                  color: "#FFFFFF",
                  "& fieldset": { borderColor: "#3333FF" },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#3333FF",
                color: "#FFFFFF",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                mb: 2,
                "&:hover": { backgroundColor: "#5555FF" },
              }}
            >
              Log in
            </Button>
          </form>
          <Typography sx={{ color: "#CCCCCC", textAlign: "center" }}>
            Don’t have an account?{" "}
            <Link
              href="/signup"
              sx={{
                color: "#FFFFFF",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Paper>
      </Grid>

      {/* Right Section */}
      <Grid
        item
        xs={12}
        md={7}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <img
            src={greensphereImage}
            alt="Solar Panels"
            style={{
              width: "100%",
              maxWidth: "700px",
              borderRadius: "1rem",
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
