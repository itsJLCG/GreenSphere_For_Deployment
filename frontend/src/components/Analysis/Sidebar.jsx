import { useState } from "react";
import renewableEnergyRankings from "./Data";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

const Sidebar = () => {
  const [selectedInfrastructure, setSelectedInfrastructure] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);

  const handleInfrastructureClick = (infrastructure) => {
    setSelectedInfrastructure(infrastructure);
  };

  const handleClose = () => {
    setSelectedInfrastructure(null);
  };

  return (
    <>
      {/* Left Sidebar */}
      <Box
        sx={{
          width: "320px",
          background: "linear-gradient(135deg, #252056, #1a153a)",
          padding: "2rem 1.5rem",
          flexShrink: 0,
          minHeight: "100vh",
          borderRight: "2px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "4px 0 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#fff",
            marginBottom: "1.5rem",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Infrastructure
        </Typography>

        {/* Scrollable Infrastructure List */}
        <Box sx={{ maxHeight: "75vh", overflowY: "auto" }}>
          <Stack spacing={2} alignItems="center">
            {Object.keys(renewableEnergyRankings).map((infrastructure, index) => (
              <Card
                key={index}
                sx={{
                  cursor: "pointer",
                  textAlign: "center",
                  width: "100%",
                  minHeight: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0px 6px 15px rgba(255, 255, 255, 0.3)",
                  },
                  "&:active": {
                    transform: "scale(0.95)",
                  },
                }}
                onClick={() => handleInfrastructureClick(infrastructure)}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
                    {infrastructure}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Right Content Section */}
      {selectedInfrastructure && (
        <Dialog
          open={Boolean(selectedInfrastructure)}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
          sx={{
            "& .MuiPaper-root": {
              background: "rgba(17, 14, 58, 0.9)",
              backdropFilter: "blur(20px)",
              borderRadius: "15px",
              color: "#fff",
              boxShadow: "0px 10px 30px rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.8rem" }}>
            {selectedInfrastructure} - Renewable Energy Rankings
          </DialogTitle>
          <DialogContent sx={{ maxHeight: "400px", overflowY: "auto" }}>
            <List sx={{ width: "100%" }}>
              {renewableEnergyRankings[selectedInfrastructure].map((energy, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background:
                      index === 0
                        ? "#ffd700"
                        : index === 1
                        ? "#c0c0c0"
                        : index === 2
                        ? "#cd7f32"
                        : "#180c3c",
                    borderRadius: "10px",
                    padding: "1rem",
                    marginBottom: "0.5rem",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#f5f5f5" }}>
                    #{index + 1}
                  </Typography>
                  <img
                    src={energy.image}
                    alt={energy.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      margin: "0 10px",
                    }}
                  />
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: "bold", color: "#ffffff" }}>{energy.name}</Typography>}
                    secondary={
                      <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>{energy.type}</Typography>
                    }
                  />
                  <Button
                    onClick={() => setSelectedDetails(energy)}
                    sx={{
                      color: "#fff",
                      background: "rgba(0, 128, 0, 0.8)",
                      padding: "0.5rem 1rem",
                      borderRadius: "10px",
                      "&:hover": { background: "rgba(0, 128, 0, 1)" },
                    }}
                  >
                    View Details
                  </Button>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ color: "#fff" }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

       {/* View Details Modal */}
          {selectedDetails && (
    <Dialog
      open={Boolean(selectedDetails)}
      onClose={() => setSelectedDetails(null)}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiPaper-root": {
          background: "rgba(17, 14, 58, 0.95)",
          backdropFilter: "blur(15px)",
          borderRadius: "15px",
          color: "#fff",
          boxShadow: "0px 10px 30px rgba(255, 255, 255, 0.3)",
          padding: "2rem",
        },
      }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "2rem",
          borderBottom: "2px solid rgba(255, 255, 255, 0.2)",
          paddingBottom: "1rem",
          letterSpacing: "1px",
        }}
      >
        {selectedDetails.name} - Why is it Suitable?
      </DialogTitle>
  
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* Image Section */}
          {selectedDetails.image && (
            <Box
              component="img"
              src={selectedDetails.image}
              alt={selectedDetails.name}
              sx={{
                width: "120px",
                height: "120px",
                borderRadius: "15px",
                objectFit: "cover",
                boxShadow: "0px 4px 12px rgba(255, 255, 255, 0.3)",
                margin: "1.5rem 0",
              }}
            />
          )}
  
          {/* Suitability Section */}
          <Typography
            variant="body1"
            sx={{
              textAlign: "justify",
              fontSize: "1.2rem",
              fontWeight: "500",
              color: "#eee",
              lineHeight: "1.7",
              padding: "1rem",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.2)",
              width: "100%",
            }}
          >
            {selectedDetails.reason}
          </Typography>
        </Box>
      </DialogContent>
  
      {/* Close Button */}
      <DialogActions sx={{ justifyContent: "center", paddingBottom: "1rem" }}>
        <Button
          onClick={() => setSelectedDetails(null)}
          sx={{
            color: "#fff",
            fontWeight: "bold",
            background: "rgba(255, 255, 255, 0.2)",
            padding: "0.7rem 1.5rem",
            borderRadius: "10px",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
      )}
    </>
  );
};

export default Sidebar;
