import { useTexture, useGLTF, useAnimations } from "@react-three/drei";
import React, { useState, useMemo, useEffect, useRef, useContext } from "react";
import { HomeContext } from "../HomeContext.jsx";
import SolarPanel from "../renewableModel/SolarPanel.jsx";
import TechnoEconomicAnalysis from "../TechnoEconomicAnalysis.jsx";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

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
  const platformCenter = [0, -1, 0];

  // House boundaries based on new walls
  const walls = [
    { position: [0, 1.75, 0], size: [5, 7.5, 6] },  // Base
    { position: [4, 2, 0], size: [4, 8, 6] },       // Right Wall
    { position: [-4, 2, 0], size: [4, 8, 6] }       // Left Wall
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
      // Check if the cell is occupied by a solar water heater
      const isSolarWaterHeater = solarWaterHeating.some(tile => tile.x === x && tile.z === z);
      if (isSolarWaterHeater) {
        // Remove the solar water heater
        setSolarWaterHeating((prevTiles) => {
          console.log("Removing solar water heater at:", x, z); // Debug log
          occupiedCells.releaseCell(x, z);
          return prevTiles.filter(tile => tile.x !== x || tile.z !== z);
        });
      } else {
        console.log("Cell is occupied by another renewable source, cannot place here."); // Debug log
      }
      return; // Exit the function to prevent placement
    }

    // If the cell is not occupied, place the solar water heater
    console.log("Placing solar water heater at:", x, z); // Debug log
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
          position={[x, -0.6, z]} // Adjusted Y-position
          scale={[3.5, 3.5, 3.5]} // Increased scale
        />
      ))}
    </>
  );
};

export const MicroHydroPowerSystemTiles = ({ onSelect, showMicroHydroPowerSystem, occupiedCells }) => {
  const { scene, animations } = useGLTF("../assets/models/microHydropowerSystem.glb");
  const { actions } = useAnimations(animations, scene);
  const { microHydroPowerSystem, setMicroHydroPowerSystem } = useContext(HomeContext);

  // Ref to store mixers for each turbine
  const mixers = useRef([]);

  useEffect(() => {
    console.log("Animations loaded:", animations);
    console.log("Actions:", actions);

    if (actions && actions["Peddles.009Action"]) {
      console.log("Playing animation: Peddles.009Action");
      actions["Peddles.009Action"].setLoop(THREE.LoopRepeat);
      actions["Peddles.009Action"].play();
    } else {
      console.error("Animation 'Peddles.009Action' not found or scene not loaded");
    }
  }, [actions]);

  // Update all mixers on every frame
  useFrame((_, delta) => {
    mixers.current.forEach((mixer) => mixer.update(delta));
  });

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -1, 0];

  // House boundaries based on new walls
  const walls = [
    { position: [0, 1.75, 0], size: [5, 7.5, 6] },  // Base
    { position: [4, 2, 0], size: [4, 8, 6] },       // Right Wall
    { position: [-4, 2, 0], size: [4, 8, 6] }       // Left Wall
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

  const handleClick = (x, z) => {
    if (!showMicroHydroPowerSystem) return; // Prevent placement when slot is closed

    // Check if the cell is occupied by any renewable source
    if (occupiedCells.isCellOccupied(x, z)) {
      // Check if the cell is occupied by a micro-hydro power system
      const isMicroHydroPowerSystem = microHydroPowerSystem.some(tile => tile.x === x && tile.z === z);
      if (isMicroHydroPowerSystem) {
        // Remove the micro-hydro power system
        setMicroHydroPowerSystem((prevTiles) => {
          console.log("Removing micro-hydro power system at:", x, z); // Debug log
          occupiedCells.releaseCell(x, z);
          return prevTiles.filter(tile => tile.x !== x || tile.z !== z);
        });
      } else {
        console.log("Cell is occupied by another renewable source, cannot place here."); // Debug log
      }
      return; // Exit the function to prevent placement
    }

    // If the cell is not occupied, place the micro-hydro power system
    console.log("Placing micro-hydro power system at:", x, z); // Debug log
    occupiedCells.occupyCell(x, z);
    setMicroHydroPowerSystem((prevTiles) => [...prevTiles, { x, z }]);

    // Trigger parent logic if provided
    onSelect?.(x, z);
  };

  return (
    <>
      {/* Clickable Grid (Only active when showMicroHydroPowerSystem is true) */}
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

      {/* Render Animated MicroHydroPowerSystems */}
      {microHydroPowerSystem.map(({ x, z }, index) => {
        const turbine = scene.clone();
        const mixer = new THREE.AnimationMixer(turbine);

        // Reapply animations to the cloned scene
        animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat);
          action.play();
        });

        // Store the mixer in the ref
        mixers.current[index] = mixer;

        return (
          <primitive
            key={`${x}-${z}-${index}`}
            object={turbine}
            position={[x, -1, z]} // Adjusted Y-position
            scale={[0.7, 0.7, 0.7]} // Increased scale
            rotation={[0, Math.PI / 2, 0]} // Rotates 90 degrees to the left
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

  // Ref to store mixers for each turbine
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

  // Update all mixers on every frame
  useFrame((_, delta) => {
    mixers.current.forEach((mixer) => mixer.update(delta));
  });

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -1, 0];

  // House boundaries (Increased size to 14)
  const houseSize = 14;
  const houseCenter = [0, 2, 0];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid (Excluding house area and first two rows)
  const isValidPosition = (x, z, row) => {
    if (row < 3) return false;

    const houseXMin = houseCenter[0] - houseSize / 2;
    const houseXMax = houseCenter[0] + houseSize / 2;
    const houseZMin = houseCenter[2] - houseSize / 2;
    const houseZMax = houseCenter[2] + houseSize / 2;

    return !(x >= houseXMin && x <= houseXMax && z >= houseZMin && z <= houseZMax);
  };

  // Handle grid cell click
  const handleClick = (x, z) => {
    if (!showSmallWindTurbines) return; // Prevent placement when slot is closed

    // Check if the cell is occupied by any renewable source
    if (occupiedCells.isCellOccupied(x, z)) {
      // Check if the cell is occupied by a small wind turbine
      const isSmallWindTurbine = smallWindTurbines.some(tile => tile.x === x && tile.z === z);
      if (isSmallWindTurbine) {
        // Remove the small wind turbine
        setSmallWindTurbines((prevTiles) => {
          console.log("Removing small wind turbine at:", x, z); // Debug log
          occupiedCells.releaseCell(x, z);
          return prevTiles.filter(tile => tile.x !== x || tile.z !== z);
        });
      } else {
        console.log("Cell is occupied by another renewable source, cannot place here."); // Debug log
      }
      return; // Exit the function to prevent placement
    }

    // If the cell is not occupied, place the small wind turbine
    console.log("Placing small wind turbine at:", x, z); // Debug log
    occupiedCells.occupyCell(x, z);
    setSmallWindTurbines((prevTiles) => [...prevTiles, { x, z }]);

    // Trigger parent logic if provided
    onSelect?.(x, z);
  };

  return (
    <>
      {/* Clickable Grid (Only active when showSmallWindTurbines is true) */}
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

      {/* Render Animated SmallWindTurbines */}
      {smallWindTurbines.map(({ x, z }, index) => {
        const turbine = scene.clone();
        const mixer = new THREE.AnimationMixer(turbine);

        // Reapply animations to the cloned scene
        animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat);
          action.play();
        });

        // Store the mixer in the ref
        mixers.current[index] = mixer;

        return (
          <primitive
            key={`${x}-${z}-${index}`}
            object={turbine}
            position={[x, -1, z]}
            scale={[55, 55, 55]}
            rotation={[0, -Math.PI / 2, 0]} // Rotate 90 degrees (π/2 radians) to the left
          />
        );
      })}
    </>
  );
};

export const VerticalAxisWindTurbinesTiles = ({ onSelect, showVerticalAxisWindTurbines, occupiedCells }) => {
  const { scene, animations } = useGLTF("../assets/models/verticalAxisWindTurbineAnimated.glb");
  const { actions } = useAnimations(animations, scene);
  const { verticalAxisWindTurbines, setVerticalAxisWindTurbines } = useContext(HomeContext);

  // Ref to store mixers for each turbine
  const mixers = useRef([]);

  useEffect(() => {
    console.log("Animations loaded:", animations);
    console.log("Actions:", actions);

    if (actions && actions["Object_6.001Action"]) {
      console.log("Playing animation: Object_6.001Action");
      actions["Object_6.001Action"].setLoop(THREE.LoopRepeat);
      actions["Object_6.001Action"].play();
    } else {
      console.error("Animation 'Object_6.001Action' not found or scene not loaded");
    }
  }, [actions]);

  // Update all mixers on every frame
  useFrame((_, delta) => {
    mixers.current.forEach((mixer) => mixer.update(delta));
  });

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -1, 0];

  // House boundaries (Increased size to 14)
  const houseSize = 14;
  const houseCenter = [0, 2, 0];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid (Excluding house area and first two rows)
  const isValidPosition = (x, z, row) => {
    if (row < 3) return false;

    const houseXMin = houseCenter[0] - houseSize / 2;
    const houseXMax = houseCenter[0] + houseSize / 2;
    const houseZMin = houseCenter[2] - houseSize / 2;
    const houseZMax = houseCenter[2] + houseSize / 2;

    return !(x >= houseXMin && x <= houseXMax && z >= houseZMin && z <= houseZMax);
  };

  // Handle grid cell click
  const handleClick = (x, z) => {
    if (!showVerticalAxisWindTurbines) return; // Prevent placement when slot is closed

    // Check if the cell is occupied by any renewable source
    if (occupiedCells.isCellOccupied(x, z)) {
      // Check if the cell is occupied by a vertical axis wind turbine
      const isVerticalAxisWindTurbine = verticalAxisWindTurbines.some(tile => tile.x === x && tile.z === z);
      if (isVerticalAxisWindTurbine) {
        // Remove the vertical axis wind turbine
        setVerticalAxisWindTurbines((prevTiles) => {
          console.log("Removing vertical axis wind turbine at:", x, z); // Debug log
          occupiedCells.releaseCell(x, z);
          return prevTiles.filter(tile => tile.x !== x || tile.z !== z);
        });
      } else {
        console.log("Cell is occupied by another renewable source, cannot place here."); // Debug log
      }
      return; // Exit the function to prevent placement
    }

    // If the cell is not occupied, place the vertical axis wind turbine
    console.log("Placing vertical axis wind turbine at:", x, z); // Debug log
    occupiedCells.occupyCell(x, z);
    setVerticalAxisWindTurbines((prevTiles) => [...prevTiles, { x, z }]);

    // Trigger parent logic if provided
    onSelect?.(x, z);
  };

  return (
    <>
      {/* Clickable Grid (Only active when showVerticalAxisWindTurbines is true) */}
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
                <meshStandardMaterial
                  color={isPlaced ? "green" : "violet"}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            );
          })
        )}

      {/* Render Animated VerticalAxisWindTurbines */}
      {verticalAxisWindTurbines.map(({ x, z }, index) => {
        const turbine = scene.clone();
        const mixer = new THREE.AnimationMixer(turbine);

        // Reapply animations to the cloned scene
        animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat);
          action.play();
        });

        // Store the mixer in the ref
        mixers.current[index] = mixer;

        return (
          <primitive
            key={`${x}-${z}-${index}`}
            object={turbine}
            position={[x, 8, z]}
            scale={[0.6, 0.7, 0.7]}
          />
        );
      })}
    </>
  );
};

export const PicoHydroPowerTiles = ({ onSelect, showPicoHydroPower, occupiedCells }) => {
  const gltf = useGLTF("../assets/models/picoHydroPower.glb");
  const { picoHydroPower, setPicoHydroPower } = useContext(HomeContext);

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -1, 0];

  // House boundaries excluding base and center area
  const walls = [
    { position: [4, 2, 0], size: [4, 8, 6] },       // Right Wall
    { position: [-4, 2, 0], size: [4, 8, 6] },      // Left Wall
    { position: [0, 1.75, 0], size: [6, 7.5, 6] }   // Center Area (Base of House)
  ];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid (not inside any wall or center area)
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
    if (!showPicoHydroPower) return; // Prevent placement when slot is closed

    // Check if the cell is occupied by any renewable source
    if (occupiedCells.isCellOccupied(x, z)) {
      // Check if the cell is occupied by a pico hydro power system
      const isPicoHydroPower = picoHydroPower.some(tile => tile.x === x && tile.z === z);
      if (isPicoHydroPower) {
        // Remove the pico hydro power system
        setPicoHydroPower((prevTiles) => {
          console.log("Removing pico hydro power system at:", x, z); // Debug log
          occupiedCells.releaseCell(x, z);
          return prevTiles.filter(tile => tile.x !== x || tile.z !== z);
        });
      } else {
        console.log("Cell is occupied by another renewable source, cannot place here."); // Debug log
      }
      return; // Exit the function to prevent placement
    }

    // If the cell is not occupied, place the pico hydro power system
    console.log("Placing pico hydro power system at:", x, z); // Debug log
    occupiedCells.occupyCell(x, z);
    setPicoHydroPower((prevTiles) => [...prevTiles, { x, z }]);

    // Trigger parent logic if provided
    onSelect?.(x, z);
  };

  return (
    <>
      {/* Clickable Grid (Only active when showPicoHydroPower is true) */}
      {showPicoHydroPower &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - gridSize / 2) * cellSize + cellSize / 2;
            const z = (row - gridSize / 2) * cellSize + cellSize / 2;

            if (!isValidPosition(x, z)) return null;

            const isPlaced = picoHydroPower.some(tile => tile.x === x && tile.z === z);

            return (
              <mesh
                key={`${x}-${z}`}
                position={[x, platformCenter[1] + 0.01, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={() => handleClick(x, z)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial
                  color={isPlaced ? "green" : "black"}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            );
          })
        )}

      {/* Always Render Placed Pico Hydro Power Systems */}
      {picoHydroPower.map(({ x, z }, index) => (
        <primitive
          key={`${x}-${z}-${index}`}
          object={gltf.scene.clone()}
          position={[x, -1, z]} // Adjusted Y-position
          scale={[0.1, 0.1, 0.1]} // Increased scale
          rotation={[Math.PI / -2, 0, 0]} // Rotates 90 degrees to the left
        />
      ))}
    </>
  );
};

const WindowMobile = ({ position }) => {
  const WindowCottage = useTexture("../assets/images/mobilewindow.jpg"); // ✅ Fixed syntax

  return (
    <mesh position={position}>
      <boxGeometry args={[0.85, 1.5, 0.1]} /> {/* Window size remains the same */}
      <meshStandardMaterial map={WindowCottage} /> {/* ✅ Apply texture */}
    </mesh>
  );
};

const MobileRoofGrid = ({ onSelect }) => {
  const { solarPanels, setSolarPanels, showSolarPanels } = useContext(HomeContext);
  const gridSizeX = 5;
  const gridSizeY = 3;
  const cellSize = 2;

  const handleClick = (row, col) => {
    if (!showSolarPanels) return; // Only allow clicks when grid is visible
    
    const cellKey = `${row}-${col}`;
    if (solarPanels.some(([r, c]) => r === row && c === col)) {
      setSolarPanels(solarPanels.filter(([r, c]) => r !== row || c !== col));
    } else {
      setSolarPanels([...solarPanels, [row, col]]);
    }
  };
  
  return (
    <group position={[0, 4.51, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Only show grid when showSolarPanels is true */}
      {showSolarPanels && Array.from({ length: gridSizeY }).map((_, row) =>
        Array.from({ length: gridSizeX }).map((_, col) => {
          const x = (col - (gridSizeX - 1) / 2) * cellSize;
          const y = (row - (gridSizeY - 1) / 2) * cellSize;
          const isSelected = solarPanels.some(([r, c]) => r === row && c === col);

          return (
            <mesh
              key={`${row}-${col}`}
              position={[x, y, 0]}
              onClick={() => handleClick(row, col)}
            >
              <planeGeometry args={[cellSize, cellSize]} />
              <meshStandardMaterial
                color={isSelected ? "yellow" : "green"}
                transparent={true}
                opacity={isSelected ? 0 : 0.5}
              />
            </mesh>
          );
        })
      )}

      {/* Always render placed solar panels */}
      {solarPanels.map(([row, col], index) => {
        const x = (col - (gridSizeX - 1) / 2) * cellSize;
        const y = (row - (gridSizeY - 1) / 2) * cellSize;
        return <SolarPanel key={index} position={[x, y, 0.1]} />;
      })}
    </group>
  );
};

const MobileHome = ({ roofType, showSolarPanels, showSolarRoofTiles, showSolarWaterHeating, showSmallWindTurbines, showVerticalAxisWindTurbines, showMicroHydroPowerSystem, showPicoHydroPower }) => {
  const wallTexture = useTexture("../assets/images/mobilewall.jpg");
  const doorTexture = useTexture("../assets/images/mobiledoor.jpg");
  const wheelTexture = useTexture("../assets/images/wheel.jpg");
  /*   const [solarWaterHeating, setSolarWaterHeating] = useState([]);
    const [smallWindTurbines, setSmallWindTurbines] = useState([]);
    const [verticalAxisWindTurbines, setVerticalAxisWindTurbines] = useState([]);
    const [microHydroPowerSystem, setMicroHydroPowerSystem] = useState([]);
    const [picoHydroPower, setPicoHydroPower] = useState([]); */

  const {
    solarPanels, // Add this
    setSolarPanels, // Add this
    solarWaterHeating,
    smallWindTurbines,
    verticalAxisWindTurbines,
    microHydroPowerSystem,
    picoHydroPower
  } = useContext(HomeContext);

  // Shared state for occupied cells
  const occupiedCells = useOccupiedCells();

  // Check if any solar panels are added
  const hasSolarPanels = solarPanels.length > 0;
  const hasSolarWaterHeating = solarWaterHeating.length > 0;
  const hasSmallWindTurbines = smallWindTurbines.length > 0;
  const hasVerticalAxisWindTurbines = verticalAxisWindTurbines.length > 0;
  const hasMicroHydroPowerSystem = microHydroPowerSystem.length > 0;

  return (
    <group position={[0, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[10, 4, 5]} />
        <meshStandardMaterial map={wallTexture} />
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

      {/* Lamp on the Wall */}
      <mesh position={[-4.5, 2.9, 2.40]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={hasSolarPanels || hasSolarWaterHeating || hasSmallWindTurbines || hasVerticalAxisWindTurbines ? "yellow" : "black"} />
      </mesh>

      <mesh position={[4.5, 2.9, 2.40]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={hasSolarPanels || hasSolarWaterHeating || hasSmallWindTurbines || hasVerticalAxisWindTurbines ? "yellow" : "black"} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 1.5, 2.6]}>
        <boxGeometry args={[3, 2.5, 0.1]} />
        <meshStandardMaterial map={doorTexture} />
      </mesh>

      {/* Windows */}
      <WindowMobile position={[-3, 2, 2.6]} />
      <WindowMobile position={[3, 2, 2.6]} />

      {/* Roof */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[10.15, 1, 5.95]} />
        <meshStandardMaterial map={useTexture("../assets/images/mobileroof.jpg")} />
      </mesh>

      {/* Solar Grid - Only show when `showSolarPanels` is true */}
      <MobileRoofGrid onSelect={(row, col) => {
  // Any additional selection logic can go here
}} />

      {/* Wheels */}
      <mesh position={[-4, 0, 2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.5, 32]} />
        <meshStandardMaterial map={wheelTexture} />
      </mesh>
      <mesh position={[4, 0, 2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.5, 32]} />
        <meshStandardMaterial map={wheelTexture} />
      </mesh>
      <mesh position={[-4, 0, -2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.5, 32]} />
        <meshStandardMaterial map={wheelTexture} />
      </mesh>
      <mesh position={[4, 0, -2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.5, 32]} />
        <meshStandardMaterial map={wheelTexture} />
      </mesh>

      {/* Renewable Source Components */}
      <SolarWaterHeatingTiles
        /*         solarWaterHeating={solarWaterHeating}
                setSolarWaterHeating={setSolarWaterHeating} */
        showSolarWaterHeating={showSolarWaterHeating}
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
      <PicoHydroPowerTiles
        showPicoHydroPower={showPicoHydroPower}
        occupiedCells={occupiedCells} // Pass occupiedCells here
      />

      {/* For Analysis */}
      <Html>
        <TechnoEconomicAnalysis
          solarPanels={solarPanels}
          solarWaterHeating={solarWaterHeating}
          smallWindTurbines={smallWindTurbines}
          verticalAxisWindTurbines={verticalAxisWindTurbines}
          microHydroPowerSystem={microHydroPowerSystem}
          picoHydroPower={picoHydroPower}
        />
      </Html>
    </group>
  );
};

export default MobileHome;