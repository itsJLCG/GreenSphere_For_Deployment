import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import Sidebar from "./Analysis/Sidebar";
import ResourceEffects from "./Analysis/ResourceEffects";
import CarbonFootPrint from "./Analysis/CarbonFootPrint";
import EnergyPromoting from "./Analysis/EnergyPromoting";

const Analysis = () => {
  const [selectedInfrastructure, setSelectedInfrastructure] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [activeSection, setActiveSection] = useState("ResourceEffects");

  const handleInfrastructureClick = (infrastructure) => {
    setSelectedInfrastructure(infrastructure);
    setSelectedDetails(null);
  };

  const handleClose = () => {
    setSelectedInfrastructure(null);
    setSelectedDetails(null);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "ResourceEffects":
        return <ResourceEffects />;
      case "CarbonFootPrint":
        return <CarbonFootPrint />;
      case "EnergyPromoting":
        return <EnergyPromoting />;
      default:
        return <ResourceEffects />;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1c174d, #110e3a)",
        color: "white",
        alignItems: "center",
      }}
    >
     <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    gap: 3,
    my: 3,
    p: 2,
    background: "rgba(255, 255, 255, 0.15)", // Softer transparency
    borderRadius: "15px",
    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)", // Stronger depth
    width: "80%",
    backdropFilter: "blur(10px)", // Adds a glass effect
  }}
>
  <Button
    variant="contained"
    sx={{
      background: activeSection === "ResourceEffects"
        ? "linear-gradient(135deg, #8B4513, #228B22)" // Brown to Green
        : "rgba(255, 255, 255, 0.2)",
      color: "white",
      fontWeight: "bold",
      fontSize: "1rem",
      borderRadius: "10px",
      padding: "10px 20px",
      transition: "all 0.3s ease",
      flex: 1,
      "&:hover": {
        background: "linear-gradient(135deg, #6A2C0F, #1C6B1C)", // Darker hover effect
        transform: "scale(1.05)",
      },
    }}
    onClick={() => setActiveSection("ResourceEffects")}
  >
    Resource Effects
  </Button>

  <Button
    variant="contained"
    sx={{
      background: activeSection === "CarbonFootPrint"
        ? "linear-gradient(135deg, #006400, #000000)" // Green to Black
        : "rgba(255, 255, 255, 0.2)",
      color: "white",
      fontWeight: "bold",
      fontSize: "1rem",
      borderRadius: "10px",
      padding: "10px 20px",
      transition: "all 0.3s ease",
      flex: 1,
      "&:hover": {
        background: "linear-gradient(135deg, #004D00, #1C1C1C)", // Darker hover effect
        transform: "scale(1.05)",
      },
    }}
    onClick={() => setActiveSection("CarbonFootPrint")}
  >
    Carbon Footprint
  </Button>

  <Button
    variant="contained"
    sx={{
      background: activeSection === "EnergyPromoting"
        ? "linear-gradient(135deg, #FFD700, #FF8C00)" // Yellow to Orange
        : "rgba(255, 255, 255, 0.2)",
      color: "white",
      fontWeight: "bold",
      fontSize: "1rem",
      borderRadius: "10px",
      padding: "10px 20px",
      transition: "all 0.3s ease",
      flex: 1,
      "&:hover": {
        background: "linear-gradient(135deg, #E6C300, #E67700)", // Darker hover effect
        transform: "scale(1.05)",
      },
    }}
    onClick={() => setActiveSection("EnergyPromoting")}
  >
    Energy Promoting
  </Button>
</Box>



      <Box sx={{ display: "flex", flexDirection: "row", flex: 1, width: "100%" }}>
        <Box sx={{ width: "250px", background: "rgba(255, 255, 255, 0.1)" }}>
          <Sidebar 
            selectedInfrastructure={selectedInfrastructure} 
            setSelectedInfrastructure={setSelectedInfrastructure}
            selectedDetails={selectedDetails}
            setSelectedDetails={setSelectedDetails}
            handleInfrastructureClick={handleInfrastructureClick}
            handleClose={handleClose}
          />
        </Box>

        <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ width: "80%", textAlign: "center" }}>{renderSection()}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Analysis;
