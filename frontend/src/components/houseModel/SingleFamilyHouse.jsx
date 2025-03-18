import { useTexture, useAnimations } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import SolarPanel from "../renewableModel/SolarPanel.jsx";
import SolarRoofTiles from "../renewableModel/SolarRoofTiles.jsx";
import React, { useState, useRef, useEffect, useContext } from "react";
import { HomeContext } from "../HomeContext.jsx";
import TechnoEconomicAnalysis from "../TechnoEconomicAnalysis.jsx";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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
  const gltf = useGLTF("../assets/models/solarwaterheater.glb");
  const { solarWaterHeating, setSolarWaterHeating } = useContext(HomeContext);

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -1, 0];

  // House boundaries
  const houseSize = 6;
  const houseCenter = [0, 2, 0];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid
  const isValidPosition = (x, z) => {
    const houseXMin = houseCenter[0] - houseSize / 2;
    const houseXMax = houseCenter[0] + houseSize / 2;
    const houseZMin = houseCenter[2] - houseSize / 2;
    const houseZMax = houseCenter[2] + houseSize / 2;

    return !(x >= houseXMin && x <= houseXMax && z >= houseZMin && z <= houseZMax);
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
          position={[x, -0.5, z]} // Adjusted Y-position
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
    if (actions && actions["Peddles.009Action"]) {
      actions["Peddles.009Action"].setLoop(THREE.LoopRepeat);
      actions["Peddles.009Action"].play();
    }
  }, [actions]);

  // Update all mixers on every frame
  useFrame((_, delta) => {
    mixers.current.forEach((mixer) => mixer.update(delta));
  });

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -1, 0];

  // House boundaries
  const houseSize = 6;
  const houseCenter = [0, 2, 0];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid
  const isValidPosition = (x, z) => {
    const houseXMin = houseCenter[0] - houseSize / 2;
    const houseXMax = houseCenter[0] + houseSize / 2;
    const houseZMin = houseCenter[2] - houseSize / 2;
    const houseZMax = houseCenter[2] + houseSize / 2;

    return !(x >= houseXMin && x <= houseXMax && z >= houseZMin && z <= houseZMax);
  };

  // Handle grid cell click
  const handleClick = (x, z) => {
    if (!showMicroHydroPowerSystem) return; // Prevent placement when slot is closed

    // Check if the cell is occupied by any renewable source
    if (occupiedCells.isCellOccupied(x, z)) {
      // Check if the cell is occupied by a micro-hydro power system
      const isMicroHydroPowerSystem = microHydroPowerSystem.some(tile => tile.x === x && tile.z === z);
      if (isMicroHydroPowerSystem) {
        // Remove the micro-hydro power system
        setMicroHydroPowerSystem((prevTiles) => {
          occupiedCells.releaseCell(x, z);
          return prevTiles.filter(tile => tile.x !== x || tile.z !== z);
        });
      }
      return;
    }

    // If the cell is not occupied, place the micro-hydro power system
    occupiedCells.occupyCell(x, z);
    setMicroHydroPowerSystem((prevTiles) => [...prevTiles, { x, z }]);

    // Trigger parent logic if provided
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
            position={[x, -1, z]}
            scale={[0.7, 0.7, 0.7]}
            rotation={[0, Math.PI / 2, 0]}
          />
        );
      })}
    </>
  );
};

export const HeatPumpTiles = ({ onSelect, showHeatPump }) => {
  const gltf = useGLTF("../assets/models/heatPump.glb");
  const { heatPump, setHeatPump } = useContext(HomeContext);

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -1, 0];

  // House boundaries (Now the recommended area)
  const houseSize = 6;
  const houseCenter = [0, 2, 0];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid (Reversed logic)
  const isValidPosition = (x, z) => {
    const houseXMin = houseCenter[0] - houseSize / 2;
    const houseXMax = houseCenter[0] + houseSize / 2;
    const houseZMin = houseCenter[2] - houseSize / 2;
    const houseZMax = houseCenter[2] + houseSize / 2;

    // Now it only allows positions inside the house boundaries
    return x >= houseXMin && x <= houseXMax && z >= houseZMin && z <= houseZMax;
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

            if (!isValidPosition(x, z)) return null; // Now, it only allows placements inside the house boundaries

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

      {/* Always Render Placed Solar Water Heaters */}
      {heatPump.map(({ x, z }, index) => (
        <primitive
          key={`${x}-${z}-${index}`}
          object={gltf.scene.clone()}
          position={[x, -4.50, z]}
          scale={[3, 3, 3]}
        />
      ))}
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
  const platformCenter = [0, -1, 0];

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

    // Check if cell is occupied by another renewable source
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
            position={[x, -1, z]}
            scale={[55, 55, 55]}
            rotation={[0, -Math.PI / 2, 0]}
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
  const platformCenter = [0, -1, 0];
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
        setVerticalAxisWindTurbines((prevTiles) => {
          occupiedCells.releaseCell(x, z);
          return prevTiles.filter(tile => tile.x !== x || tile.z !== z);
        });
      }
      return;
    }

    occupiedCells.occupyCell(x, z);
    setVerticalAxisWindTurbines((prevTiles) => [...prevTiles, { x, z }]);
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
            position={[x, 8, z]}
            scale={[0.6, 0.7, 0.7]}
          />
        );
      })}
    </>
  );
};

// Flat Roof Grid with Solar Panels Toggle
const FlatRoofGrid = ({ solarPanels, setSolarPanels, showSolarPanels }) => {
  const gridSize = 3; // 3x3 grid
  const cellSize = 2; // Each cell is 2x2 in size

  const handleClick = (row, col) => {
    const cellKey = `${row}-${col}`;
    if (solarPanels.some(([r, c]) => r === row && c === col)) {
      setSolarPanels(solarPanels.filter(([r, c]) => r !== row || c !== col));
    } else {
      setSolarPanels([...solarPanels, [row, col]]);
    }
    console.log("Updated Solar Panels:", solarPanels); // Debugging
  };

  return (
    <group position={[0, 6.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {showSolarPanels && Array.from({ length: gridSize }).map((_, row) =>
        Array.from({ length: gridSize }).map((_, col) => {
          const x = (col - 1) * cellSize;
          const y = (row - 1) * cellSize;
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

      {/* Render Solar Panels */}
      {solarPanels.map(([row, col], index) => {
        const x = (col - 1) * cellSize;
        const y = (row - 1) * cellSize;
        return <SolarPanel key={index} position={[x, y, 0]} />;
      })}
    </group>
  );
};

const FlatRoofGridTiles = ({ onSelect, solarRoofTiles, setSolarRoofTiles, showSolarRoofTiles }) => {
  const gridSize = 3; // 3x3 grid
  const cellSize = 2; // Each cell is 2x2 in size

  const handleClick = (row, col) => {
    const cellKey = `${row}-${col}`;
    if (solarRoofTiles.some(([r, c]) => r === row && c === col)) {
      setSolarRoofTiles(solarRoofTiles.filter(([r, c]) => r !== row || c !== col));
    } else {
      setSolarRoofTiles([...solarRoofTiles, [row, col]]);
    }
  };

  return (
    <group position={[0, 6.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {showSolarRoofTiles && Array.from({ length: gridSize }).map((_, row) =>
        Array.from({ length: gridSize }).map((_, col) => {
          const x = (col - 1) * cellSize; // Centering the grid
          const y = (row - 1) * cellSize;
          const isSelected = solarRoofTiles.some(([r, c]) => r === row && c === col);

          return (
            <mesh
              key={`${row}-${col}`}
              position={[x, y, 0]} // Positions grid cells flat on the roof
              onClick={() => handleClick(row, col)}
            >
              <planeGeometry args={[cellSize, cellSize]} />
              <meshStandardMaterial
                color={isSelected ? "yellow" : "green"}
                transparent={true}
                opacity={isSelected ? 0 : 0.5} // Make grid transparent if panel placed
              />
            </mesh>
          );
        })
      )}

      {solarRoofTiles.map(([row, col], index) => {
        const x = (col - 1) * cellSize;
        const y = (row - 1) * cellSize;
        return <SolarRoofTiles key={index} position={[x, y, 0]} />;
      })}
    </group>
  );
};

export const GableRoofGrid = ({ solarPanels = [], setSolarPanels, showSolarPanels }) => {
  const cellSize = 2;
  const positions = [
    [0, 7, 1.9],   // Front panel
    [0, 7, -1.9],  // Back panel
    [-1.8, 7, 0],  // Left panel
    [1.8, 7, 0]    // Right panel
  ];

  const rotations = [
    [-Math.PI / 4, 0, 0],    // Front (flat against roof face)
    [Math.PI / 4, Math.PI, 0], // Back (flat against roof face)
    [Math.PI / 2, -2.3, 0], // Left (flat against side of the roof)
    [Math.PI / 2, 2.3, 0]  // Right (flat against side of the roof)
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

export const GableRoofGridTiles = ({ solarRoofTiles = [], setSolarRoofTiles, showSolarRoofTiles }) => {
  const cellSize = 2;
  const positions = [
    [0, 7, 1.9],   // Front panel
    [0, 7, -1.9],  // Back panel
    [-1.8, 7, 0],  // Left panel
    [1.8, 7, 0]    // Right panel
  ];

  const rotations = [
    [-Math.PI / 4, 0, 0],    // Front (flat against roof face)
    [Math.PI / 4, Math.PI, 0], // Back (flat against roof face)
    [Math.PI / 2, -2.3, 0], // Left (flat against side of the roof)
    [Math.PI / 2, 2.3, 0]  // Right (flat against side of the roof)
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
      {/* Render Solar RoofTiles */}
      {solarRoofTiles.map((index) => (
        <SolarRoofTiles key={index} position={positions[index]} rotation={rotations[index]} />
      ))}
    </group>
  );
};


const ShedRoofGrid = ({ solarPanels, setSolarPanels, showSolarPanels }) => {
  const gridSize = 3; // 3x3 grid
  const cellSize = 2; // Each cell is 2x2
  const roofAngle = Math.PI / 2.221; // Adjust based on your roof's slope
  const roofHeight = 6.5; // Raised slightly to fit exactly on the roof

  const handleClick = (row, col) => {
    const cellKey = `${row}-${col}`;
    if (solarPanels.some(([r, c]) => r === row && c === col)) {
      setSolarPanels(solarPanels.filter(([r, c]) => r !== row || c !== col));
    } else {
      setSolarPanels([...solarPanels, [row, col]]);
    }
  };

  return (
    <group position={[0, roofHeight, 0]} rotation={[-roofAngle, 0, 0]}>
      {/* Clickable Grid for Solar Panels */}
      {showSolarPanels &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - 1) * cellSize;
            const y = (row - 1) * cellSize;
            const isSelected = solarPanels.some(([r, c]) => r === row && c === col);

            return (
              <mesh
                key={`${row}-${col}`}
                position={[x, y, 0.01]}
                onClick={() => handleClick(row, col)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial color={isSelected ? 'yellow' : 'green'} transparent opacity={isSelected ? 0 : 0.5} />
              </mesh>
            );
          })
        )}

      {/* Render Solar Panels */}
      {solarPanels.map(([row, col], index) => {
        const x = (col - 1) * cellSize;
        const y = (row - 1) * cellSize;
        return <SolarPanel key={index} position={[x, y, 0.1]} />;
      })}
    </group>
  );
};

const ShedRoofGridTiles = ({ solarRoofTiles, setSolarRoofTiles, showSolarRoofTiles }) => {
  const gridSize = 3; // 3x3 grid
  const cellSize = 2; // Each cell is 2x2
  const roofAngle = Math.PI / 2.221; // Adjust based on your roof's slope
  const roofHeight = 6.5; // Raised slightly to fit exactly on the roof

  const handleClick = (row, col) => {
    const cellKey = `${row}-${col}`;
    if (solarRoofTiles.some(([r, c]) => r === row && c === col)) {
      setSolarRoofTiles(solarRoofTiles.filter(([r, c]) => r !== row || c !== col));
    } else {
      setSolarRoofTiles([...solarRoofTiles, [row, col]]);
    }
  };

  return (
    <group position={[0, roofHeight, 0]} rotation={[-roofAngle, 0, 0]}>
      {/* Clickable Grid for Solar Panels */}
      {showSolarRoofTiles &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - 1) * cellSize;
            const y = (row - 1) * cellSize;
            const isSelected = solarRoofTiles.some(([r, c]) => r === row && c === col);

            return (
              <mesh
                key={`${row}-${col}`}
                position={[x, y, 0.01]}
                onClick={() => handleClick(row, col)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial color={isSelected ? 'yellow' : 'green'} transparent opacity={isSelected ? 0 : 0.5} />
              </mesh>
            );
          })
        )}

      {/* Render Solar Roof Tiles */}
      {solarRoofTiles.map(([row, col], index) => {
        const x = (col - 1) * cellSize;
        const y = (row - 1) * cellSize;
        return <SolarRoofTiles key={index} position={[x, y, 0.1]} />;
      })}
    </group>
  );
};

const ButterflyRoofGrid = ({ solarPanels, setSolarPanels, showSolarPanels }) => {
  const cellSize = 2; // Each cell is 2x2 in size
  const positions = [
    [0, 0.63, 1],   // Upper center
    [0, 0.63, -1],  // Lower center
    [-2, 0.63, 1],  // Upper left
    [2, 0.63, 1],   // Upper right
    [-2, 0.63, -1], // Lower left
    [2, 0.63, -1],  // Lower right
    [0, 1.5, -2.8],  // Lower center
    [-2, 1.5, -2.8],  // Lower center
    [2, 1.5, -2.8],  // Lower center
  ];

  const rotations = [
    [Math.PI / 3, 3.1, 0],   // Upper center
    [-Math.PI / 2.75, 0, 0], // Lower center
    [Math.PI / 3, 3.1, 0],   // Upper left
    [Math.PI / 3, 3.1, 0],   // Upper right
    [-Math.PI / 2.75, 0, 0], // Lower left
    [-Math.PI / 2.75, 0, 0], // Lower right
    [-Math.PI / 2.75, 0, 0], // Lower center
    [-Math.PI / 2.75, 0, 0], // Lower center
    [-Math.PI / 2.75, 0, 0], // Lower center
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

const ButterflyRoofGridTiles = ({ solarRoofTiles, setSolarRoofTiles, showSolarRoofTiles }) => {
  const cellSize = 2; // Each cell is 2x2 in size
  const positions = [
    [0, 0.63, 1],   // Upper center
    [0, 0.63, -1],  // Lower center
    [-2, 0.63, 1],  // Upper left
    [2, 0.63, 1],   // Upper right
    [-2, 0.63, -1], // Lower left
    [2, 0.63, -1],  // Lower right
    [0, 1.5, -2.8],  // Lower center
    [-2, 1.5, -2.8],  // Lower center
    [2, 1.5, -2.8],  // Lower center
  ];

  const rotations = [
    [Math.PI / 3, 3.1, 0],   // Upper center
    [-Math.PI / 2.75, 0, 0], // Lower center
    [Math.PI / 3, 3.1, 0],   // Upper left
    [Math.PI / 3, 3.1, 0],   // Upper right
    [-Math.PI / 2.75, 0, 0], // Lower left
    [-Math.PI / 2.75, 0, 0], // Lower right
    [-Math.PI / 2.75, 0, 0], // Lower center
    [-Math.PI / 2.75, 0, 0], // Lower center
    [-Math.PI / 2.75, 0, 0], // Lower center
  ];

  const handleClick = (index) => {
    if (solarRoofTiles.includes(index)) {
      setSolarRoofTiles(solarRoofTiles.filter(i => i !== index));
    } else {
      setSolarRoofTiles([...solarRoofTiles, index]);
    }
    console.log("Updated Solar RoofTiles:", solarPanels);
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
      {/* Render Solar RoofTiles */}
      {solarRoofTiles.map((index) => (
        <SolarRoofTiles key={index} position={positions[index]} rotation={rotations[index]} />
      ))}
    </group>
  );
};

// Roofs Component
export const Roofs = {
  Gable: ({ texturePath, showSolarPanels, showSolarRoofTiles, solarPanels, setSolarPanels, solarRoofTiles, setSolarRoofTiles }) => {
    const roofTexture = useTexture(texturePath);
    return (
      <group>
        <mesh position={[0, 7, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[5, 4, 4]} />
          <meshStandardMaterial map={roofTexture} />
        </mesh>
        <GableRoofGrid
          solarPanels={solarPanels}
          setSolarPanels={setSolarPanels}
          showSolarPanels={showSolarPanels}
        />
        <GableRoofGridTiles
          solarRoofTiles={solarRoofTiles}
          setSolarRoofTiles={setSolarRoofTiles}
          showSolarRoofTiles={showSolarRoofTiles}
        />
      </group>
    );
  },
  Flat: ({ showSolarPanels, showSolarRoofTiles, solarPanels, setSolarPanels, solarRoofTiles, setSolarRoofTiles }) => {
    const roofTexture = useTexture("../assets/images/roof.jpg");

    return (
      <group>
        {/* Roof Base */}
        <mesh position={[0, 5.5, 0]}>
          <boxGeometry args={[6, 1, 6]} />
          <meshStandardMaterial map={roofTexture} />
        </mesh>

        {/* Recommended Area Grid & Solar Panels */}
        <FlatRoofGridTiles
          solarRoofTiles={solarRoofTiles}
          setSolarRoofTiles={setSolarRoofTiles}
          showSolarRoofTiles={showSolarRoofTiles}
        />
        <FlatRoofGrid
          solarPanels={solarPanels}
          setSolarPanels={setSolarPanels}
          showSolarPanels={showSolarPanels}
        />
      </group>
    );
  },

  Shed: ({ showSolarPanels, showSolarRoofTiles, solarPanels, setSolarPanels, solarRoofTiles, setSolarRoofTiles }) => {
    const roofTexture = useTexture("../assets/images/roof.jpg");

    return (
      <group>
        {/* Roof Base with Slight Rotation */}
        <mesh position={[0, 6, 0]} rotation={[Math.PI / 20, 0, 0]}>
          <boxGeometry args={[6, 1, 6]} />
          <meshStandardMaterial map={roofTexture} />
        </mesh>

        {/* Recommended Area Grid & Solar Panels */}
        <ShedRoofGrid
          solarPanels={solarPanels}
          setSolarPanels={setSolarPanels}
          showSolarPanels={showSolarPanels}
        />
        <ShedRoofGridTiles
          solarRoofTiles={solarRoofTiles}
          setSolarRoofTiles={setSolarRoofTiles}
          showSolarRoofTiles={showSolarRoofTiles}
        />
      </group>
    );
  },

  Butterfly: ({ showSolarPanels, showSolarRoofTiles, solarPanels, setSolarPanels, solarRoofTiles, setSolarRoofTiles }) => {
    const roofTexture = useTexture("../assets/images/roof.jpg");
    return (
      <group position={[-0.75, 5.3, 0]} rotation={[0, 4.75, 0]}>
        <mesh position={[0, 0, 1]} rotation={[Math.PI / 3, 0, 0]}>
          <boxGeometry args={[5.85, 3.25]} />
          <meshStandardMaterial map={roofTexture} />
        </mesh>
        <mesh position={[0, 0, -1]} rotation={[-Math.PI / 2.75, 0, 0]}>
          <boxGeometry args={[5.85, 6.25]} />
          <meshStandardMaterial map={roofTexture} />
        </mesh>
        <ButterflyRoofGrid solarPanels={solarPanels} setSolarPanels={setSolarPanels} showSolarPanels={showSolarPanels} />
        <ButterflyRoofGridTiles solarRoofTiles={solarRoofTiles} setSolarRoofTiles={setSolarRoofTiles} showSolarRoofTiles={showSolarRoofTiles} />
      </group>
    );
  },
};

// Window Component
export const Window = ({ position }) => {
  const windowTexture = useTexture("../assets/images/window.webp");
  return (
    <mesh position={position}>
      <boxGeometry args={[0.85, 1.5, 0.1]} />
      <meshStandardMaterial map={windowTexture} />
    </mesh>
  );
};

const SingleFamilyHouse = ({ roofType, showSolarPanels, showSolarRoofTiles, showSolarWaterHeating, showHeatPump, showSmallWindTurbines, showVerticalAxisWindTurbines, showMicroHydroPowerSystem }) => {
  const wallTexture = useTexture("../assets/images/wall.png");
  const doorTexture = useTexture("../assets/images/door.jpg");

  // Move the state here
  const [solarPanels, setSolarPanels] = useState([]);
  const [solarRoofTiles, setSolarRoofTiles] = useState([]);
/*   const [solarWaterHeating, setSolarWaterHeating] = useState([]);
  const [heatPump, setHeatPump] = useState([]);
  const [smallWindTurbines, setSmallWindTurbines] = useState([]);
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
      {/* Walls */}
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
      <Window position={[-2.5, 3, 3.01]} />
      <Window position={[2.5, 3, 3.01]} />

      {/* Roof */}
      {roofType &&
        React.createElement(Roofs[roofType], {
          texturePath: "../assets/images/roof.jpg",
          showSolarPanels,
          showSolarRoofTiles,
          solarPanels, // ✅ Pass state from parent
          setSolarPanels,
          solarRoofTiles, // ✅ Pass state from parent
          setSolarRoofTiles,
        })}

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
          occupiedCells={occupiedCells} // Pass occupiedCells here
        />
      </Html>
    </group>
  );
};


export default SingleFamilyHouse;