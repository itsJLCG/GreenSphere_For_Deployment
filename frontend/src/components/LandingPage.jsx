import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Sphere, Points, PointMaterial } from "@react-three/drei";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { LocalFlorist, Lightbulb, Verified } from "@mui/icons-material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";


import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Avatar,
  Container,
  Modal,
  CircularProgress,
  Rating,
  Popover,
} from "@mui/material";
import "./LandingPage.css";

const MissionModel = () => {
  const { scene } = useGLTF("/assets/models/missions.glb");
  return <primitive object={scene} scale={0.13} />;
};

const VisionModel = () => {
  const { scene } = useGLTF("/assets/models/visions.glb");
  return <primitive object={scene} scale={0.13} />;
};


// Rotating Logo Component
const RotatingLogo = ({ scene, position, scale }) => {
  const logoRef = useRef();
  useFrame(() => {
    if (logoRef.current) {
      logoRef.current.rotation.x = Math.PI / 2;
    }
  });

  return <primitive ref={logoRef} object={scene} position={position} scale={scale} />;
};

// Static Model Component
const StaticModel = ({ scene, position, scale }) => {
  return <primitive object={scene} position={position} scale={scale} />;
};

// Circular Platform for Logo
const Platform = () => {
  return (
    <mesh position={[0, -2.5, 0]}>
      <cylinderGeometry args={[3, 3, 0.2, 32]} />
      <meshStandardMaterial color="#649860" />
    </mesh>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { scene: logoScene } = useGLTF("/assets/models/greenspherelogo.glb");
  const { scene: textScene } = useGLTF("/assets/models/greenspheretext.glb");

  // Developer Data
  const developers = [
    { name: "Mrs. Pops V. Madriaga", image: "assets/images/mamPops.jpg", role: "Project Adviser" },
    { name: "Gayapa, Jhon Ludwig C.", image: "assets/images/ludwig.jpg", role: "Backend and Frontend" },
    { name: "Barte, Gwyn S.", image: "assets/images/gwyn.jpg", role: "Backend", },
    { name: "Obreros, Jhun Mark G.", image: "assets/images/jm.jpg", role: "Frontend" },
    { name: "Prado, Kristine Mae P.", image: "assets/images/km.jpg", role: "UI/UX Designer", },
  ];


  // Register chart elements
  ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

  // Testimonials API Fetch
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterRating, setFilterRating] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/feedbacks`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setTestimonials(response.data);
      } catch (err) {
        setError("Failed to load testimonials.");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const filteredTestimonials = filterRating
    ? testimonials.filter(t => t.rating === filterRating)
    : testimonials;

  // Count ratings (1★ to 5★)
  const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  testimonials.forEach((t) => {
    if (t.rating >= 1 && t.rating <= 5) {
      ratingsCount[t.rating]++;
    }
  });

  // Chart data
  const chartData = {
    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    datasets: [
      {
        label: "Number of Reviews",
        data: [
          ratingsCount[1],
          ratingsCount[2],
          ratingsCount[3],
          ratingsCount[4],
          ratingsCount[5],
        ],
        backgroundColor: ["#ff4d4d", "#ffcc00", "#33cc33", "#3399ff", "#9966ff"],
        borderRadius: 6,
      },
    ],
  };



  const RenewableEnergyCarousel = () => {
    const models = [
      {
        path: "/assets/models/heatPump.glb",
        name: "Heat Pump",
        scale: [3, 3, 3],
        position: [0, -1.7, 0],
        info: "A heat pump is an energy-efficient system that extracts heat from the air, water, or ground to provide heating and cooling for residential and commercial buildings. It works by transferring heat from a cooler space to a warmer space, making it an excellent alternative to traditional heating systems. Heat pumps are environmentally friendly, as they reduce greenhouse gas emissions and rely on renewable energy sources."
      },
      {
        path: "/assets/models/microHydropowerSystem.glb",
        name: "Micro Hydro Power System",
        scale: [1, 1, 1],
        position: [0, -2, 0],
        rotation: [0, -Math.PI / 2, 0],
        info: "Micro hydropower systems are small-scale electricity generation systems that harness the energy of flowing water to produce power. These systems are particularly useful in rural or remote areas where access to the main power grid is limited. They are environmentally friendly, cost-effective, and can provide a reliable source of electricity for communities, farms, or small industries."
      },
      {
        path: "/assets/models/picoHydroPower.glb",
        name: "Pico Hydro Power",
        scale: [0.2, 0.2, 0.2],
        position: [0, -0.1, 0],
        info: "Pico hydro systems are ultra-small-scale hydroelectric power systems that generate under 5 kW of electricity. These systems are ideal for powering small homes, workshops, or remote communities. They are easy to install, require minimal maintenance, and provide a sustainable energy solution for off-grid locations. Pico hydro systems are a great way to bring electricity to underserved areas."
      },
      {
        path: "/assets/models/solarwaterheater.glb",
        name: "Solar Water Heater",
        scale: [7, 7, 7],
        position: [0, -0.5, 0],
        info: "Solar water heaters are devices that use sunlight to heat water for residential, commercial, or industrial use. They consist of solar collectors that absorb solar energy and transfer it to water stored in a tank. Solar water heaters are energy-efficient, reduce electricity bills, and lower carbon footprints. They are an excellent choice for regions with abundant sunlight and a high demand for hot water."
      },
      {
        path: "/assets/models/verticalAxisWindTurbineAnimated.glb",
        name: "Vertical Axis Wind Turbine",
        scale: [0.3, 0.3, 0.3],
        position: [0, 0.6, 0],
        rotation: [Math.PI / 2, 0, 0],
        info: "Vertical axis wind turbines (VAWTs) are innovative wind energy systems that capture wind from all directions, making them suitable for urban environments and areas with turbulent wind conditions. Unlike traditional horizontal axis turbines, VAWTs are compact, quieter, and easier to maintain. They are ideal for small-scale energy generation and can be installed on rooftops or in densely populated areas."
      },
      {
        path: "/assets/models/windTurbine.glb",
        name: "Wind Turbine",
        scale: [0.3, 0.3, 0.3],
        position: [0, -3, 0],
        info: "Traditional wind turbines are large structures that convert wind energy into electricity using rotating blades. They are commonly used in wind farms to generate power on a utility scale. Wind turbines are a clean and renewable energy source, reducing reliance on fossil fuels and decreasing greenhouse gas emissions. They are most effective in areas with consistent and strong wind patterns."
      },
      {
        path: "/assets/models/solarPanel.glb",
        name: "Solar Panel",
        scale: [1, 1, 1],
        position: [0, 0, 0],
        info: "Solar panels, also known as photovoltaic (PV) panels, convert sunlight into electricity using photovoltaic cells. They are widely used in residential, commercial, and industrial settings to generate clean and renewable energy. Solar panels are durable, low-maintenance, and can significantly reduce electricity costs. They are a key component of the global transition to sustainable energy."
      },
      {
        path: "/assets/models/solarRoofTiles.glb",
        name: "Solar Roof Tiles",
        scale: [0.01, 0.01, 0.01],
        position: [0, -1, 0],
        info: "Solar roof tiles are an innovative roofing solution that integrates solar technology with traditional roofing materials. They blend seamlessly with the architecture of a building while generating electricity from sunlight. Solar roof tiles are aesthetically pleasing, durable, and provide a sustainable energy solution for homeowners. They are an excellent choice for those looking to combine functionality with design."
      },
      {
        path: "/assets/models/verticalFarm.glb",
        name: "Vertical Farm",
        scale: [0.2, 0.2, 0.2],
        position: [0, 0, 0],
        info: "Vertical farms are agricultural systems that use stacked layers to grow crops efficiently in controlled environments. They are designed to maximize space and resources, making them ideal for urban areas with limited land availability. Vertical farms use advanced technologies such as hydroponics, aeroponics, and LED lighting to optimize plant growth. They offer a sustainable solution to food production, reducing water usage and transportation costs."
      }
    ];

    const ModelViewer = ({ modelPath, scale, position, rotation = [0, 0, 0] }) => {
      const { scene } = useGLTF(modelPath);
      return (
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ height: "200px", width: "100%" }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} intensity={1} />
          <primitive object={scene} scale={scale} position={position} rotation={rotation} />
          <OrbitControls enableZoom={true} enablePan={true} />
        </Canvas>
      );
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [hoveredInfo, setHoveredInfo] = useState("");

    const handlePopoverOpen = (event, info) => {
      setAnchorEl(event.currentTarget);
      setHoveredInfo(info);
    };

    const handlePopoverClose = () => {
      setAnchorEl(null);
      setHoveredInfo("");
    };

    const open = Boolean(anchorEl);

    return (
      <Container sx={{ py: 5 }}>
        <Typography variant="h4" align="center" fontWeight="bold" color="white" gutterBottom sx={{ mb: 5 }}>
          Renewable Energy Resources
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {models.map((model, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 3,
                  textAlign: "center",
                  boxShadow: 4,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                }}
              >
                <ModelViewer modelPath={model.path} scale={model.scale} position={model.position} />
                <Typography
                  variant="h6"
                  color="white"
                  mt={2}
                  aria-owns={open ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                  onMouseEnter={(event) => handlePopoverOpen(event, model.info)}
                  onMouseLeave={handlePopoverClose}
                >
                  {model.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: "none",
            "& .MuiPaper-root": { backgroundColor: "rgba(255, 255, 255, 0.1)" }
          }}
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          disableRestoreFocus
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Typography sx={{ p: 2, maxWidth: 300, textAlign: "justify", color: "white" }}>
            {hoveredInfo}
          </Typography>
        </Popover>

      </Container>
    );
  };

  const features = [
    { icon: <LocalFlorist fontSize="large" />, title: "Eco-Friendly", desc: "We prioritize sustainability with green energy solutions tailored to meet the needs of modern living." },
    { icon: <Lightbulb fontSize="large" />, title: "User-Friendly", desc: "Our intuitive and easy-to-use platform makes it simple for anyone to design and apply renewable energy projects." },
    { icon: <Verified fontSize="large" />, title: "Reliable", desc: "We provide well-tested, scientifically backed solutions that ensure efficiency and long-term performance." },
  ];

  const Stars = () => {
    const starPositions = useMemo(() => {
      const positions = [];
      for (let i = 0; i < 500; i++) {
        positions.push((Math.random() - 0.5) * 20, Math.random() * 10, (Math.random() - 0.5) * 20);
      }
      return new Float32Array(positions);
    }, []);

    return (
      <Points positions={starPositions}>
        <PointMaterial size={0.05} color="white" />
      </Points>
    );
  };

  const Sun = () => (
    <Sphere args={[0.7, 32, 32]} position={[4, 3, -5]}>
      <meshStandardMaterial emissive="yellow" emissiveIntensity={2} color="yellow" />
    </Sphere>
  );

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <Box className="hero-section" display="flex" alignItems="center" justifyContent="space-between" py={6}>
        <Box className="hero-content" textAlign="left">
          <Typography variant="h2" color="white" paragraph sx={{ fontFamily: "serif", fontWeight: "bold" }}>
            Design Your Sustainable Future with GreenSphere
          </Typography>
          <Typography variant="h5" color="white" paragraph sx={{ opacity: 0.8 }}>
            A powerful simulator for designing and applying renewable energy solutions. Start building your greener future today!
          </Typography>
          <Button
            variant="outlined"
            size="large"
            sx={{
              color: "white",
              fontWeight: "bold",
              padding: "10px 24px",
              borderWidth: "2px",
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "grey",
                color: "white",
                borderColor: "white",
                borderWidth: "2px",
              },
            }}
            onClick={() => navigate("/login")}
          >
            Get Started for Free
          </Button>
        </Box>



        <Box className="hero-3d" sx={{ padding: 2 }}>
          <Canvas className="canvas" camera={{ position: [0, 0, 15] }} style={{ borderRadius: "10px", overflow: "hidden" }}>
            <OrbitControls enableZoom={true} />
            <ambientLight intensity={1.5} />
            <directionalLight position={[2, 2, 2]} intensity={1} />
            <Platform />
            <RotatingLogo scene={logoScene} position={[0, 1.7, 0.2]} scale={[1, 1, 1]} />
            <StaticModel scene={textScene} position={[0, -1.1, 0]} scale={[0.1, 0.1, 0.1]} />
            <Sun />
            <Stars />
          </Canvas>
        </Box>
      </Box>

      {/* Features Section with Alternating Colors */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <Box sx={{ minHeight: "80vh", display: "flex", alignItems: "center", py: 6 }}>
          <Container>
            <Typography variant="h4" align="center" fontWeight="bold" gutterBottom sx={{ color: "white", mb: 8 }}>
              Why Choose Greensphere?
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileInView={{ y: [50, 0], opacity: [0, 1] }}
                    transition={{ duration: 0.8 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        padding: 3,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.15)", // Transparent
                        backdropFilter: "blur(8px)",
                        width: 60,
                        height: 60,
                        justifyContent: "center",
                        margin: "0 auto",
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" mt={2} sx={{ color: "white", textAlign: "center" }}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: "white", opacity: 0.8, textAlign: "justify" }}>
                      {feature.desc}
                    </Typography>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </motion.div>



      {/* Renewable Energy Carousel Section */}
      <RenewableEnergyCarousel />

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Box sx={{ minHeight: "80vh", display: "flex", alignItems: "center", py: 4 }}>
          <Container>
            <Typography variant="h4" align="center" fontWeight="bold" color="white" gutterBottom sx={{ mb: 6 }}>
              Community Engagement
            </Typography>

            {loading ? (
              <Grid container justifyContent="center">
                <CircularProgress color="secondary" />
              </Grid>
            ) : error ? (
              <Typography align="center" color="error">{error}</Typography>
            ) : (
              <Grid container spacing={4} justifyContent="center">
                {testimonials.slice(0, 3).map((testimonial, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: "flex", justifyContent: "center" }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileInView={{ opacity: [0, 1], y: [50, 0] }}
                      transition={{ duration: 0.8 }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          maxWidth: "300px",
                          backgroundColor: "rgba(255, 255, 255, 0.4)", // Semi-transparent white
                          borderRadius: "20px",
                          padding: "20px",
                          textAlign: "center",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Soft shadow
                          backdropFilter: "blur(10px)", // Glassmorphism effect
                        }}
                      >
                        <Avatar
                          src={testimonial.avatar || "/assets/default-avatar.png"}
                          sx={{
                            width: 56,
                            height: 56,
                            position: "absolute",
                            top: -30,
                            left: "50%",
                            transform: "translateX(-50%)",
                            border: "3px solid white",
                          }}
                        />
                        <Typography variant="body1" fontStyle="italic" sx={{ mt: 3 }}>
                          "{testimonial.comment}"
                        </Typography>
                        <Rating value={testimonial.rating} readOnly precision={0.5} sx={{ mt: 1 }} />
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          sx={{ mt: 1, fontFamily: "Pacifico, cursive" }}
                        >
                          - {testimonial.name}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Box>
      </motion.div>

      {/* Mission & Vision Section */}
      <div className="container" style={{ marginTop: "100px", paddingBottom: "40px", display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "50px", padding: "50px 20px", maxWidth: "1200px" }}>

          {/* Mission Section (Left) */}
          <div style={{
            background: "linear-gradient(135deg, #1E3A5F, #2C5A85)",
            borderRadius: "20px",
            padding: "40px",
            width: "48%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            cursor: "pointer",
            ":hover": {
              transform: "translateY(-10px)",
              boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.4)",
            },
          }}>
            {/* Mission 3D Model */}
            <div style={{ position: "relative", width: "100%", height: "200px", overflow: "hidden", borderRadius: "15px", marginBottom: "-10px" }}>
              <Canvas style={{ width: "100%", height: "100%" }}>
                <ambientLight intensity={1} />
                <MissionModel />
                <OrbitControls enableZoom={true} enablePan={false} />
              </Canvas>
            </div>

            <p style={{ textAlign: "justify", color: "white", fontSize: "1.1rem", lineHeight: "1.8", fontFamily: "'Roboto', sans-serif" }}>
              Our mission is to empower individuals and organizations with an interactive and immersive platform for designing, simulating, and analyzing renewable energy solutions.
              GreenSphere strives to foster sustainable innovation by providing an engaging, educational experience that promotes eco-conscious decision-making for a greener future.
            </p>
          </div>

          {/* Vision Section (Right) */}
          <div style={{
            background: "linear-gradient(135deg, #1E3A5F, #2C5A85)",
            borderRadius: "20px",
            padding: "40px",
            width: "48%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            cursor: "pointer",
            ":hover": {
              transform: "translateY(-10px)",
              boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.4)",
            },
          }}>
            {/* Vision 3D Model */}
            <div style={{ position: "relative", width: "100%", height: "200px", overflow: "hidden", borderRadius: "15px", marginBottom: "-10px" }}>
              <Canvas style={{ width: "100%", height: "100%" }}>
                <ambientLight intensity={1} />
                <VisionModel />
                <OrbitControls enableZoom={true} enablePan={false} />
              </Canvas>
            </div>

            <p style={{ textAlign: "justify", color: "white", fontSize: "1.1rem", lineHeight: "1.8", fontFamily: "'Roboto', sans-serif" }}>
              Our vision is to be the leading simulation platform for renewable energy solutions, fostering a world where sustainability seamlessly integrates into infrastructure and daily life.
              We aspire to create a future where every user can explore, learn, and implement clean energy strategies, shaping a resilient and environmentally responsible society.
            </p>
          </div>

        </div>





        {/* Modal */}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">



              {/* Button to Show Chart */}
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
                  onClick={() => setShowChart(!showChart)}
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    background: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginBottom: "10px",
                  }}
                >
                  {showChart ? "Hide Feedback Analysis" : "Show Feedback Analysis"}
                </button>

                {/* Show Chart if Button is Clicked */}
                {showChart && (
                  <div
                    style={{
                      background: "white",
                      padding: "20px",
                      borderRadius: "10px",
                      width: "400px",
                      margin: "auto",
                      boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    <h3 style={{ marginBottom: "10px", color: "#333" }}>
                      User Ratings Analysis
                    </h3>
                    {loading ? (
                      <p>Loading...</p>
                    ) : error ? (
                      <p style={{ color: "red" }}>{error}</p>
                    ) : (
                      <Bar data={chartData} options={{ responsive: true }} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Styles */}
        <style>
          {`
          .mission-vision-container {
            display: flex;
            justify-content: center;
            gap: 50px;
            margin-bottom: 100px;
            margin-top: 250px;
          }
          .box {
            background: rgba(255, 255, 255, 0.1); /* Subtle background for cards */
            color: white;
            padding: 50px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            width: 500px;
            text-align: center;
          }
          .title {
            font-size: 22px;
            font-weight: bold;
             color: BLACK;
            margin-bottom: 10px;
          }
          .text {
            font-size: 24px;
            color: white;
          }
        `}
        </style>
      </div>





      {/* Developers Section (Gray Background) */}
      <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 2 }}>
        <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", py: 6 }}>
          <Container maxWidth="xl">
            <Typography variant="h4" align="center" fontWeight="bold" color="white" gutterBottom sx={{ mb: 6 }}>
              Developers of the System
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {developers.map((dev, index) => (
                <Grid item xs={12} sm={6} md={2.4} key={index}>
                  <Box
                    sx={{
                      textAlign: "center",
                      padding: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      borderRadius: "12px",
                      transition: "transform 0.3s ease-in-out",
                      '&:hover': {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <Avatar
                      src={dev.image}
                      sx={{
                        width: 120,
                        height: 120,
                        margin: "auto",
                        border: "4px solid rgba(255, 255, 255, 0.5)",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                      }}
                    />
                    <Typography variant="h6" color="#0e0a36" sx={{ mt: 2, fontWeight: "bold", fontSize: "1rem" }}>
                      {dev.name}
                    </Typography>
                    <Typography variant="body2" color="#333" sx={{ mt: 1 }}>
                      {dev.role}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </motion.div>


      {/* Footer Section (Dark Blue) */}
      <Box className="footer" textAlign="center" py={3} bgcolor="#0e0a36" mt={6}>
        <Typography variant="body2" color="white">© 2024 GreenSphere. All rights reserved.</Typography>
      </Box>
    </div>
  );
};

export default LandingPage;
