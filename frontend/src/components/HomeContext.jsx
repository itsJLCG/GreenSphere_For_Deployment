import React, { createContext, useState } from "react";

export const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [showHouseOptions, setShowHouseOptions] = useState(false);
  const [showBuildingOptions, setShowBuildingOptions] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [roofType, setRoofType] = useState(null);
  const [bgColor, setBgColor] = useState("linear-gradient(black, lightblue)");
  const [isOuterSpace, setIsOuterSpace] = useState(false);
  const [isForest, setIsForest] = useState(false);
  const [isAncient, setIsAncient] = useState(false);
  const [isUnderwater, setIsUnderwater] = useState(false);
  const [isCyberpunk, setIsCyberpunk] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [showSolarPanels, setShowSolarPanels] = useState(false);
  const [showSolarRoofTiles, setShowSolarRoofTiles] = useState(false);
  const [showSolarWaterHeating, setShowSolarWaterHeating] = useState(false);
  const [showHeatPump, setShowHeatPump] = useState(false);
  const [showSmallWindTurbines, setShowSmallWindTurbines] = useState(false);
  const [showVerticalAxisWindTurbines, setShowVerticalAxisWindTurbines] = useState(false);
  const [showMicroHydroPowerSystem, setShowMicroHydroPowerSystem] = useState(false);
  const [showPicoHydroPower, setShowPicoHydroPower] = useState(false);
  const [showVerticalFarming, setShowVerticalFarming] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ name: "", type: "", infrastructure: "" });
  const [solarWaterHeating, setSolarWaterHeating] = useState([]);
  const [smallWindTurbines, setSmallWindTurbines] = useState([]);
  const [verticalAxisWindTurbines, setVerticalAxisWindTurbines] = useState([]);
  const [microHydroPowerSystem, setMicroHydroPowerSystem] = useState([]);
  const [picoHydroPower, setPicoHydroPower] = useState([]);
  const [solarPanels, setSolarPanels] = useState([]);
  const [solarRoofTiles, setSolarRoofTiles] = useState([]);
  const [heatPump, setHeatPump] = useState([]);
  const [verticalFarming, setVerticalFarming] = useState([]);

  const resetRenewableSources = () => {
    setSolarWaterHeating([]);
    setSmallWindTurbines([]);
    setVerticalAxisWindTurbines([]);
    setMicroHydroPowerSystem([]);
    setPicoHydroPower([]);
    setSolarPanels([]);
    setSolarRoofTiles([]);
    setHeatPump([]);
    setVerticalFarming([]);
  };
  
  return (
    <HomeContext.Provider
      value={{
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
        solarWaterHeating,
        setSolarWaterHeating,
        smallWindTurbines,
        setSmallWindTurbines,
        verticalAxisWindTurbines,
        setVerticalAxisWindTurbines,
        microHydroPowerSystem,
        setMicroHydroPowerSystem,
        picoHydroPower,
        setPicoHydroPower,
        solarPanels,
        setSolarPanels,
        solarRoofTiles,
        setSolarRoofTiles,
        heatPump,
        setHeatPump,
        verticalFarming,
        setVerticalFarming,
        resetRenewableSources,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
