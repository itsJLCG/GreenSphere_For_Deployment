import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Container,
  Button,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line } from "recharts"; // For bar chart
import { PieChart, Pie, Cell } from "recharts"; // For pie chart
import exportToPDF from "./ExportToPDF";
import Swal from "sweetalert2";
import axios from "axios";

const PRICES = {
  solarPanels: {
    type: 'Solar Energy',
    productCost: 35000,
    installation: 150000,
    maintenance: 6500,
    carbonEmissions: 4.9, // Metric tons per unit
    energyProduction: 639, // kWh per year per unit
    electricityCost: 12 // Cost per kWh in Philippine Meralco Company
  },
  solarWaterHeating: {
    type: 'Solar Energy',
    productCost: 285000,
    installation: 28500,
    maintenance: 5700,
    carbonEmissions: 3,
    energyProduction: 2500,
    electricityCost: 12
  },
  smallWindTurbines: {
    type: 'Wind Energy',
    productCost: 2565000,
    installation: 1909500,
    maintenance: 256500,
    carbonEmissions: 4.54,
    energyProduction: 17520,
    electricityCost: 12
  },
  verticalAxisWindTurbines: {
    type: 'Wind Energy',
    productCost: 627000,
    installation: 570000,
    maintenance: 142500,
    carbonEmissions: 4.54,
    energyProduction: 13140,
    electricityCost: 12
  },
  microHydroPowerSystem: {
    type: 'HydroPower Energy',
    productCost: 384750,
    installation: 157000,
    maintenance: 28500,
    carbonEmissions: 2.1,
    energyProduction: 3000,
    electricityCost: 12
  },
  picoHydroPower: {
    type: 'HydroPower Energy',
    productCost: 826500,
    installation: 285000,
    maintenance: 17100,
    carbonEmissions: 1.05,
    energyProduction: 87600,
    electricityCost: 12
  },
  solarRoofTiles: {
    type: 'Solar Energy',
    productCost: 131100,
    installation: 79800,
    maintenance: 11400,
    carbonEmissions: 3,
    energyProduction: 544,
    electricityCost: 12
  },
  heatPump: {
    type: 'Geothermal Energy',
    productCost: 591858,
    installation: 287500,
    maintenance: 57750,
    carbonEmissions: 5,
    energyProduction: 4500,
    electricityCost: 12
  },
  verticalFarming: {
    type: 'Urban Farming',
    productCost: 672600,
    installation: 57600,
    maintenance: 25560,
    carbonEmissions: 2.2,
    energyProduction: 0,  // Not applicable
    electricityCost: 12 // Not applicable
  }
};

// Grid Carbon Intensity (kg CO₂/kWh) for the Philippines
const GRID_CARBON_INTENSITY = 0.691; // kg CO₂ per kWh (Philippines average)

const calculateTotalCost = (source, count) => {
  const { productCost, installation, maintenance, carbonEmissions, energyProduction, electricityCost } = PRICES[source];

  console.log(`Calculating for: ${source}, Quantity: ${count}`);

  // Calculate total annual energy production
  const totalAnnualEnergy = energyProduction * count;
  console.log(`Total Annual Energy Production (${source}): ${totalAnnualEnergy} kWh`);

  // Calculate annual savings from electricity production
  const annualSavings = totalAnnualEnergy * electricityCost; // 12 pesos per kWh (Meralco rate)
  console.log(`Annual Savings (${source}): PHP ${annualSavings}`);

  // Convert energy savings to annual carbon savings in metric tons
  const annualCarbonSavings = (totalAnnualEnergy * GRID_CARBON_INTENSITY) / 1000;
  console.log(`Annual Carbon Savings (${source}): ${annualCarbonSavings.toFixed(4)} metric tons`);

  // Calculate total carbon emissions
  const totalCarbonEmissions = carbonEmissions * count;
  console.log(`Total Carbon Emissions (${source}): ${totalCarbonEmissions} metric tons`);

  // Calculate carbon payback period
  const carbonPaybackPeriod = totalCarbonEmissions / annualCarbonSavings;
  console.log(`Carbon Payback Period (${source}): ${carbonPaybackPeriod.toFixed(2)} years`);

  return {
    totalProductCost: productCost * count,
    totalInstallationCost: installation * count,
    totalMaintenanceCost: maintenance * count,
    totalCarbonEmissions: totalCarbonEmissions,
    totalCost: productCost * count + installation * count + maintenance * count,
    annualSavings: annualSavings,
    paybackPeriod: (productCost * count + installation * count + maintenance * count) / annualSavings,
    carbonPaybackPeriod: carbonPaybackPeriod,
  };
};


const TechnoEconomicAnalysis = ({
  solarPanels = [],
  solarRoofTiles = [],
  heatPump = [],
  solarWaterHeating = [],
  smallWindTurbines = [],
  verticalAxisWindTurbines = [],
  microHydroPowerSystem = [],
  picoHydroPower = [],
  verticalFarming = [],
}) => {
  console.log("Received solarPanels:", solarPanels);
  console.log("Solar Panels Length:", solarPanels.length);
  console.log("Calculated Solar Panels Data:", calculateTotalCost("solarPanels", solarPanels.length));
  const [open, setOpen] = useState(false);
  const pdfRef = useRef();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const data = {
    "Solar Panels": calculateTotalCost("solarPanels", solarPanels.length),
    "Solar Water Heating": calculateTotalCost("solarWaterHeating", solarWaterHeating.length),
    "Solar Roof Tiles": calculateTotalCost("solarRoofTiles", solarRoofTiles.length),
    "Heat Pump": calculateTotalCost("heatPump", heatPump.length),
    "Small Wind Turbines": calculateTotalCost("smallWindTurbines", smallWindTurbines.length),
    "Vertical Axis Wind Turbines": calculateTotalCost("verticalAxisWindTurbines", verticalAxisWindTurbines.length),
    "Micro Hydro Power System": calculateTotalCost("microHydroPowerSystem", microHydroPowerSystem.length),
    "Pico Hydro Power": calculateTotalCost("picoHydroPower", picoHydroPower.length),
    "Vertical Farming": calculateTotalCost("verticalFarming", verticalFarming.length),
  };

  const totalProductCost = Object.values(data).reduce((sum, item) => sum + item.totalProductCost, 0);
  const totalInstallationCost = Object.values(data).reduce((sum, item) => sum + item.totalInstallationCost, 0);
  const totalMaintenanceCost = Object.values(data).reduce((sum, item) => sum + item.totalMaintenanceCost, 0);
  const totalCarbonEmissions = Object.values(data).reduce((sum, item) => sum + item.totalCarbonEmissions, 0).toFixed(2);
  const totalCost = totalProductCost + totalInstallationCost + totalMaintenanceCost;

  // Carbon Payback Period Calculation (in years)
  const carbonPaybackPeriod = Object.values(data)
    .filter(item => item.carbonPaybackPeriod && !isNaN(item.carbonPaybackPeriod)) // Filter out invalid values
    .reduce((acc, item) => acc + item.carbonPaybackPeriod, 0)
    .toFixed(2) || "0.00"; // Default to "0.00" if result is NaN

  const toCamelCase = (str) => {
    return str
      .split(" ")
      .map((word, index) =>
        index === 0
          ? word.toLowerCase() // Lowercase the first word
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize following words
      )
      .join("");
  };

  const energyUsageByType = Object.entries(data).reduce((acc, [key, value]) => {
    const formattedKey = toCamelCase(key);
    const priceData = PRICES[formattedKey];

    if (!priceData) {
      console.warn(`Warning: Key "${formattedKey}" not found in PRICES.`);
      return acc;
    }

    // Calculate total annual energy production for this source
    const count = key === "Solar Panels" ? solarPanels.length :
      key === "Solar Water Heating" ? solarWaterHeating.length :
        key === "Solar Roof Tiles" ? solarRoofTiles.length :
          key === "Heat Pump" ? heatPump.length :
            key === "Small Wind Turbines" ? smallWindTurbines.length :
              key === "Vertical Axis Wind Turbines" ? verticalAxisWindTurbines.length :
                key === "Micro Hydro Power System" ? microHydroPowerSystem.length :
                  key === "Pico Hydro Power" ? picoHydroPower.length :
                    key === "Vertical Farming" ? verticalFarming.length : 0;

    const annualEnergy = priceData.energyProduction * count;

    const type = priceData.type;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += annualEnergy;
    return acc;
  }, {});

  const lineChartData = Object.entries(energyUsageByType).map(([type, energy]) => ({
    type,
    energy
  }));


  // Data for charts
  const barChartData = Object.entries(data).map(([key, cost]) => ({
    name: key,
    totalCost: cost.totalCost,
    savings: cost.annualSavings,
  }));

  const pieChartData = [
    { name: "Product Cost", value: totalProductCost },
    { name: "Installation Cost", value: totalInstallationCost },
    { name: "Maintenance Cost", value: totalMaintenanceCost },
  ];

  const carbonPaybackData = [
    { name: "Carbon Payback Period", value: carbonPaybackPeriod },
  ];

  const totalCarbonData = [
    { name: "Total Carbon Emissions", value: totalCarbonEmissions },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"]; // Colors for charts

  const costBenefitRef = useRef();
  const savingsRef = useRef();
  const carbonRef = useRef();
  const costBreakdownRef = useRef();
  const energyUsageRef = useRef();
  const totalCostRef = useRef();

  const saveData = async () => {
    try {
      // Fetch logged-in user ID from the backend
      const userResponse = await fetch("http://localhost:3001/user", {
        method: "GET",
        credentials: "include", // Required to send cookies/session data
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch logged-in user.");
      }

      const userData = await userResponse.json();
      const user_id = userData.id; // Extract user ID

      console.log("✅ Logged-in User ID:", user_id);

      console.log("🛠 Debug: Total Product Cost:", totalProductCost);
      console.log("🛠 Debug: Total Installation Cost:", totalInstallationCost);
      console.log("🛠 Debug: Total Maintenance Cost:", totalMaintenanceCost);
      console.log("🛠 Debug: Carbon Payback Period:", carbonPaybackPeriod);
      console.log("🛠 Debug: Total Carbon Emissions:", totalCarbonEmissions);
      console.log("🛠 Debug: Energy Usage Data:", energyUsageByType);

      // Prepare data
      const costAnalysisData = {
        user_id,
        TotalProductCost: parseFloat(totalProductCost),
        TotalInstallationCost: parseFloat(totalInstallationCost),
        TotalMaintenanceCost: parseFloat(totalMaintenanceCost),
      };

      const carbonAnalysisData = {
        user_id,
        CarbonPaybackPeriod: parseFloat(carbonPaybackPeriod),
        TotalCarbonEmission: parseFloat(totalCarbonEmissions),
      };

      // Filter out zero-emission energy sources
      const energyUsageData = Object.entries(energyUsageByType)
        .filter(([type, emissions]) => emissions > 0)
        .map(([type, emissions]) => ({
          user_id,
          Type: type,
          Emissions: parseFloat(emissions),
        }));

      console.log("📩 Sending Cost Analysis:", costAnalysisData);
      console.log("📩 Sending Carbon Analysis:", carbonAnalysisData);
      console.log("📩 Sending Filtered Energy Usage:", energyUsageData);

      // Send requests
      const costResponse = await fetch("http://localhost:3001/api/cost-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(costAnalysisData),
      });

      const carbonResponse = await fetch("http://localhost:3001/api/carbon-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carbonAnalysisData),
      });

      const costData = await costResponse.json();  // ✅ Read once
      const carbonData = await carbonResponse.json();  // ✅ Read once

      console.log("✅ Cost Analysis Response:", costData);
      console.log("✅ Carbon Analysis Response:", carbonData);

      // Send energy usage requests in parallel
      const energyUsageResponses = await Promise.all(
        energyUsageData.map((entry) =>
          fetch("http://localhost:3001/api/energy-usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry),
          }).then((res) => res.json()) // Read response once
        )
      );

      console.log("✅ Energy Usage Responses:", energyUsageResponses);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data saved successfully!",
        customClass: {
          container: 'swal2-container', // Add a custom class for the container
          popup: 'swal2-popup', // Add a custom class for the popup
        },
        didOpen: () => {
          // Manually set the z-index of the SweetAlert modal
          const swalContainer = document.querySelector('.swal2-container');
          if (swalContainer) {
            swalContainer.style.zIndex = '99999'; // Set a higher z-index than your main modal
          }
        }
      });

    } catch (error) {
      console.error("❌ Error saving data:", error);
      alert("Failed to save data.");
    }
  };

  const BAR_COLORS = {
    totalCost: [
      '#FF4D4D', // Bright red
      '#33FFC4', // Neon turquoise
      '#29B6F6', // Bright sky blue
      '#76FF7A', // Bright green
      '#FFD700', // Vivid gold
      '#FF66B2', // Bright pink
      '#FF8C00', // Vivid orange
      '#00FFFF', // Cyan
      '#0080FF', // Vivid blue
      '#FF1493', // Deep pink
    ],
    savings: [
      '#9400D3', // Vivid purple
      '#00FF00', // Neon green
      '#FFD700', // Bright yellow
      '#00BFFF', // Deep sky blue
      '#FF4500', // Bright orange-red
      '#DC143C', // Crimson
      '#FF6347', // Tomato red
      '#1E90FF', // Dodger blue
      '#ADFF2F', // Bright green yellow
      '#FF69B4', // Hot pink
    ]
  };

  // First, add these colors at the component level
  const PIE_COLORS = {
    productCost: '#FF6B6B',    // Coral red
    installationCost: '#4ECDC4', // Turquoise
    maintenanceCost: '#FFB347'  // Pastel orange
  };
  return (
    <>
      {!open && (
        <Box
          sx={{
            position: "fixed",
            bottom: "-300px", // Adjusts vertical positioning
            left: "-750px", // Adjusts horizontal positioning
            backgroundColor: "#213547", // Container background
            padding: "10px", // Small padding around the button
            borderRadius: "16px", // Soft rounded edges
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)", // Subtle shadow for depth
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FF5733", // Highlighted button color
              color: "white",
              width: "350px",
              padding: "14px 26px",
              fontSize: "14px",
              fontWeight: "bold",
              borderRadius: "12px",
              boxShadow: "0px 6px 12px rgba(255, 87, 51, 0.4)", // Glowing effect
              textTransform: "uppercase",
              letterSpacing: "1px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#E74C3C",
                boxShadow: "0px 8px 16px rgba(231, 76, 60, 0.5)",
                transform: "scale(1.05)", // Slight zoom effect on hover
              },
            }}
            onClick={handleOpen}
          >
            Open Techno-Economic Analysis
          </Button>
        </Box>

      )}

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disableEscapeKeyDown
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          // Add these styles to prevent backdrop click from closing modal
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
        // Prevent modal from closing when clicking outside
        disableBackdropClick
      >
        <Fade in={open}>
          <Container
            maxWidth="lg"
            sx={{
              outline: "none",
              backgroundColor: "#1e293b",
              color: "white",
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
              maxHeight: "90vh",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#64748b",
                borderRadius: "4px",
              },
              // Add these styles to prevent click propagation
              position: "relative",
              // Add padding bottom to ensure last content is visible when scrolling
              paddingBottom: "2rem",
            }}
            // Add onClick handler to prevent event propagation
            onClick={(e) => e.stopPropagation()}
          >

            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  borderBottom: "2px solid #64748b",
                  pb: 2,
                  color: '#f59e0b', // Amber color for title
                  fontSize: '2rem',
                  letterSpacing: '0.5px',
                  mb: 3
                }}
              >
                Techno-Economic Analysis
              </Typography>

              <Box
                sx={{
                  textAlign: "center",
                  mt: 3,
                  mb: 4,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                <Button
                  variant="contained"
                  onClick={async () => {
                    if (!data || Object.keys(data).length === 0) {
                      console.error("No data available for PDF export!");
                      return; // Exit early if no data is available
                    }

                    // Fetch user data
                    const fetchUserData = async () => {
                      try {
                        const response = await axios.get('http://localhost:3001/user', { withCredentials: true });
                        return response.data.user; // Assuming the user data is returned in the `user` field
                      } catch (error) {
                        console.error("Error fetching user data:", error);
                        return null;
                      }
                    };

                    const userData = await fetchUserData();

                    if (userData) {
                      // Call ExportToPDF with user data
                      exportToPDF(
                        costBenefitRef,
                        savingsRef,
                        carbonRef,
                        energyUsageRef,
                        totalCostRef,
                        costBreakdownRef,
                        data,
                        userData
                      );
                    } else {
                      console.error("User data not available. Cannot export PDF.");
                    }
                  }}
                  sx={{
                    backgroundColor: '#22c55e', // Green for export
                    px: 4,
                    py: 1.5,
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 6px -1px rgb(34 197 94 / 0.2)',
                    '&:hover': {
                      backgroundColor: '#16a34a',
                      boxShadow: '0 6px 8px -1px rgb(34 197 94 / 0.3)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <span>Export to PDF</span>
                </Button>

                <Button
                  variant="contained"
                  onClick={saveData}
                  sx={{
                    backgroundColor: '#3b82f6', // Blue for save
                    px: 4,
                    py: 1.5,
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 6px -1px rgb(59 130 246 / 0.2)',
                    '&:hover': {
                      backgroundColor: '#2563eb',
                      boxShadow: '0 6px 8px -1px rgb(59 130 246 / 0.3)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <span>Save Data</span>
                </Button>
              </Box>

              {/* Cost vs. Benefit Analysis */}
              <Box sx={{ mt: 3, p: 3, backgroundColor: "#334155", borderRadius: 2 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", borderBottom: "2px solid #64748b", pb: 1 }}
                >
                  Cost vs. Benefit Analysis
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, color: '#94a3b8' }}>
                  This section compares the total cost of each renewable energy source with the estimated annual savings. The payback period is calculated based on the annual savings.
                </Typography>
                <Box ref={costBenefitRef} sx={{ mt: 2, overflowX: "auto" }}>
                  <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    color: '#94a3b8', // Light gray color for better contrast
                  }}>
                    <thead>
                      <tr>
                        <th style={{
                          padding: "12px",
                          borderBottom: "2px solid #64748b",
                          color: '#f59e0b', // Amber color for headers
                          fontSize: '1rem',
                          fontWeight: 600,
                          textAlign: 'left'
                        }}>Source</th>
                        <th style={{
                          padding: "12px",
                          borderBottom: "2px solid #64748b",
                          color: '#f59e0b',
                          fontSize: '1rem',
                          fontWeight: 600,
                          textAlign: 'left'
                        }}>Total Cost</th>
                        <th style={{
                          padding: "12px",
                          borderBottom: "2px solid #64748b",
                          color: '#f59e0b',
                          fontSize: '1rem',
                          fontWeight: 600,
                          textAlign: 'left'
                        }}>Annual Savings</th>
                        <th style={{
                          padding: "12px",
                          borderBottom: "2px solid #64748b",
                          color: '#f59e0b',
                          fontSize: '1rem',
                          fontWeight: 600,
                          textAlign: 'left'
                        }}>Payback Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(data).map(([key, cost], index) => (
                        <tr
                          key={key}
                          style={{
                            backgroundColor: index % 2 === 0 ? 'rgba(15, 23, 42, 0.3)' : 'transparent'
                          }}
                        >
                          <td style={{
                            padding: "12px",
                            borderBottom: "1px solid #64748b",
                            color: '#60a5fa', // Blue for source names
                            fontWeight: 500
                          }}>{key}</td>
                          <td style={{
                            padding: "12px",
                            borderBottom: "1px solid #64748b",
                            color: '#4ade80' // Green for costs
                          }}>₱{cost.totalCost.toLocaleString()}</td>
                          <td style={{
                            padding: "12px",
                            borderBottom: "1px solid #64748b",
                            color: '#22d3ee' // Cyan for savings
                          }}>₱{cost.annualSavings.toLocaleString()}</td>
                          <td style={{
                            padding: "12px",
                            borderBottom: "1px solid #64748b",
                            color: '#a78bfa' // Purple for payback period
                          }}>
                            {isNaN(cost.paybackPeriod) || cost.paybackPeriod === null
                              ? "0 year"
                              : `${cost.paybackPeriod.toFixed(2)} years`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Box>


              {/* Bar Chart for Cost vs. Savings */}
              <Box sx={{ mt: 5, p: 3, backgroundColor: "#334155", borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", borderBottom: "2px solid #64748b", pb: 1 }}>
                  Cost vs. Savings Comparison
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  The bar chart below shows the total cost and estimated annual savings for each renewable energy source.
                </Typography>
                <Box
                  ref={savingsRef}
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "center",
                    overflowX: "auto",
                    "&::-webkit-scrollbar": {
                      height: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#64748b",
                      borderRadius: "4px",
                    },
                  }}
                >
                  <BarChart
                    width={1200}
                    height={400}
                    data={barChartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 100
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fill: '#0088FE' }}
                    />
                    <YAxis
                      tick={{ fill: '#FFBB28' }}
                      tickFormatter={(value) => `₱${value.toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #64748b',
                        borderRadius: '8px',
                        color: '#ffffff'  // This ensures tooltip text is white
                      }}
                      formatter={(value, name) => [`₱${value.toLocaleString()}`, name]}
                      labelStyle={{ color: '#ffffff' }}  // This ensures the label text is white
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                    />
                    <Bar
                      dataKey="totalCost"
                      name="Total Cost"
                      fill="#4ade80"
                      radius={[4, 4, 0, 0]}
                    >
                      {barChartData.map((entry, index) => (
                        <Cell
                          key={`totalCost-${index}`}
                          fill={BAR_COLORS.totalCost[index % BAR_COLORS.totalCost.length]}
                        />
                      ))}
                    </Bar>
                    <Bar
                      dataKey="savings"
                      name="Annual Savings"
                      fill="#af19ff"
                      radius={[4, 4, 0, 0]}
                    >
                      {barChartData.map((entry, index) => (
                        <Cell
                          key={`savings-${index}`}
                          fill={BAR_COLORS.savings[index % BAR_COLORS.savings.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </Box>
              </Box>

              {/* Carbon Payback Period Analysis */}
              <Box sx={{ mt: 5, p: 3, backgroundColor: "#334155", borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", borderBottom: "2px solid #64748b", pb: 1 }}>
                  Carbon Payback Period Analysis
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, color: '#94a3b8' }}>
                  The carbon payback period is the time it takes to offset the carbon emissions produced during the manufacturing, installation, and maintenance of the renewable energy systems.
                </Typography>
                <Box sx={{
                  mt: 3,
                  p: 3,
                  backgroundColor: 'rgba(15, 23, 42, 0.3)',
                  borderRadius: 1,
                  border: '1px solid #475569'
                }}>

                  <Typography variant="h6" sx={{
                    color: '#60a5fa',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mt: 1
                  }}>
                    Carbon Payback Period: <span style={{ color: '#10b981' }}>{carbonPaybackPeriod} years</span>
                  </Typography>
                  <Typography variant="h6" sx={{
                    color: '#60a5fa',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    Total Carbon Emissions: <span style={{ color: '#f43f5e' }}>{totalCarbonEmissions} Metric Ton of CO₂</span>
                  </Typography>
                </Box>
                <Box
                  ref={carbonRef}
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "center",
                    gap: 4,
                    flexWrap: "wrap"
                  }}
                >
                  <BarChart
                    width={400}
                    height={300}
                    data={carbonPaybackData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 20
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#60a5fa' }}
                      axisLine={{ stroke: '#475569' }}
                    />
                    <YAxis
                      tick={{ fill: '#60a5fa' }}
                      axisLine={{ stroke: '#475569' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#60a5fa'
                      }}
                    />
                    <Legend
                      wrapperStyle={{ color: '#FFBB28' }}
                    />
                    <Bar
                      dataKey="value"
                      name="Carbon Payback Period (years)"
                      fill="#FFBB28"
                    >
                      {carbonPaybackData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill="#22c55e"
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                  <BarChart
                    width={400}
                    height={300}
                    data={totalCarbonData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 20
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#60a5fa' }}
                      axisLine={{ stroke: '#475569' }}
                    />
                    <YAxis
                      tick={{ fill: '#60a5fa' }}
                      axisLine={{ stroke: '#475569' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#60a5fa'
                      }}
                    />
                    <Legend
                      wrapperStyle={{ color: '#FFBB28' }}
                    />
                    <Bar
                      dataKey="value"
                      name="Total Carbon Emissions (Metric Ton of CO₂)"
                      fill="#FFBB28"
                    >
                      {totalCarbonData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill="#ef4444"
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </Box>
              </Box>


              <Box sx={{ mt: 5, p: 3, backgroundColor: "#334155", borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", borderBottom: "2px solid #64748b", pb: 1 }}>
                  Cost Breakdown
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, color: '#94a3b8' }}>
                  The pie chart below shows the breakdown of total costs into product, installation, and maintenance costs.
                </Typography>
                <Box ref={costBreakdownRef} sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}>
                  <PieChart width={800} height={300}>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value, percent }) => {
                        let formattedValue;

                        if (value >= 1_000_000) {
                          formattedValue = `₱${(value / 1_000_000).toFixed(1)}M`; // Millions
                        } else if (value >= 1_000) {
                          formattedValue = `₱${(value / 1_000).toFixed(1)}K`; // Thousands
                        } else {
                          formattedValue = `₱${value}`; // No formatting for small numbers
                        }

                        return `${name}: ${formattedValue} (${(percent * 100).toFixed(0)}%)`;
                      }}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={Object.values(PIE_COLORS)[index]}
                          stroke="#1e293b"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => (
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </Box>
              </Box>

              {/* Energy Usage Section */}
              <Box sx={{ mt: 5, p: 3, backgroundColor: "#334155", borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", borderBottom: "2px solid #64748b", pb: 1 }}>
                  Energy Usage by Source Type
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, color: '#94a3b8' }}>
                  This section shows the total annual energy production (kWh) by each type of renewable energy source.
                </Typography>
                <Box ref={energyUsageRef} sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <LineChart width={800} height={300} data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis
                      dataKey="type"
                      tick={{ fill: '#60a5fa' }}
                      axisLine={{ stroke: '#475569' }}
                    />
                    <YAxis
                      tick={{ fill: '#60a5fa' }}
                      axisLine={{ stroke: '#475569' }}
                      tickFormatter={(value) => `${value.toLocaleString()} kWh`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#60a5fa'
                      }}
                      formatter={(value) => [`${value.toLocaleString()} kWh`, 'Annual Energy Production']}
                    />
                    <Legend
                      wrapperStyle={{ color: '#60a5fa' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="energy"
                      stroke="#22c55e"
                      strokeWidth={2}
                      name="Annual Energy Production (kWh)"
                      dot={{ fill: '#22c55e', stroke: '#22c55e', strokeWidth: 2 }}
                    />
                  </LineChart>
                </Box>
              </Box>

              {/* Total Costs Section */}
              <Box sx={{ mt: 5, p: 3, backgroundColor: "#334155", borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", borderBottom: "2px solid #64748b", pb: 1 }}>
                  Total Costs
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, color: '#94a3b8' }}>
                  This section summarizes the total costs associated with the renewable energy systems.
                </Typography>
                <Box
                  ref={totalCostRef}
                  sx={{
                    mt: 3,
                    p: 3,
                    backgroundColor: 'rgba(15, 23, 42, 0.3)',
                    borderRadius: 1,
                    border: '1px solid #475569'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    Total Product Cost: <span style={{ color: "#4ADE80" }}>₱{totalProductCost}</span>
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    Total Installation Cost: <span style={{ color: "#60A5FA" }}>₱{totalInstallationCost}</span>
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Total Maintenance Cost: <span style={{ color: "#FACC15" }}>₱{totalMaintenanceCost}</span>
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      color: "#ee2400",
                      mt: 2,
                      pt: 2,
                      borderTop: '1px solid #475569'
                    }}
                  >
                    Grand Total: ₱{totalCost.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        </Fade>
      </Modal>
    </>
  );
};

export default TechnoEconomicAnalysis;