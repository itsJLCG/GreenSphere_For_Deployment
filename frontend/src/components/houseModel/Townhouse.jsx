import { useTexture, useAnimations } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import React, { useState, useMemo, useEffect, useRef, useContext } from "react";
import { HomeContext } from "../HomeContext.jsx";
import { Window } from "./SingleFamilyHouse.jsx";
import TechnoEconomicAnalysis from "../TechnoEconomicAnalysis.jsx";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import SolarPanel from "../renewableModel/SolarPanel.jsx";
import SolarRoofTiles from "../renewableModel/SolarRoofTiles.jsx";

// Shared state for occupied cells
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

export const SolarWaterHeatingTiles = ({ onSelect, showSolarWaterHeating, occupiedCells }) => {
  const { solarWaterHeating, setSolarWaterHeating } = useContext(HomeContext);
  const gltf = useGLTF("../assets/models/solarwaterheater.glb");

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -2, 0];

  // House boundaries based on new walls
  const walls = [
    { position: [0, 1.75, 0], size: [5, 7.5, 6] },  // Base
    { position: [5, 2, 0], size: [5, 8, 6] },       // Right Wall
    { position: [-5, 2, 0], size: [5, 8, 6] }       // Left Wall
  ];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid (not inside any wall)
  const isValidPosition = (x, z) => {
    return !walls.some(({ position, size }) => {
      const xMin = position[0] - size[0] / 2;
      const xMax = position[0] + size[0] / 2;
      const zMin = position[2] - size[2] / 2;
      const zMax = position[2] + size[2] / 2;

      return x >= xMin && x <= xMax && z >= zMin && z <= zMax;
    });
  };

  // Handle grid cell click
  const handleClick = (x, z) => {
    if (!showSolarWaterHeating) return; // Prevent placement when slot is closed

    // Check if the cell is occupied by any renewable source
    if (occupiedCells.isCellOccupied(x, z)) {
      const isSolarWaterHeater = solarWaterHeating.some(tile => tile.x === x && tile.z === z);
      if (isSolarWaterHeater) {
        // Remove the solar water heater
        setSolarWaterHeating((prevTiles) => {
          console.log("Removing solar water heater at:", x, z);
          occupiedCells.releaseCell(x, z);
          return prevTiles.filter(tile => tile.x !== x || tile.z !== z);
        });
      } else {
        console.log("Cell is occupied by another renewable source, cannot place here.");
      }
      return; // Exit function to prevent placement
    }

    // If the cell is not occupied, place the solar water heater
    console.log("Placing solar water heater at:", x, z);
    occupiedCells.occupyCell(x, z);
    setSolarWaterHeating((prevTiles) => [...prevTiles, { x, z }]);
  };

  return (
    <>
      {/* Clickable Grid (Only active when showSolarWaterHeating is true) */}
      {showSolarWaterHeating &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - gridSize / 2) * cellSize + cellSize / 2;
            const z = (row - gridSize / 2) * cellSize + cellSize / 2;

            if (!isValidPosition(x, z)) return null;

            const isPlaced = solarWaterHeating.some(tile => tile.x === x && tile.z === z);

            return (
              <mesh
                key={`${x}-${z}`}
                position={[x, platformCenter[1] + 0.01, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={() => handleClick(x, z)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial
                  color={isPlaced ? "yellow" : "green"}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            );
          })
        )}

      {/* Always Render Placed Solar Water Heaters */}
      {solarWaterHeating.map(({ x, z }, index) => (
        <primitive
          key={`${x}-${z}-${index}`}
          object={gltf.scene.clone()}
          position={[x, -1.60, z]} // Adjusted Y-position
          scale={[3.5, 3.5, 3.5]} // Increased scale
        />
      ))}
    </>
  );
};


export const MicroHydroPowerSystemTiles = ({ onSelect, showMicroHydroPowerSystem, occupiedCells }) => {
  const { scene, animations } = useGLTF("../assets/models/microHydropowerSystem.glb");
  const { actions } = useAnimations(animations, scene);
  const mixers = useRef([]);
  const { microHydroPowerSystem, setMicroHydroPowerSystem } = useContext(HomeContext);

  useEffect(() => {
    if (actions && actions["Peddles.009Action"]) {
      actions["Peddles.009Action"].setLoop(THREE.LoopRepeat);
      actions["Peddles.009Action"].play();
    }
  }, [actions]);

  useFrame((_, delta) => {
    mixers.current.forEach((mixer) => mixer.update(delta));
  });

  const platformSize = 20;
  const platformCenter = [0, -2, 0];

  const walls = [
    { position: [0, 1.75, 0], size: [5, 7.5, 6] },
    { position: [5, 2, 0], size: [5, 8, 6] },
    { position: [-5, 2, 0], size: [5, 8, 6] }
  ];

  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  const isValidPosition = (x, z) => {
    return !walls.some(({ position, size }) => {
      const xMin = position[0] - size[0] / 2;
      const xMax = position[0] + size[0] / 2;
      const zMin = position[2] - size[2] / 2;
      const zMax = position[2] + size[2] / 2;

      return x >= xMin && x <= xMax && z >= zMin && z <= zMax;
    });
  };

  const handleClick = (x, z) => {
    if (!showMicroHydroPowerSystem) return;

    // Check if the cell is occupied
    if (occupiedCells.isCellOccupied(x, z)) {
      const isMicroHydroPowerSystem = microHydroPowerSystem.some(tile => tile.x === x && tile.z === z);
      if (isMicroHydroPowerSystem) {
        // Remove the micro-hydro power system
        setMicroHydroPowerSystem(prevTiles => {
          occupiedCells.releaseCell(x, z);
          return prevTiles.filter(tile => tile.x !== x || tile.z !== z);
        });
      } else {
        console.log("Cell occupied by another renewable source.");
      }
      return;
    }

    // Place the micro-hydro power system
    occupiedCells.occupyCell(x, z);
    setMicroHydroPowerSystem(prevTiles => [...prevTiles, { x, z }]);

    onSelect?.(x, z);
  };

  return (
    <>
      {showMicroHydroPowerSystem &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - gridSize / 2) * cellSize + cellSize / 2;
            const z = (row - gridSize / 2) * cellSize + cellSize / 2;

            if (!isValidPosition(x, z)) return null;

            const isPlaced = microHydroPowerSystem.some(tile => tile.x === x && tile.z === z);

            return (
              <mesh
                key={`${x}-${z}`}
                position={[x, platformCenter[1] + 0.01, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={() => handleClick(x, z)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial
                  color={isPlaced ? "green" : "brown"}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            );
          })
        )}

      {microHydroPowerSystem.map(({ x, z }, index) => {
        const turbine = scene.clone();
        const mixer = new THREE.AnimationMixer(turbine);

        animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat);
          action.play();
        });

        mixers.current[index] = mixer;

        return (
          <primitive
            key={`${x}-${z}-${index}`}
            object={turbine}
            position={[x, -2, z]}
            scale={[0.7, 0.7, 0.7]}
            rotation={[0, Math.PI / 2, 0]}
          />
        );
      })}
    </>
  );
};

export const SmallWindTurbinesTiles = ({ onSelect, showSmallWindTurbines, occupiedCells }) => {
  const { scene, animations } = useGLTF("../assets/models/wind_turbine(2).glb");
  const { actions } = useAnimations(animations, scene);
  const { smallWindTurbines, setSmallWindTurbines } = useContext(HomeContext);

  // Ref to store animation mixers
  const mixers = useRef([]);

  useEffect(() => {
    console.log("Animations loaded:", animations);
    console.log("Actions:", actions);

    if (actions && actions["turbineSpin"]) {
      console.log("Playing animation: turbineSpin");
      actions["turbineSpin"].setLoop(THREE.LoopRepeat);
      actions["turbineSpin"].play();
    } else {
      console.error("Animation 'turbineSpin' not found or scene not loaded");
    }
  }, [actions]);

  useFrame((_, delta) => {
    mixers.current.forEach((mixer) => mixer.update(delta));
  });

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -2, 0];

  // House boundaries
  const houseSize = 14;
  const houseCenter = [0, 2, 0];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  const isValidPosition = (x, z, row) => {
    if (row < 3) return false;
    const houseXMin = houseCenter[0] - houseSize / 2;
    const houseXMax = houseCenter[0] + houseSize / 2;
    const houseZMin = houseCenter[2] - houseSize / 2;
    const houseZMax = houseCenter[2] + houseSize / 2;
    return !(x >= houseXMin && x <= houseXMax && z >= houseZMin && z <= houseZMax);
  };

  const handleClick = (x, z) => {
    if (!showSmallWindTurbines) return;

    // Check if cell is occupied
    if (occupiedCells.isCellOccupied(x, z)) {
      const isSmallWindTurbine = smallWindTurbines.some(tile => tile.x === x && tile.z === z);
      if (isSmallWindTurbine) {
        // Remove the small wind turbine and release the cell
        setSmallWindTurbines(prevTiles => {
          occupiedCells.releaseCell(x, z);
          return prevTiles.filter(tile => tile.x !== x || tile.z !== z);
        });
      } else {
        console.log("Cell is occupied by another renewable source, cannot place here.");
      }
      return;
    }

    // Place turbine if not occupied
    console.log("Placing small wind turbine at:", x, z);
    occupiedCells.occupyCell(x, z);
    setSmallWindTurbines(prevTiles => [...prevTiles, { x, z }]);

    // Trigger parent logic if provided
    onSelect?.(x, z);
  };

  return (
    <>
      {showSmallWindTurbines &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - gridSize / 2) * cellSize + cellSize / 2;
            const z = (row - gridSize / 2) * cellSize + cellSize / 2;

            if (!isValidPosition(x, z, row)) return null;

            const isPlaced = smallWindTurbines.some(tile => tile.x === x && tile.z === z);

            return (
              <mesh
                key={`${x}-${z}`}
                position={[x, platformCenter[1] + 0.01, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={() => handleClick(x, z)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial
                  color={isPlaced ? "green" : "red"}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            );
          })
        )}

      {smallWindTurbines.map(({ x, z }, index) => {
        const turbine = scene.clone();
        const mixer = new THREE.AnimationMixer(turbine);

        animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat);
          action.play();
        });

        mixers.current[index] = mixer;

        return (
          <primitive
            key={`${x}-${z}-${index}`}
            object={turbine}
            position={[x, -2, z]}
            scale={[55, 55, 55]}
            rotation={[0, - Math.PI / 2, 0]}
          />
        );
      })}
    </>
  );
};



export const VerticalAxisWindTurbinesTiles = ({ onSelect, showVerticalAxisWindTurbines, occupiedCells }) => {
  const { scene, animations } = useGLTF("../assets/models/verticalAxisWindTurbineAnimated.glb");
  const { actions } = useAnimations(animations, scene);
  const mixers = useRef([]);
  const { verticalAxisWindTurbines, setVerticalAxisWindTurbines } = useContext(HomeContext);

  useEffect(() => {
    if (actions && actions["Object_6.001Action"]) {
      actions["Object_6.001Action"].setLoop(THREE.LoopRepeat);
      actions["Object_6.001Action"].play();
    }
  }, [actions]);

  useFrame((_, delta) => {
    mixers.current.forEach((mixer) => mixer.update(delta));
  });

  const platformSize = 20;
  const platformCenter = [0, -2, 0];
  const houseSize = 14;
  const houseCenter = [0, 2, 0];
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  const isValidPosition = (x, z, row) => {
    if (row < 3) return false;
    const houseXMin = houseCenter[0] - houseSize / 2;
    const houseXMax = houseCenter[0] + houseSize / 2;
    const houseZMin = houseCenter[2] - houseSize / 2;
    const houseZMax = houseCenter[2] + houseSize / 2;
    return !(x >= houseXMin && x <= houseXMax && z >= houseZMin && z <= houseZMax);
  };

  const handleClick = (x, z) => {
    if (!showVerticalAxisWindTurbines) return;

    if (occupiedCells.isCellOccupied(x, z)) {
      const isVerticalAxisWindTurbine = verticalAxisWindTurbines.some(tile => tile.x === x && tile.z === z);
      if (isVerticalAxisWindTurbine) {
        setVerticalAxisWindTurbines(prevTiles => {
          occupiedCells.releaseCell(x, z);
          return prevTiles.filter(tile => tile.x !== x || tile.z !== z);
        });
      }
      return;
    }

    occupiedCells.occupyCell(x, z);
    setVerticalAxisWindTurbines(prevTiles => [...prevTiles, { x, z }]);
    onSelect?.(x, z);
  };

  return (
    <>
      {showVerticalAxisWindTurbines &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - gridSize / 2) * cellSize + cellSize / 2;
            const z = (row - gridSize / 2) * cellSize + cellSize / 2;
            if (!isValidPosition(x, z, row)) return null;
            const isPlaced = verticalAxisWindTurbines.some(tile => tile.x === x && tile.z === z);
            return (
              <mesh
                key={`${x}-${z}`}
                position={[x, platformCenter[1] + 0.01, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={() => handleClick(x, z)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial color={isPlaced ? "green" : "violet"} transparent opacity={0.5} />
              </mesh>
            );
          })
        )}

      {verticalAxisWindTurbines.map(({ x, z }, index) => {
        const turbine = scene.clone();
        const mixer = new THREE.AnimationMixer(turbine);
        animations.forEach(clip => {
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat);
          action.play();
        });
        mixers.current[index] = mixer;
        return <primitive key={`${x}-${z}-${index}`} object={turbine} position={[x, 7, z]} scale={[0.6, 0.7, 0.7]} />;
      })}
    </>
  );
};



export const HeatPumpTiles = ({ onSelect, showHeatPump }) => {
  const gltf = useGLTF("../assets/models/heatPump.glb");
  const { heatPump, setHeatPump } = useContext(HomeContext);

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -2, 0];

  // Recommended Zones (Buildings)
  const recommendedZones = [
    { center: [0, 1.75, 0], size: [5, 7.5, 6] },  // Central building
    { center: [5, 2, 0], size: [5, 8, 6] },      // Right building
    { center: [-5, 2, 0], size: [5, 8, 6] }      // Left building
  ];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is inside a recommended area
  const isValidPosition = (x, z) => {
    return recommendedZones.some(({ center, size }) => {
      const xMin = center[0] - size[0] / 2;
      const xMax = center[0] + size[0] / 2;
      const zMin = center[2] - size[2] / 2;
      const zMax = center[2] + size[2] / 2;

      return x >= xMin && x <= xMax && z >= zMin && z <= zMax;
    });
  };

  // Handle grid cell click
  const handleClick = (x, z) => {
    if (!showHeatPump) return;

    onSelect?.(x, z);

    setHeatPump((prevTiles) => {
      const exists = prevTiles.some(tile => tile.x === x && tile.z === z);
      return exists
        ? prevTiles.filter(tile => tile.x !== x || tile.z !== z)
        : [...prevTiles, { x, z }];
    });
  };

  return (
    <>
      {/* Clickable Grid (Only active when showHeatPump is true) */}
      {showHeatPump &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - gridSize / 2) * cellSize + cellSize / 2;
            const z = (row - gridSize / 2) * cellSize + cellSize / 2;

            if (!isValidPosition(x, z)) return null; // Now allows placement **inside** the buildings only

            const isPlaced = heatPump.some(tile => tile.x === x && tile.z === z);

            return (
              <mesh
                key={`${x}-${z}`}
                position={[x, platformCenter[1] + 0.01, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={() => handleClick(x, z)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial
                  color={isPlaced ? "yellow" : "blue"} // Highlight placed tiles
                  transparent
                  opacity={0.5}
                />
              </mesh>
            );
          })
        )}

      {/* Always Render Placed Heat Pumps */}
      {heatPump.map(({ x, z }, index) => (
        <primitive
          key={`${x}-${z}-${index}`}
          object={gltf.scene.clone()}
          position={[x, -5.50, z]}
          scale={[3, 3, 3]}
        />
      ))}
    </>
  );
};

export const GableRoofGridTown = ({ solarPanels = [], setSolarPanels, showSolarPanels }) => {
  const cellSize = 2;
  const roofPositions = [
    [0, 7, 0],    // Center roof
    [5, 8, 0],    // Right roof
    [-5, 8, 0]    // Left roof
  ];

  const positions = [
    [0, 7, 1.9], [0, 7, -1.9], [-1.8, 7, 0], [1.8, 7, 0], // Center roof
    [5, 8, 1.9], [5, 8, -1.9], [3.2, 8, 0], [6.8, 8, 0],  // Right roof
    [-5, 8, 1.9], [-5, 8, -1.9], [-6.8, 8, 0], [-3.2, 8, 0] // Left roof
  ];

  const rotations = [
    [-Math.PI / 4, 0, 0], [Math.PI / 4, Math.PI, 0], [Math.PI / 2, -2.3, 0], [Math.PI / 2, 2.3, 0],
    [-Math.PI / 4, 0, 0], [Math.PI / 4, Math.PI, 0], [Math.PI / 2, -2.3, 0], [Math.PI / 2, 2.3, 0],
    [-Math.PI / 4, 0, 0], [Math.PI / 4, Math.PI, 0], [Math.PI / 2, -2.3, 0], [Math.PI / 2, 2.3, 0]
  ];

  const handleClick = (index) => {
    if (solarPanels.includes(index)) {
      setSolarPanels(solarPanels.filter(i => i !== index));
    } else {
      setSolarPanels([...solarPanels, index]);
    }
    console.log("Updated Solar Panels:", solarPanels);
  };

  return (
    <group>
      {showSolarPanels && positions.map((pos, index) => {
        const isSelected = solarPanels.includes(index);
        return (
          <mesh
            key={index}
            position={pos}
            rotation={rotations[index]}
            onClick={() => handleClick(index)}
          >
            <planeGeometry args={[cellSize, cellSize]} />
            <meshStandardMaterial
              color={isSelected ? "yellow" : "green"}
              transparent={true}
              opacity={isSelected ? 0 : 0.5}
            />
          </mesh>
        );
      })}
      {/* Render Solar Panels */}
      {solarPanels.map((index) => (
        <SolarPanel key={index} position={positions[index]} rotation={rotations[index]} />
      ))}
    </group>
  );
};

export const GableRoofGridTilesTown = ({ solarRoofTiles = [], setSolarRoofTiles, showSolarRoofTiles }) => {
  const cellSize = 2;
  const roofPositions = [
    [0, 7, 0],    // Center roof
    [5, 8, 0],    // Right roof
    [-5, 8, 0]    // Left roof
  ];

  const positions = [
    [0, 7, 1.9], [0, 7, -1.9], [-1.8, 7, 0], [1.8, 7, 0], // Center roof
    [5, 8, 1.9], [5, 8, -1.9], [3.2, 8, 0], [6.8, 8, 0],  // Right roof
    [-5, 8, 1.9], [-5, 8, -1.9], [-6.8, 8, 0], [-3.2, 8, 0] // Left roof
  ];

  const rotations = [
    [-Math.PI / 4, 0, 0], [Math.PI / 4, Math.PI, 0], [Math.PI / 2, -2.3, 0], [Math.PI / 2, 2.3, 0],
    [-Math.PI / 4, 0, 0], [Math.PI / 4, Math.PI, 0], [Math.PI / 2, -2.3, 0], [Math.PI / 2, 2.3, 0],
    [-Math.PI / 4, 0, 0], [Math.PI / 4, Math.PI, 0], [Math.PI / 2, -2.3, 0], [Math.PI / 2, 2.3, 0]
  ];

  const handleClick = (index) => {
    if (solarRoofTiles.includes(index)) {
      setSolarRoofTiles(solarRoofTiles.filter(i => i !== index));
    } else {
      setSolarRoofTiles([...solarRoofTiles, index]);
    }
    console.log("Updated Solar RoofTiles:", solarRoofTiles);
  };

  return (
    <group>
      {showSolarRoofTiles && positions.map((pos, index) => {
        const isSelected = solarRoofTiles.includes(index);
        return (
          <mesh
            key={index}
            position={pos}
            rotation={rotations[index]}
            onClick={() => handleClick(index)}
          >
            <planeGeometry args={[cellSize, cellSize]} />
            <meshStandardMaterial
              color={isSelected ? "yellow" : "green"}
              transparent={true}
              opacity={isSelected ? 0 : 0.5}
            />
          </mesh>
        );
      })}
      {/* Render Solar Panels */}
      {solarRoofTiles.map((index) => (
        <SolarRoofTiles key={index} position={positions[index]} rotation={rotations[index]} />
      ))}
    </group>
  );
};

const TownHouse = ({ roofType, showSolarPanels, showSolarRoofTiles, showSolarWaterHeating, showHeatPump, showSmallWindTurbines, showVerticalAxisWindTurbines, showMicroHydroPowerSystem }) => {
  const townTexture1 = useTexture("../assets/images/townwall1.jpg");
  const townTexture2 = useTexture("../assets/images/townwall2.jpg");
  const doorTexture = useTexture("../assets/images/door.jpg");
  const roofTexture = useTexture("../assets/images/townhouseroof.jpg");
/*   const [solarWaterHeating, setSolarWaterHeating] = useState([]);
  const [heatPump, setHeatPump] = useState([]);
  const [smallWindTurbines, setSmallWindTurbines] = useState([]);
  const [verticalAxisWindTurbines, setVerticalAxisWindTurbines] = useState([]);
  const [microHydroPowerSystem, setMicroHydroPowerSystem] = useState([]); */
  const [solarPanels, setSolarPanels] = useState([]);
  const [solarRoofTiles, setSolarRoofTiles] = useState([]);

    const { 
      solarWaterHeating,
      smallWindTurbines,
      verticalAxisWindTurbines,
      microHydroPowerSystem,
      heatPump,
    } = useContext(HomeContext);

  const occupiedCells = useOccupiedCells();

  const hasSolarPanels = solarPanels.length > 0;
  const hasSolarRoofTiles = solarRoofTiles.length > 0;
  const hasSolarWaterHeating = solarWaterHeating.length > 0;
  const hasHeatPump = heatPump.length > 0;
  const hasSmallWindTurbines = smallWindTurbines.length > 0;
  const hasVerticalAxisWindTurbines = verticalAxisWindTurbines.length > 0;
  const hasMicroHydroPowerSystem = microHydroPowerSystem.length > 0;

  return (
    <group position={[0, 1, 0]}>
      {/* Base */}
      <mesh position={[0, 1.75, 0]}>
        <boxGeometry args={[5, 7.5, 6]} />
        <meshStandardMaterial map={townTexture2} />
      </mesh>
      <mesh position={[5, 2, 0]}>
        <boxGeometry args={[5, 8, 6]} />
        <meshStandardMaterial map={townTexture1} />
      </mesh>
      <mesh position={[-5, 2, 0]}>
        <boxGeometry args={[5, 8, 6]} />
        <meshStandardMaterial map={townTexture1} />
      </mesh>

      {/* Lamp on the Wall */}
      <mesh position={[-6.7, 5.5, 2.91]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={hasSolarPanels || hasSolarRoofTiles || hasSolarWaterHeating || hasHeatPump || hasSmallWindTurbines || hasVerticalAxisWindTurbines ? "yellow" : "black"} />
      </mesh>

      <mesh position={[6.7, 5.5, 2.91]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={hasSolarPanels || hasSolarRoofTiles || hasSolarWaterHeating || hasHeatPump || hasSmallWindTurbines || hasVerticalAxisWindTurbines ? "yellow" : "black"} />
      </mesh>

      {/* Lampshade - Moved Up and Enlarged */}
      <mesh position={[0, 2.75, 0]}>
        <cylinderGeometry args={[1, 1.2, 1, 10]} />
        <meshStandardMaterial color={hasSolarPanels || hasSolarRoofTiles || hasSolarWaterHeating || hasHeatPump || hasSmallWindTurbines || hasVerticalAxisWindTurbines ? "yellow" : "black"} />
      </mesh>

      {/* Enlarged Lamp Stand */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 4, 20]} />
        <meshStandardMaterial color="silver" />
      </mesh>

      {/* Lamp Base */}
      <mesh position={[0, -2, 0]}>
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
      <mesh position={[0, -0.5, 3.01]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial map={doorTexture} />
      </mesh>
      <mesh position={[5, -0.5, 3.01]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial map={doorTexture} />
      </mesh>
      <mesh position={[-5, -0.5, 3.01]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial map={doorTexture} />
      </mesh>

      {/* Windows */}
      <Window position={[-1.5, 3.5, 3.01]} />
      <Window position={[1.5, 3.5, 3.01]} />

      <Window position={[6.5, 3.5, 3.01]} />
      <Window position={[-6.5, 3.5, 3.01]} />

      <Window position={[3.5, 3.5, 3.01]} />
      <Window position={[-3.5, 3.5, 3.01]} />

      {/* Roof */}
      <mesh position={[0, 7, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[5, 4, 4]} />
        <meshStandardMaterial map={roofTexture} />
      </mesh>
      <mesh position={[5, 8, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[5, 4, 4]} />
        <meshStandardMaterial map={roofTexture} />
      </mesh>
      <mesh position={[-5, 8, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[5, 4, 4]} />
        <meshStandardMaterial map={roofTexture} />
      </mesh>

      <GableRoofGridTown
        solarPanels={solarPanels}
        setSolarPanels={setSolarPanels}
        showSolarPanels={showSolarPanels}
        occupiedCells={occupiedCells} // Pass occupiedCells here
      />
      <GableRoofGridTilesTown
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
      <Html>
        <TechnoEconomicAnalysis
          solarWaterHeating={solarWaterHeating}
          heatPump={heatPump}
          smallWindTurbines={smallWindTurbines}
          verticalAxisWindTurbines={verticalAxisWindTurbines}
          microHydroPowerSystem={microHydroPowerSystem}
          solarPanels={solarPanels}
          solarRoofTiles={solarRoofTiles}
        />
      </Html>
    </group>
  );
};

export default TownHouse;