import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link, useLocation } from "react-router-dom";
import { IsLoggedInContext, UserRoleContext } from "../App"; // Import UserRoleContext
import greensphereLogo from "../assets/images/greenspherelogo.png";
import Logout from "./Logout";

const Navbar = () => {
  const isLoggedIn = useContext(IsLoggedInContext);
  const userRole = useContext(UserRoleContext); // Get user role
  const location = useLocation(); // Get current route

  // Button styling with a modern, minimalistic design
  const buttonStyle = {
    marginRight: "12px",
    fontSize: "0.9rem",
    fontWeight: "500",
    padding: "0.5rem 1.2rem",
    borderRadius: "8px",
    textTransform: "none", // Prevent uppercase transformation
    transition: "all 0.3s ease",
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent white
    color: "#FFFFFF", // White text
    border: "1px solid rgba(255, 255, 255, 0.3)", // Subtle border
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)", // Slightly brighter on hover
      borderColor: "rgba(255, 255, 255, 0.5)", // Brighter border on hover
      transform: "translateY(-1px)", // Slight lift effect
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow on hover
    },
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "rgba(5, 0, 46, 0.9)", // Dark blue background
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo and Title */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={greensphereLogo}
            alt="GreenSphere Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                color: "#FFFFFF",
                letterSpacing: "1px",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              GreenSphere
            </Typography>
          </Link>
        </div>

        {/* Buttons */}
        <div>
          {isLoggedIn ? (
            <>
              {/* Show Home, Feedback, and Analysis only if NOT an admin */}
              {userRole !== "admin" && (
                <>
                  <Button
                    sx={buttonStyle}
                    to="/home"
                    component={Link}
                    variant="outlined"
                  >
                    Home
                  </Button>
                  <Button
                    sx={buttonStyle}
                    to="/feedback"
                    component={Link}
                    variant="outlined"
                  >
                    Feedback
                  </Button>
                  <Button
                    sx={{
                      ...buttonStyle,
                      backgroundColor: "rgba(40, 167, 69, 0.1)", // Green with transparency
                      borderColor: "rgba(40, 167, 69, 0.3)", // Green border
                      "&:hover": {
                        backgroundColor: "rgba(40, 167, 69, 0.2)", // Brighter green on hover
                        borderColor: "rgba(40, 167, 69, 0.5)", // Brighter border on hover
                      },
                    }}
                    to="/analysis"
                    component={Link}
                    variant="outlined"
                  >
                    Analysis
                  </Button>
                </>
              )}
              <Logout />
            </>
          ) : (
            <>
              <Button
                sx={buttonStyle}
                to="/login"
                component={Link}
                variant="outlined"
              >
                Login
              </Button>
              <Button
                sx={{
                  ...buttonStyle,
                  backgroundColor: "rgba(0, 123, 255, 0.1)", // Blue with transparency
                  borderColor: "rgba(0, 123, 255, 0.3)", // Blue border
                  "&:hover": {
                    backgroundColor: "rgba(0, 123, 255, 0.2)", // Brighter blue on hover
                    borderColor: "rgba(0, 123, 255, 0.5)", // Brighter border on hover
                  },
                }}
                to="/signup"
                component={Link}
                variant="outlined"
              >
                Signup
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;