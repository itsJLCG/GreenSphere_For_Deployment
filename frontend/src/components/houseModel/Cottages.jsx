import { useTexture } from "@react-three/drei";
import React, { useState, useMemo, useContext } from "react";
import { HomeContext } from "../HomeContext.jsx";
import { Roofs, SolarWaterHeatingTiles, MicroHydroPowerSystemTiles, HeatPumpTiles, SmallWindTurbinesTiles, VerticalAxisWindTurbinesTiles, GableRoofGrid, GableRoofGridTiles } from "./SingleFamilyHouse.jsx";
import TechnoEconomicAnalysis from "../TechnoEconomicAnalysis.jsx";
import { Html } from "@react-three/drei";

const useOccupiedCells = () => {
  const [occupiedCells, setOccupiedCells] = useState([]);

  const isCellOccupied = (x, z) => {
    return occupiedCells.some(cell => cell.x === x && cell.z === z);
  };

  const occupyCell = (x, z) => {
    if (!isCellOccupied(x, z)) {
      setOccupiedCells(prev => [...prev, { x, z }]);
    }
  };

  const releaseCell = (x, z) => {
    setOccupiedCells(prev => prev.filter(cell => cell.x !== x || cell.z !== z));
  };

  return { isCellOccupied, occupyCell, releaseCell };
};

const WindowCottage = ({ position }) => {
  const WindowCottage = useTexture("../assets/images/windowcottage.jpg"); // ✅ Fixed syntax

  return (
    <mesh position={position}>
      <boxGeometry args={[0.85, 1.5, 0.1]} /> {/* Window size remains the same */}
      <meshStandardMaterial map={WindowCottage} /> {/* ✅ Apply texture */}
    </mesh>
  );
};

const CottagesHouse = ({ roofType, showSolarPanels, showSolarRoofTiles, showSolarWaterHeating, showHeatPump, showSmallWindTurbines, showVerticalAxisWindTurbines, showMicroHydroPowerSystem }) => {
  const wallTexture = useTexture("../assets/images/cottagewall.webp");
  const doorTexture = useTexture("../assets/images/cottagedoor.jpg");
/*   const [solarWaterHeating, setSolarWaterHeating] = useState([]);
  const [heatPump, setHeatPump] = useState([]); */
  const [solarPanels, setSolarPanels] = useState([]);
  const [solarRoofTiles, setSolarRoofTiles] = useState([]);
/*   const [smallWindTurbines, setSmallWindTurbines] = useState([]);
  const [verticalAxisWindTurbines, setVerticalAxisWindTurbines] = useState([]);
  const [microHydroPowerSystem, setMicroHydroPowerSystem] = useState([]); */

  const { 
    solarWaterHeating,
    smallWindTurbines,
    verticalAxisWindTurbines,
    microHydroPowerSystem,
    heatPump, 
  } = useContext(HomeContext);
  
  const occupiedCells = useOccupiedCells();

  // Check if any solar panels are added
  const hasSolarPanels = solarPanels.length > 0;
  const hasSolarRoofTiles = solarRoofTiles.length > 0;
  const hasSolarWaterHeating = solarWaterHeating.length > 0;
  const hasHeatPump = heatPump.length > 0;
  const hasSmallWindTurbines = smallWindTurbines.length > 0;
  const hasVerticalAxisWindTurbines = verticalAxisWindTurbines.length > 0;
  const hasMicroHydroPowerSystem = microHydroPowerSystem.length > 0;

  return (
    <group position={[0, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[6, 6, 6]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Lamp on the Wall */}
      <mesh position={[-2.5, 4.5, 2.91]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={hasSolarPanels || hasSolarRoofTiles || hasSolarWaterHeating || hasHeatPump || hasSmallWindTurbines || hasVerticalAxisWindTurbines ? "yellow" : "black"} />
      </mesh>

      <mesh position={[2.5, 4.5, 2.91]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={hasSolarPanels || hasSolarRoofTiles || hasSolarWaterHeating || hasHeatPump || hasSmallWindTurbines || hasVerticalAxisWindTurbines ? "yellow" : "black"} />
      </mesh>

      {/* Lampshade - Moved Up and Enlarged */}
      <mesh position={[0, 2.75, 0]}>
        <cylinderGeometry args={[1, 1.2, 1, 10]} />
        <meshStandardMaterial color={hasSolarPanels || hasSolarRoofTiles || hasSolarWaterHeating || hasHeatPump || hasSmallWindTurbines || hasVerticalAxisWindTurbines ? "yellow" : "black"} />
      </mesh>

      {/* Enlarged Lamp Stand */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 4, 20]} />
        <meshStandardMaterial color="silver" />
      </mesh>

      {/* Lamp Base */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.2, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
{/* Outer Black Frame - Front, Back, Left, Right */}
<mesh position={[0, -6, 4.1]}>
        <boxGeometry args={[12, 0.3, 0.3]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0, -6, -4.1]}>
        <boxGeometry args={[12, 0.3, 0.3]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-6.1, -6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[8, 0.3, 0.3]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[6.1, -6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[8, 0.3, 0.3]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Inner Water Area (Filling the entire space) */}
      <mesh position={[0, -6, 0]}>
        <boxGeometry args={[12, 0.25, 8]} />
        <meshStandardMaterial color={hasMicroHydroPowerSystem ? "blue" : "grey"} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.5, 3.01]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial map={doorTexture} />
      </mesh>

      {/* Windows */}
      <WindowCottage position={[-2.5, 3, 3.01]} />
      <WindowCottage position={[2.5, 3, 3.01]} />

      {/* Gable Roof */}
      <Roofs.Gable texturePath="../assets/images/cottageroof.jpg" />

      {/* Gable Roof Grid for Solar Panels */}
      <GableRoofGrid
        solarPanels={solarPanels}
        setSolarPanels={setSolarPanels}
        showSolarPanels={showSolarPanels}
        occupiedCells={occupiedCells} // Pass occupiedCells here
      />
      <GableRoofGridTiles
        solarRoofTiles={solarRoofTiles}
        setSolarRoofTiles={setSolarRoofTiles}
        showSolarRoofTiles={showSolarRoofTiles}
        occupiedCells={occupiedCells} // Pass occupiedCells here
      />

      <SolarWaterHeatingTiles
        showSolarWaterHeating={showSolarWaterHeating}
        occupiedCells={occupiedCells} // Pass occupiedCells here
      />
      <HeatPumpTiles
        showHeatPump={showHeatPump}
        occupiedCells={occupiedCells} // Pass occupiedCells here
      />
      <SmallWindTurbinesTiles
        showSmallWindTurbines={showSmallWindTurbines}
        occupiedCells={occupiedCells} // Pass occupiedCells here
      />
      <VerticalAxisWindTurbinesTiles
        showVerticalAxisWindTurbines={showVerticalAxisWindTurbines}
        occupiedCells={occupiedCells} // Pass occupiedCells here
      />
      <MicroHydroPowerSystemTiles
        showMicroHydroPowerSystem={showMicroHydroPowerSystem}
        occupiedCells={occupiedCells} // Pass occupiedCells here
      />

      {/* For Analysis */}
      <Html>
        <TechnoEconomicAnalysis
          solarPanels={solarPanels}
          solarRoofTiles={solarRoofTiles}
          solarWaterHeating={solarWaterHeating}
          heatPump={heatPump}
          smallWindTurbines={smallWindTurbines}
          verticalAxisWindTurbines={verticalAxisWindTurbines}
          microHydroPowerSystem={microHydroPowerSystem}
        />
      </Html>
    </group>
  );
};


export default CottagesHouse;