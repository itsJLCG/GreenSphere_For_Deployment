import React, { useState } from 'react';
import './RenewableSlots.css'; // Assuming you have a CSS file for styling

const RenewableSlots = ({ infrastructure, roofType, onSolarPanelClick, onSolarRoofTilesClick, onSolarWaterHeatingClick, onHeatPumpClick, onSmallWindTurbinesClick, onVerticalAxisWindTurbinesClick, onMicroHydroPowerSystemClick, onPicoHydroPowerClick, onVerticalFarmingClick }) => {
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [showSolarPanels, setShowSolarPanels] = useState(false);
  const [showSolarRoofTiles, setShowSolarRoofTiles] = useState(false);
  const [showSolarWaterHeating, setShowSolarWaterHeating] = useState(false);
  const [showHeatPump, setShowHeatPump] = useState(false);
  const [showSmallWindTurbines, setShowSmallWindTurbines] = useState(false);
  const [showVerticalAxisWindTurbines, setShowVerticalAxisWindTurbines] = useState(false);
  const [showMicroHydroPowerSystem, setShowMicroHydroPowerSystem] = useState(false);
  const [showPicoHydroPower, setShowPicoHydroPower] = useState(false);
  const [showVerticalFarming, setShowVerticalFarming] = useState(false);


  // Define the ranking of renewable energy sources for different infrastructures
  const renewableEnergyRankings = {
    "Single-Family with Gable": [
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Single-Family with Flat": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Single-Family with Shed": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Single-Family with Butterfly": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Cottages": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "TownHouse": [
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Mobile Home": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Apartments": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
    ],
    "Office Building": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
    ],
  };

  // Get the renewable energy slots based on the selected infrastructure and roof type
  const renewableEnergySlots = renewableEnergyRankings[`${infrastructure} with ${roofType}`] || renewableEnergyRankings[infrastructure] || [];

  const handleSlotHover = (index) => {
    setHoveredSlot(index);
  };

  const handleSlotLeave = () => {
    setHoveredSlot(null);
  };

  const handleSolarPanelClick = () => {
    const newState = !showSolarPanels;
    setShowSolarPanels(newState);
    onSolarPanelClick(newState);  // Notify Home.jsx
  };

  const handleSolarRoofTilesClick = () => {
    const newState = !showSolarRoofTiles;
    setShowSolarRoofTiles(newState);
    onSolarRoofTilesClick(newState);  // Notify Home.jsx
  };

  const handleSolarWaterHeatingClick = () => {
    const newState = !showSolarWaterHeating;
    setShowSolarWaterHeating(newState);
    onSolarWaterHeatingClick(newState);  // Notify Home.jsx
  };

  const handleHeatPumpClick = () => {
    const newState = !showHeatPump;
    setShowHeatPump(newState);
    onHeatPumpClick(newState);  // Notify Home.jsx
  };

  const handleSmallWindTurbinesClick = () => {
    const newState = !showSmallWindTurbines;
    setShowSmallWindTurbines(newState);
    onSmallWindTurbinesClick(newState);  // Notify Home.jsx
  };

  const handleVerticalAxisWindTurbinesClick = () => {
    const newState = !showVerticalAxisWindTurbines;
    setShowVerticalAxisWindTurbines(newState);
    onVerticalAxisWindTurbinesClick(newState);  // Notify Home.jsx
  };

  const handleMicroHydroPowerSystemClick = () => {
    const newState = !showMicroHydroPowerSystem;
    setShowMicroHydroPowerSystem(newState);
    onMicroHydroPowerSystemClick(newState);  // Notify Home.jsx
  };

  const handlePicoHydroPowerClick = () => {
    const newState = !showPicoHydroPower;
    setShowPicoHydroPower(newState);
    onPicoHydroPowerClick(newState);  // Notify Home.jsx
  };

  const handleVerticalFarmingClick = () => {
    const newState = !showVerticalFarming;
    setShowVerticalFarming(newState);
    onVerticalFarmingClick(newState);  // Notify Home.jsx
  };

  return (
    <div className="hotbar-container">
      <div className="recommendation-text">
        <span className="highly-recommended">Highly Recommended</span>
        <span className="least-recommended">Least Recommended</span>
      </div>
      <div className="hotbar">
        {renewableEnergySlots.map((slot, index) => {
          const isLastTwo = index >= renewableEnergySlots.length - 2;
          const isHeatPumpUnderMobileHome  = slot.name === 'Heat Pump' && infrastructure === 'Mobile Home';


  
          return (
            <div
              key={index}
              className="slot"
              onMouseEnter={() => handleSlotHover(index)}
              onMouseLeave={handleSlotLeave}
              onClick={
                slot.name === 'Solar Panels'
                  ? handleSolarPanelClick
                  : slot.name === 'Solar Roof Tiles'
                    ? handleSolarRoofTilesClick
                    : slot.name === 'Solar Water Heating'
                      ? handleSolarWaterHeatingClick
                      : slot.name === 'Heat Pump'
                        ? handleHeatPumpClick
                        : slot.name === 'Small Wind Turbines'
                          ? handleSmallWindTurbinesClick
                          : slot.name === 'Vertical Axis Wind Turbines'
                            ? handleVerticalAxisWindTurbinesClick
                            : slot.name === 'Micro Hydropower System'
                              ? handleMicroHydroPowerSystemClick
                              : slot.name === 'Pico Hydropower'
                                ? handlePicoHydroPowerClick
                                : slot.name === 'Vertical Farming'
                                  ? handleVerticalFarmingClick
                                  : undefined
              }
              style={{ position: 'relative' }}
            >
              <img src={slot.image} alt={slot.name} className="slot-image" style={{ width: '100%', height: 'auto' }} />
              
              {/* Apply "X" for last two slots OR if it's a Heat Pump under a Mobile Home */}
              {(isLastTwo || isHeatPumpUnderMobileHome) && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 0, 0, 0.3)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '4rem',
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '2px 2px 10px black',
                    zIndex: 2,
                  }}
                >
                  X
                </div>
              )}
  
              {hoveredSlot === index && (
                <div className="tooltip">
                  <strong>{slot.type}</strong>
                  <div>{slot.name}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
  
  
};

export default RenewableSlots;