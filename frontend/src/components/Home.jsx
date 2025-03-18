import React, { useState, useMemo, useContext } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stats, useTexture, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import CottagesHouse from "./houseModel/Cottages.jsx";
import TownHouse from "./houseModel/Townhouse.jsx";
import MobileHome from "./houseModel/MobileHome.jsx";
import ApartmentsBuilding from "./buildingModel/Apartments.jsx";
import OfficeBuilding from "./buildingModel/OfficeBuilding.jsx";
import SingleFamilyHouse from "./houseModel/SingleFamilyHouse.jsx";
import { Roofs } from "./houseModel/SingleFamilyHouse.jsx";
import RenewableSlots from "./RenewableSlots.jsx";
import GameModal from "./GameModal.jsx";
import { HomeContext } from "./HomeContext.jsx";
import { MagnifyingGlass } from 'react-loader-spinner';
import { GLTFExporter } from 'three-stdlib';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Platform = () => {
  const texture = useTexture("../assets/images/grass.webp");
  const { scene } = useGLTF("../assets/models/Trees.glb");
  const trees = useMemo(() => Array.from({ length: 9 }, () => scene.clone()), [scene]);
  const treePositions = [
    [-8, -1, -8], [8, -1, -8], [6, -1, -6], [-6.5, -1, -6], [4, -1, -8],
    [2, -1, -7], [1, -1, -8], [-1.5, -1, -7], [-4, -1, -8]
  ];
  const treeScales = [2, 2.1, 2, 2.2, 2.3, 1.7, 2.2, 2.4, 1.8];

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      {treePositions.map((position, index) => (
        <primitive key={index} object={trees[index]} position={position} scale={treeScales[index]} />
      ))}
    </>
  );
};

const HouseModels = {
  "Single-Family": SingleFamilyHouse,
  "Cottages": CottagesHouse,
  "TownHouse": TownHouse,
  "Mobile Home": MobileHome,
};

const HouseImages = {
  "Single-Family": "assets/images/SingleFamilyHouse.png",
  "Cottages": "assets/images/Cottages.png",
  "TownHouse": "assets/images/TownHouse.png",
  "Mobile Home": "assets/images/MobileHome.png",
};

const BuildingModels = {
  "Apartments": ApartmentsBuilding,
  "Office Building": OfficeBuilding,
};

const BuildingImages = {
  "Apartments": "assets/images/Apartment.png",
  "Office Building": "assets/images/OfficeBuilding.png",
};



const impossibleSources = {
  "Single-Family with Gable": ["Pico Hydropower", "Vertical Farming"],
  "Single-Family with Flat": ["Pico Hydropower", "Vertical Farming"],
  "Single-Family with Shed": ["Pico Hydropower", "Vertical Farming"],
  "Single-Family with Butterfly": ["Pico Hydropower", "Vertical Farming"],
  "Cottages": ["Pico Hydropower", "Vertical Farming"],
  "TownHouse": ["Pico Hydropower", "Vertical Farming"],
  "Mobile Home": ["Solar Roof Tiles", "Vertical Farming", "Heat Pump"],
  "Apartments": ["Pico Hydropower", "Solar Roof Tiles"],
  "Office Building": ["Pico Hydropower", "Solar Roof Tiles"],
};

// Add this button component inside your Home.jsx, before the Canvas component
const ExportButton = () => {
  const { scene } = useThree();

  const handleExport = () => {
    const exporter = new GLTFExporter();
    const options = {
      binary: true,
      animations: [],
      includeCustomExtensions: true,
      embedImages: true
    };

    exporter.parse(
      scene,
      (buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'greensphere-scene.glb';
        link.click();
        URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('An error occurred while exporting:', error);
      },
      options
    );
  };

  return (
    <Html>
      <button
        onClick={handleExport}
        style={{
          position: 'fixed',
          top: "-250px",
          left: "645px",
          padding: '8px 16px',
          backgroundColor: '#2c3e50',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '110px',
          justifyContent: 'center'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#34495e'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#2c3e50'}
      >
        <span>📥</span>
        Export Scene
      </button>
    </Html>
  );
};


const ImportButton = () => {
  const { scene } = useThree();

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const loader = new GLTFLoader();
      const url = URL.createObjectURL(file);

      loader.load(
        url,
        (gltf) => {
          scene.children.forEach((child) => {
            if (child.userData.imported) {
              scene.remove(child);
            }
          });

          const model = gltf.scene;
          model.position.set(0, 0, 0);
          model.scale.set(1, 1, 1);
          model.userData.imported = true;
          scene.add(model);

          URL.revokeObjectURL(url);
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
        }
      );
    }
  };

  return (
    <Html>
      <label
        style={{
          position: 'fixed',
          top: "-190px",
          left: "645px",
          padding: '8px 16px',
          backgroundColor: '#2c3e50',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '77px',
          justifyContent: 'center'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#34495e'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#2c3e50'}
      >
        <span>📤</span>
        Import Model
        <input
          type="file"
          accept=".glb"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </label>
    </Html>
  );
};

const Home = () => {
  const {
    showHouseOptions,
    setShowHouseOptions,
    showBuildingOptions,
    setShowBuildingOptions,
    selectedHouse,
    setSelectedHouse,
    selectedBuilding,
    setSelectedBuilding,
    roofType,
    setRoofType,
    bgColor,
    setBgColor,
    isOuterSpace,
    setIsOuterSpace,
    isForest,
    setIsForest,
    isAncient,
    setIsAncient,
    isUnderwater,
    setIsUnderwater,
    isCyberpunk,
    setIsCyberpunk,
    isThemeMenuOpen,
    setIsThemeMenuOpen,
    showSolarPanels,
    setShowSolarPanels,
    showSolarRoofTiles,
    setShowSolarRoofTiles,
    showSolarWaterHeating,
    setShowSolarWaterHeating,
    showHeatPump,
    setShowHeatPump,
    showSmallWindTurbines,
    setShowSmallWindTurbines,
    showVerticalAxisWindTurbines,
    setShowVerticalAxisWindTurbines,
    showMicroHydroPowerSystem,
    setShowMicroHydroPowerSystem,
    showPicoHydroPower,
    setShowPicoHydroPower,
    showVerticalFarming,
    setShowVerticalFarming,
    isModalOpen,
    setIsModalOpen,
    modalContent,
    setModalContent,
    resetRenewableSources,
  } = useContext(HomeContext);

  const [isLoading, setIsLoading] = useState(false);

  const handleSolarPanelToggle = (state) => {
    setIsLoading(true);
    setShowSolarPanels(state);
    setIsModalOpen(true);
    setActiveRenewable(state ? "solarPanels" : null);

    const infrastructureName = selectedHouse || selectedBuilding;
    const roofInfo = selectedHouse === "Single-Family" ? ` with ${roofType} roof` : "";

    setModalContent({
      name: "Solar Panel",
      type: "Solar Energy",
      infrastructure: `${infrastructureName} ${roofInfo}`,
    });
    setTimeout(() => setIsLoading(false), 1000); // Simulate loading time
  };

  const handleSolarRoofTilesToggle = (state) => {
    setIsLoading(true);
    setShowSolarRoofTiles(state);
    setIsModalOpen(true);
    setActiveRenewable(state ? "solarRoofTiles" : null);

    const infrastructureName = selectedHouse || selectedBuilding;
    const roofInfo = selectedHouse === "Single-Family" ? `with ${roofType}` : "";
    const fullInfrastructure = roofInfo ? `${infrastructureName} ${roofInfo}` : infrastructureName;

    const isImpossible = impossibleSources[fullInfrastructure]?.includes("Solar Roof Tiles") || false;

    setModalContent({
      name: "Solar Roof Tiles",
      type: "Solar Energy",
      infrastructure: fullInfrastructure,
      isImpossible,
    });
    setTimeout(() => setIsLoading(false), 1000); // Simulate loading time
  };

  const handleSolarWaterHeatingToggle = (state) => {
    setIsLoading(true);
    setShowSolarWaterHeating(state);
    setIsModalOpen(true);
    setActiveRenewable(state ? "solarWaterHeating" : null);

    const infrastructureName = selectedHouse || selectedBuilding;
    const roofInfo = selectedHouse === "Single-Family" ? ` with ${roofType} roof` : "";

    setModalContent({
      name: "Solar Water Heating",
      type: "Solar Energy",
      infrastructure: `${infrastructureName} ${roofInfo}`,
    });
    setTimeout(() => setIsLoading(false), 1000); // Simulate loading time
  };

  const handleHeatPumpToggle = (state) => {
    setIsLoading(true);
    setShowHeatPump(state);
    setIsModalOpen(true);
    setActiveRenewable(state ? "heatPump" : null);

    const infrastructureName = selectedHouse || selectedBuilding;
    const roofInfo = selectedHouse === "Single-Family" ? `with ${roofType}` : "";
    const fullInfrastructure = roofInfo ? `${infrastructureName} ${roofInfo}` : infrastructureName;

    const isImpossible = impossibleSources[fullInfrastructure]?.includes("Heat Pump") || false;

    setModalContent({
      name: "Heat Pump",
      type: "Geothermal Energy",
      infrastructure: fullInfrastructure,
      isImpossible,
    });
    setTimeout(() => setIsLoading(false), 1000); // Simulate loading time
  };

  const handleSmallWindTurbinesToggle = (state) => {
    setIsLoading(true);
    setShowSmallWindTurbines(state);
    setIsModalOpen(true);
    setActiveRenewable(state ? "smallWindTurbines" : null);

    const infrastructureName = selectedHouse || selectedBuilding;
    const roofInfo = selectedHouse === "Single-Family" ? ` with ${roofType} roof` : "";

    setModalContent({
      name: "Small Wind Turbines",
      type: "Wind Energy",
      infrastructure: `${infrastructureName} ${roofInfo}`,
    });
    setTimeout(() => setIsLoading(false), 1000); // Simulate loading time
  };

  const handleVerticalAxisWindTurbinesToggle = (state) => {
    setIsLoading(true);
    setShowVerticalAxisWindTurbines(state);
    setIsModalOpen(true);
    setActiveRenewable(state ? "verticalAxisWindTurbines" : null);

    const infrastructureName = selectedHouse || selectedBuilding;
    const roofInfo = selectedHouse === "Single-Family" ? ` with ${roofType} roof` : "";

    setModalContent({
      name: "Vertical Axis Wind Turbines",
      type: "Wind Energy",
      infrastructure: `${infrastructureName} ${roofInfo}`,
    });
    setTimeout(() => setIsLoading(false), 1000); // Simulate loading time
  };

  const handleMicroHydroPowerSystemToggle = (state) => {
    setIsLoading(true);
    setShowMicroHydroPowerSystem(state);
    setIsModalOpen(true);
    setActiveRenewable(state ? "microHydroPowerSystem" : null);

    const infrastructureName = selectedHouse || selectedBuilding;
    const roofInfo = selectedHouse === "Single-Family" ? ` with ${roofType} roof` : "";

    setModalContent({
      name: "Micro HydroPower System",
      type: "HydroPower Energy",
      infrastructure: `${infrastructureName} ${roofInfo}`,
    });
    setTimeout(() => setIsLoading(false), 1000); // Simulate loading time
  };

  const handlePicoHydroPowerToggle = (state) => {
    setIsLoading(true);
    setShowPicoHydroPower(state);
    setIsModalOpen(true);
    setActiveRenewable(state ? "picoHydroPower" : null);

    const infrastructureName = selectedHouse || selectedBuilding;
    const roofInfo = selectedHouse === "Single-Family" ? `with ${roofType}` : "";
    const fullInfrastructure = roofInfo ? `${infrastructureName} ${roofInfo}` : infrastructureName;

    const isImpossible = impossibleSources[fullInfrastructure]?.includes("Pico Hydropower") || false;

    setModalContent({
      name: "Pico Hydropower",
      type: "HydroPower Energy",
      infrastructure: fullInfrastructure,
      isImpossible,
    });
    setTimeout(() => setIsLoading(false), 1000); // Simulate loading time
  };

  const handleVerticalFarmingToggle = (state) => {
    setIsLoading(true);
    setShowVerticalFarming(state);
    setIsModalOpen(true);
    setActiveRenewable(state ? "verticalFarming" : null);

    const infrastructureName = selectedHouse || selectedBuilding;
    const roofInfo = selectedHouse === "Single-Family" ? `with ${roofType}` : "";
    const fullInfrastructure = roofInfo ? `${infrastructureName} ${roofInfo}` : infrastructureName;

    const isImpossible = impossibleSources[fullInfrastructure]?.includes("Vertical Farming") || false;

    setModalContent({
      name: "Vertical Farming",
      type: "Urban Farming",
      infrastructure: fullInfrastructure,
      isImpossible,
    });
    setTimeout(() => setIsLoading(false), 1000); // Simulate loading time
  };

  const toggleBackgroundColor = () => {
    if (isOuterSpace || isAncient || isUnderwater || isCyberpunk || isForest) {
      setIsOuterSpace(false); setIsAncient(false); setIsUnderwater(false); setIsCyberpunk(false); setIsForest(false);
    }
    setBgColor((prevColor) => prevColor === "linear-gradient(black, lightblue)" ? "linear-gradient(lightblue, yellow)" : "linear-gradient(black, lightblue)");
  };

  const changeTheme = (theme) => {
    setIsLoading(true);
    setIsOuterSpace(false); setIsAncient(false); setIsUnderwater(false); setIsCyberpunk(false); setIsForest(false);
    if (theme === "Outer Space") setIsOuterSpace(true);
    if (theme === "Ancient") setIsAncient(true);
    if (theme === "Underwater") setIsUnderwater(true);
    if (theme === "Cyberpunk") setIsCyberpunk(true);
    if (theme === "Forest") setIsForest(true);
    setTimeout(() => setIsLoading(false), 1000); // Simulate loading time
  };

  const [activeRenewable, setActiveRenewable] = useState(null);

  const RoofImages = {
    Gable: "assets/images/Gable.png",
    Flat: "assets/images/Flat.png",
    Shed: "assets/images/Shed.png",
    Butterfly: "assets/images/Butterfly.png",
  };


  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Control Panel */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
        <div style={{ display: "flex", gap: "10px" }}>
          {[
            {
              label: "Houses",
              image: "assets/images/Home.png",
              options: HouseModels,
              setShow: setShowHouseOptions,
              showOptions: showHouseOptions,
              setSelection: setSelectedHouse,
            },
            {
              label: "Buildings",
              image: "assets/images/Building.png",
              options: BuildingModels,
              setShow: setShowBuildingOptions,
              showOptions: showBuildingOptions,
              setSelection: setSelectedBuilding,
            },
          ].map(({ label, image, options, setShow, showOptions, setSelection }) => (
            <div key={label}>
              <button
                onClick={() => {
                  setShow(!showOptions);
                  label === "Houses" ? setShowBuildingOptions(false) : setShowHouseOptions(false);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <img
                  src={image}
                  alt={label}
                  title={label} // Tooltip on hover
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "10px",
                  }}
                />
              </button>
              {showOptions && (
                <div style={dropdownStyle}>
                  {Object.keys(options).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelection(option);
                        resetRenewableSources();
                        label === "Houses" ? setSelectedBuilding(null) : setSelectedHouse(null);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px",
                      }}
                      title={option} // Tooltip when hovering
                    >
                      <img
                        src={label === "Houses" ? HouseImages[option] : BuildingImages[option]}
                        alt={option}
                        style={{ width: "70px", height: "70px", borderRadius: "5px" }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Update the roof type section to only show when both conditions are met */}
        {selectedHouse === "Single-Family" && showHouseOptions && (
          <div style={{ marginTop: 350 }}>
            <p style={{ color: "white", marginBottom: "5px" }}>Select Roof Type:</p>
            {Object.keys(Roofs).map((roof) => (
              <button
                key={roof}
                onClick={() => setRoofType(roof)}
                style={{
                  flexDirection: "column",
                  gap: "15px",
                  alignItems: "flex-start",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer"
                }}
                title={roof}
              >
                <img
                  src={RoofImages[roof]}
                  alt={roof}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "contain"
                  }}
                />
              </button>
            ))}
          </div>
        )}

      </div>

      {(isOuterSpace || isAncient || isUnderwater || isCyberpunk || isForest) && (
        <video
          src={
            isOuterSpace
              ? "../assets/images/outerspace.mp4"
              : isAncient
                ? "../assets/images/ancient.mp4"
                : isUnderwater
                  ? "../assets/images/underwater.mp4"
                  : isCyberpunk
                    ? "../assets/images/cyberpunk.mp4"
                    : "../assets/images/forest.mp4"
          }
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "fill",
            zIndex: -1,
          }}
        />
      )}

      {/* 3D Canvas */}
      <Canvas
        style={{
          background: isOuterSpace || isAncient || isUnderwater || isCyberpunk || isForest ? "transparent" : bgColor,
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        camera={{ position: [0, 0, 11] }}
      >
        <ExportButton />
        <ImportButton />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <OrbitControls />
        <Platform />
        {(selectedHouse || selectedBuilding) && (
          <Html
            position={[0, -3, 0]}
            zIndexRange={[0, 100]}
          >
            <RenewableSlots
              infrastructure={selectedHouse || selectedBuilding}
              roofType={roofType}
              onSolarPanelClick={handleSolarPanelToggle}
              onSolarRoofTilesClick={handleSolarRoofTilesToggle}
              onSolarWaterHeatingClick={handleSolarWaterHeatingToggle}
              onHeatPumpClick={handleHeatPumpToggle}
              onSmallWindTurbinesClick={handleSmallWindTurbinesToggle}
              onVerticalAxisWindTurbinesClick={handleVerticalAxisWindTurbinesToggle}
              onMicroHydroPowerSystemClick={handleMicroHydroPowerSystemToggle}
              onPicoHydroPowerClick={handlePicoHydroPowerToggle}
              onVerticalFarmingClick={handleVerticalFarmingToggle}
            />
          </Html>
        )}

        {selectedHouse && React.createElement(HouseModels[selectedHouse], {
          roofType,
          showSolarPanels: activeRenewable === "solarPanels",
          showSolarRoofTiles: activeRenewable === "solarRoofTiles",
          showSolarWaterHeating: activeRenewable === "solarWaterHeating",
          showHeatPump: activeRenewable === "heatPump",
          showSmallWindTurbines: activeRenewable === "smallWindTurbines",
          showVerticalAxisWindTurbines: activeRenewable === "verticalAxisWindTurbines",
          showMicroHydroPowerSystem: activeRenewable === "microHydroPowerSystem",
          showPicoHydroPower: activeRenewable === "picoHydroPower",
          showVerticalFarming: activeRenewable === "verticalFarming"
        })}

        {selectedBuilding && React.createElement(BuildingModels[selectedBuilding], {
          showSolarPanels: activeRenewable === "solarPanels",
          showSolarRoofTiles: activeRenewable === "solarRoofTiles",
          showSolarWaterHeating: activeRenewable === "solarWaterHeating",
          showHeatPump: activeRenewable === "heatPump",
          showSmallWindTurbines: activeRenewable === "smallWindTurbines",
          showVerticalAxisWindTurbines: activeRenewable === "verticalAxisWindTurbines",
          showMicroHydroPowerSystem: activeRenewable === "microHydroPowerSystem",
          showPicoHydroPower: activeRenewable === "picoHydroPower",
          showVerticalFarming: activeRenewable === "verticalFarming"
        })}
      </Canvas>

      {isLoading && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
        }}>
          <MagnifyingGlass color="black" height={300} width={300} />
        </div>
      )}

      <button
        onClick={toggleBackgroundColor}
        title="Day / Night Mode"
        style={{
          ...floatButtonStyle,
          position: "relative",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          left: "1400px",
        }}
      >
        <img
          src="assets/images/daynight.png"
          alt="Day / Night Mode"
          style={{
            width: "83px",
            height: "85px",
            borderRadius: "50%",
          }}
        />
      </button>

      <button
        onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
        title="Theme"
        style={{
          ...floatButtonStyle,
          position: "relative",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          left: "1180px",
        }}
      >
        <img
          src="assets/images/theme.png"
          alt="Theme"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "100%",
          }}
        />
      </button>

      {isThemeMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "120px",
            left: "1305px",
            padding: "10px",
            border: "none",
          }}
        >
          {[
            { name: "Outer Space", img: "assets/images/outerspace.png" },
            { name: "Forest", img: "assets/images/forest.png" },
            { name: "Ancient", img: "assets/images/ancient.png" },
            { name: "Underwater", img: "assets/images/underwater.png" },
            { name: "Cyberpunk", img: "assets/images/cyberpunk.png" },
          ].map((theme) => (
            <ul key={theme.name} style={{ listStyle: "none", padding: 5, margin: 0 }}>
              <li onClick={() => changeTheme(theme.name)} style={{ cursor: "pointer" }}>
                <img
                  src={theme.img}
                  alt={theme.name}
                  title={theme.name} // Adds a tooltip with the theme name
                  style={{ width: "70px", height: "70px" }}
                />
              </li>
            </ul>
          ))}
        </div>

      )}

      <GameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalContent={modalContent}
      />
    </div>
  );
};
const buttonStyle = {
  background: "#1e1942",
  color: "white",
  padding: "10px 15px",
  margin: "5px 0",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  transition: "all 0.3s ease",
  width: "160px",
  left: "20px",  // Move buttons to the right (increase for more)
  top: "50px"   // Move buttons downward (increase for more)
};

const dropdownStyle = { padding: "10px", position: "absolute", top: "100px", left: "15px", zIndex: "9", width: "160px", borderRadius: "5px" };
const floatButtonStyle = { position: "absolute", top: "20px", left: "1370px", background: "#1e1942", color: "white", border: "none", cursor: "pointer", zIndex: 20, fontSize: "14px" };

export default Home;