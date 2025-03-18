import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const explanations = {
  "Single-Family with Gable": {
    "Pico Hydropower": `These structures are typically located in urban or suburban areas where access to flowing water sources is rare. Pico hydropower requires proximity to a river or stream, which is uncommon in residential or commercial zones. Additionally, the infrastructure needed (e.g., penstocks, turbines) is not feasible for most single-family homes or multi-unit buildings. 
    <a href="https://www.nrel.gov/news/video/hydropower-energy-basics-text.html" target="_blank">Learn more</a>`,

    "Vertical Farming": `These structures typically lack the space and structural capacity to support vertical farming systems. The energy demands for lighting and climate control are also high, making it impractical for residential use without significant modifications. 
    <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/" target="_blank">Learn more</a>`,
  },
  "Single-Family with Flat": {
    "Pico Hydropower": `These structures are typically located in urban or suburban areas where access to flowing water sources is rare. Pico hydropower requires proximity to a river or stream, which is uncommon in residential or commercial zones. Additionally, the infrastructure needed (e.g., penstocks, turbines) is not feasible for most single-family homes or multi-unit buildings. 
    <a href="https://www.nrel.gov/news/video/hydropower-energy-basics-text.html" target="_blank">Learn more</a>`,

    "Vertical Farming": `These structures typically lack the space and structural capacity to support vertical farming systems. The energy demands for lighting and climate control are also high, making it impractical for residential use without significant modifications. 
    <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/" target="_blank">Learn more</a>`,
  },
  "Single-Family with Shed": {
    "Pico Hydropower": `These structures are typically located in urban or suburban areas where access to flowing water sources is rare. Pico hydropower requires proximity to a river or stream, which is uncommon in residential or commercial zones. Additionally, the infrastructure needed (e.g., penstocks, turbines) is not feasible for most single-family homes or multi-unit buildings. 
    <a href="https://www.nrel.gov/news/video/hydropower-energy-basics-text.html" target="_blank">Learn more</a>`,

    "Vertical Farming": `These structures typically lack the space and structural capacity to support vertical farming systems. The energy demands for lighting and climate control are also high, making it impractical for residential use without significant modifications. 
    <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/" target="_blank">Learn more</a>`,
  },
  "Single-Family with Butterfly": {
    "Pico Hydropower": `These structures are typically located in urban or suburban areas where access to flowing water sources is rare. Pico hydropower requires proximity to a river or stream, which is uncommon in residential or commercial zones. Additionally, the infrastructure needed (e.g., penstocks, turbines) is not feasible for most single-family homes or multi-unit buildings. 
    <a href="https://www.nrel.gov/news/video/hydropower-energy-basics-text.html" target="_blank">Learn more</a>`,

    "Vertical Farming": `These structures typically lack the space and structural capacity to support vertical farming systems. The energy demands for lighting and climate control are also high, making it impractical for residential use without significant modifications. 
    <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/" target="_blank">Learn more</a>`,
  },
  "Cottages": {
    "Pico Hydropower": `These structures are typically located in urban or suburban areas where access to flowing water sources is rare. Pico hydropower requires proximity to a river or stream, which is uncommon in residential or commercial zones. Additionally, the infrastructure needed (e.g., penstocks, turbines) is not feasible for most single-family homes or multi-unit buildings. 
    <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/">Learn more</a>`,

    "Vertical Farming": `These structures typically lack the space and structural capacity to support vertical farming systems. The energy demands for lighting and climate control are also high, making it impractical for residential use without significant modifications. 
    <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/" target="_blank">Learn more</a>`,
  },
  "TownHouse": {
    "Pico Hydropower": `These structures are typically located in urban or suburban areas where access to flowing water sources is rare. Pico hydropower requires proximity to a river or stream, which is uncommon in residential or commercial zones. Additionally, the infrastructure needed (e.g., penstocks, turbines) is not feasible for most single-family homes or multi-unit buildings. 
    <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/">Learn more</a>`,

    "Vertical Farming": `These structures typically lack the space and structural capacity to support vertical farming systems. The energy demands for lighting and climate control are also high, making it impractical for residential use without significant modifications. 
    <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/" target="_blank">Learn more</a>`,
  },
  "Mobile Home": {
    "Heat Pump": `Geothermal heat pumps are not compatible with mobile homes because they require underground loops for heat exchange, but mobile homes typically lack the necessary land space for installation. Additionally, mobile homes have limited insulation and ductwork, making geothermal systems less efficient. Lastly, the installation cost and structural requirements of geothermal heat pumps are impractical for most mobile home setups. 
    <a href="https://mobilehomeideas.com/a-comprehensive-guide-to-mobile-home-heat-pumps/">Learn more</a>`,

    "Solar Roof Tiles": `Mobile homes often have limited roof space and are frequently relocated, making the installation of solar roof tiles impractical. The structural integrity of mobile home roofs may also not support the weight of solar tiles. 
    <a href="https://www.intermtnwindandsolar.com/can-you-use-solar-power-for-a-mobile-home/">Learn more</a>`,

    "Vertical Farming": `Mobile homes have limited space and are not designed to support the weight or energy requirements of vertical farming systems. The mobility of these homes also conflicts with the permanent infrastructure needed for vertical farming. 
    <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/" target="_blank">Learn more</a>`,
  },
  "Apartments": {
    "Pico Hydropower": `These structures are typically located in urban or suburban areas where access to flowing water sources is rare. Pico hydropower requires proximity to a river or stream, which is uncommon in residential or commercial zones. Additionally, the infrastructure needed (e.g., penstocks, turbines) is not feasible for most single-family homes or multi-unit buildings. 
    <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/">Learn more</a>`,

    "Solar Roof Tiles": `In multi-unit buildings, the roof space is often shared or limited, making it difficult to install solar roof tiles for individual units. Additionally, the orientation and shading of large buildings can reduce the efficiency of solar tiles. 
    <a href="https://build-construct.com/building/solar-roof-tiles/">Learn more</a>`,
  },
  "Office Building": {
    "Pico Hydropower": `These structures are typically located in urban or suburban areas where access to flowing water sources is rare. Pico hydropower requires proximity to a river or stream, which is uncommon in residential or commercial zones. Additionally, the infrastructure needed (e.g., penstocks, turbines) is not feasible for most single-family homes or multi-unit buildings. 
    <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/">Learn more</a>`,

    "Solar Roof Tiles": `In multi-unit buildings, the roof space is often shared or limited, making it difficult to install solar roof tiles for individual units. Additionally, the orientation and shading of large buildings can reduce the efficiency of solar tiles. 
    <a href="https://build-construct.com/building/solar-roof-tiles/">Learn more</a>`,
  },
};

const GameModal = ({ isOpen, onClose, modalContent }) => {
  // Get explanation based on infrastructure and renewable source
  const explanation =
    modalContent.isImpossible &&
      explanations[modalContent.infrastructure] &&
      explanations[modalContent.infrastructure][modalContent.name]
      ? explanations[modalContent.infrastructure][modalContent.name]
      : "This infrastructure is suitable for the selected renewable energy source, maximizing efficiency and sustainability.";

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "rgba(30, 30, 50, 0.95)",
          border: "2px solid #5A5AF6",
          boxShadow: 24,
          borderRadius: "16px",
          p: 4,
          textAlign: "center",
          width: 700,
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: modalContent.isImpossible ? "#FF4444" : "#FFAA00",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: 2,
            mb: 2,
            textShadow: modalContent.isImpossible
              ? "0px 0px 12px rgba(255, 68, 68, 0.8)"
              : "0px 0px 12px rgba(255,170,0,0.8)",
            textAlign: "center",
          }}
        >
          {modalContent.name}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: "#F8F8F8",
            fontWeight: "bold",
            textShadow: "0px 0px 6px rgba(255,255,255,0.6)",
            textAlign: "center",
          }}
        >
          Type: {modalContent.type}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: "#AAA",
            fontSize: "18px",
            mt: 1,
            textAlign: "center",
          }}
        >
          Infrastructure: {modalContent.infrastructure}
        </Typography>

        {modalContent.isImpossible ? (
          <Typography
            variant="body1"
            sx={{
              color: "#FF6666",
              mt: 2,
              fontSize: "20px",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "rgba(255, 68, 68, 0.1)",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            ⚠️ Sorry, this Renewable Source cannot be applied to this infrastructure.
          </Typography>
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: "#CCC",
              mt: 2,
              fontSize: "20px",
              textAlign: "center",
              backgroundColor: "rgba(0, 255, 0, 0.1)",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            ✅ This renewable source is compatible with your chosen infrastructure.
          </Typography>
        )}

        <Typography
          variant="body2"
          sx={{
            color: "#BBB",
            mt: 2,
            fontSize: "18px",
            fontStyle: "italic",
            textAlign: "justify", // 🔥 Ensures justified text
            lineHeight: "1.6", // Improves readability
          }}
          dangerouslySetInnerHTML={{ __html: explanation }}
        />



        <Button
          onClick={onClose}
          sx={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            width: "50px",
            height: "50px",
            minWidth: "unset",
            background: explanations
              ? "linear-gradient(45deg, #FF5555, #CC0000)"
              : "linear-gradient(45deg, #FFCC00, #FF6600)",
            color: "#FFF",
            fontWeight: "bold",
            borderRadius: "50%",
            fontSize: "18px",
            textShadow: "0px 0px 5px rgba(255,255,255,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
            "&:hover": {
              background: explanations
                ? "linear-gradient(45deg, #FF0000, #990000)"
                : "linear-gradient(45deg, #FF9900, #FF3300)",
              boxShadow: "0px 0px 15px rgba(255,102,0,0.8)",
            },
          }}
        >
          ✖
        </Button>

      </Box>
    </Modal>
  );
};

export default GameModal;
