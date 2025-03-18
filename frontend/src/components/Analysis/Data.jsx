const energyTechnologies = {
  "Solar Roof Tiles": {
      energyOutput: "544 kWh/year",
      costEfficiency: "Moderate",
      environmentalImpact: "Low",
      productCost: 131100,
      installation: 79800,
      maintenance: 11400,
      carbonEmissions: 3,
      electricityCost: 12,
      image: "/assets/images/SolarRoofTiles.png",
  },
  "Solar Panels": {
      energyOutput: "639 kWh/year",
      costEfficiency: "High",
      environmentalImpact: "Low",
      productCost: 35000,
      installation: 150000,
      maintenance: 6500,
      carbonEmissions: 4.9,
      electricityCost: 12,
      image: "/assets/images/SolarPanel.png",
  },
  "Solar Water Heating": {
      energyOutput: "2500 kWh/year",
      costEfficiency: "High",
      environmentalImpact: "Low",
      productCost: 285000,
      installation: 28500,
      maintenance: 5700,
      carbonEmissions: 3,
      electricityCost: 12,
      image: "/assets/images/SolarWaterHeating.png",
  },
  "Heat Pump": {
      energyOutput: "4500 kWh/year",
      costEfficiency: "Moderate",
      environmentalImpact: "Moderate",
      productCost: 591858,
      installation: 287500,
      maintenance: 57750,
      carbonEmissions: 5,
      electricityCost: 12,
      image: "/assets/images/HeatPump.png",
  },
  "Small Wind Turbines": {
      energyOutput: "17520 kWh/year",
      costEfficiency: "Moderate",
      environmentalImpact: "Moderate",
      productCost: 2565000,
      installation: 1909500,
      maintenance: 256500,
      carbonEmissions: 4.54,
      electricityCost: 12,
      image: "/assets/images/SmallWindTurbine.png",
  },
  "Vertical Axis Wind Turbines": {
      energyOutput: "13140 kWh/year",
      costEfficiency: "Moderate",
      environmentalImpact: "Moderate",
      productCost: 627000,
      installation: 570000,
      maintenance: 142500,
      carbonEmissions: 4.54,
      electricityCost: 12,
      image: "/assets/images/VerticalAxisWindTurbine.png",
  },
  "Micro Hydropower System": {
      energyOutput: "3000 kWh/year",
      costEfficiency: "High",
      environmentalImpact: "Low",
      productCost: 384750,
      installation: 157000,
      maintenance: 28500,
      carbonEmissions: 2.1,
      electricityCost: 12,
      image: "/assets/images/MicroHydroPowerSystem.png",
  },
  "Pico Hydropower": {
      energyOutput: "87600 kWh/year",
      costEfficiency: "High",
      environmentalImpact: "Low",
      productCost: 826500,
      installation: 285000,
      maintenance: 17100,
      carbonEmissions: 1.05,
      electricityCost: 12,
      image: "/assets/images/PicoHydroPower.png",
  },
  "Vertical Farming": {
      energyOutput: "N/A",
      costEfficiency: "High",
      environmentalImpact: "Low",
      productCost: 672600,
      installation: 57600,
      maintenance: 25560,
      carbonEmissions: 2.2,
      electricityCost: 12,
      image: "/assets/images/VerticalFarming.png",
  },
};
  
  const renewableEnergyRankings = {
     "Single-Family with Gable": [
    { 
      "type": "Solar Energy", 
      "name": "Solar Roof Tiles", 
      "image": "/assets/images/SolarRoofTiles.png",
      "reason": "Solar roof tiles integrate seamlessly into the existing roofing structure, maintaining the aesthetic appeal of a gable-style home while harnessing solar energy for electricity generation."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Panels", 
      "image": "/assets/images/SolarPanel.png",
      "reason": "Gable roofs provide ample surface area and an ideal tilt for mounting solar panels, maximizing sunlight exposure and energy efficiency."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Water Heating", 
      "image": "/assets/images/SolarWaterHeating.png",
      "reason": "A gable roof structure allows easy installation of solar collectors, providing efficient heating for household water needs while reducing reliance on conventional heating systems."
    },
    { 
      "type": "Geothermal Energy", 
      "name": "Heat Pump", 
      "image": "/assets/images/HeatPump.png",
      "reason": "Geothermal heat pumps work well in residential homes by utilizing stable underground temperatures, reducing energy costs for heating and cooling throughout the year."
    },
    { 
      "type": "Wind Energy", 
      "name": "Small Wind Turbines", 
      "image": "/assets/images/SmallWindTurbine.png",
      "reason": "Small wind turbines can be installed on the property where wind flow is sufficient, providing an off-grid electricity source and supplementing household energy consumption."
    },
    { 
      "type": "Wind Energy", 
      "name": "Vertical Axis Wind Turbines", 
      "image": "/assets/images/VerticalAxisWindTurbine.png",
      "reason": "Vertical axis wind turbines are compact and can be installed near or on the house, making them suitable for areas with variable wind directions without requiring large open spaces."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Micro Hydropower System", 
      "image": "/assets/images/MicroHydroPowerSystem.png",
      "reason": "If the home is near a small stream or water source, a micro hydropower system can provide consistent and renewable electricity with minimal environmental impact."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Pico Hydropower", 
      "image": "/assets/images/PicoHydroPower.png",
      "reason": "Pico hydropower systems are ideal for off-grid homes with access to low-flow water sources, generating sustainable energy with minimal infrastructure modifications."
    },
    { 
      "type": "Urban Farming", 
      "name": "Vertical Farming", 
      "image": "/assets/images/VerticalFarming.png",
      "reason": "Vertical farming allows homeowners to grow fresh produce in limited spaces, utilizing walls or greenhouse structures to enhance food sustainability and self-sufficiency."
    }
  ],
  
     "Single-Family with Flat": [
    { 
      "type": "Solar Energy", 
      "name": "Solar Panels", 
      "image": "/assets/images/SolarPanel.png",
      "reason": "Flat roofs provide an ideal surface for installing solar panels at an optimal tilt, maximizing solar energy absorption and efficiency."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Roof Tiles", 
      "image": "/assets/images/SolarRoofTiles.png",
      "reason": "Solar roof tiles can be integrated into the structure of a flat roof, offering a sleek and aesthetic alternative to traditional solar panels."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Water Heating", 
      "image": "/assets/images/SolarWaterHeating.png",
      "reason": "A flat roof allows easy placement of solar water heating collectors, efficiently capturing sunlight to provide hot water for household use."
    },
    { 
      "type": "Geothermal Energy", 
      "name": "Heat Pump", 
      "image": "/assets/images/HeatPump.png",
      "reason": "Geothermal heat pumps use stable underground temperatures to provide consistent heating and cooling, making them suitable for energy-efficient homes."
    },
    { 
      "type": "Wind Energy", 
      "name": "Small Wind Turbines", 
      "image": "/assets/images/SmallWindTurbine.png",
      "reason": "Flat roofs provide open space for small wind turbines, allowing them to capture wind energy effectively without obstruction."
    },
    { 
      "type": "Wind Energy", 
      "name": "Vertical Axis Wind Turbines", 
      "image": "/assets/images/VerticalAxisWindTurbine.png",
      "reason": "Vertical axis wind turbines are compact and can be mounted on flat roofs, generating electricity even in areas with unpredictable wind directions."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Micro Hydropower System", 
      "image": "/assets/images/MicroHydroPowerSystem.png",
      "reason": "If the home is near a flowing water source, a micro hydropower system can provide a reliable and sustainable energy supply."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Pico Hydropower", 
      "image": "/assets/images/PicoHydroPower.png",
      "reason": "Pico hydropower is ideal for off-grid homes with small water sources, generating low-maintenance renewable energy."
    },
    { 
      "type": "Urban Farming", 
      "name": "Vertical Farming", 
      "image": "/assets/images/VerticalFarming.png",
      "reason": "Flat rooftops provide an excellent platform for vertical farming setups, allowing homeowners to grow fresh produce efficiently in urban environments."
    }
  ],
  
     "Single-Family with Shed": [
    { 
      "type": "Solar Energy", 
      "name": "Solar Panels", 
      "image": "/assets/images/SolarPanel.png",
      "reason": "The sloped nature of a shed roof provides an optimal angle for solar panel installation, maximizing sunlight capture and energy efficiency."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Roof Tiles", 
      "image": "/assets/images/SolarRoofTiles.png",
      "reason": "Solar roof tiles can seamlessly integrate with the shed roof design, maintaining an aesthetically pleasing look while generating renewable energy."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Water Heating", 
      "image": "/assets/images/SolarWaterHeating.png",
      "reason": "The tilted shed roof allows efficient installation of solar water heating collectors, ensuring optimal exposure to sunlight for heating household water."
    },
    { 
      "type": "Geothermal Energy", 
      "name": "Heat Pump", 
      "image": "/assets/images/HeatPump.png",
      "reason": "Geothermal heat pumps utilize stable underground temperatures, making them ideal for efficient heating and cooling in single-family homes."
    },
    { 
      "type": "Wind Energy", 
      "name": "Small Wind Turbines", 
      "image": "/assets/images/SmallWindTurbine.png",
      "reason": "Shed-style homes often have open surroundings, making them suitable for small wind turbines to harness consistent wind energy."
    },
    { 
      "type": "Wind Energy", 
      "name": "Vertical Axis Wind Turbines", 
      "image": "/assets/images/VerticalAxisWindTurbine.png",
      "reason": "Vertical axis wind turbines can be installed near the home, generating electricity even in areas with variable wind directions."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Micro Hydropower System", 
      "image": "/assets/images/MicroHydroPowerSystem.png",
      "reason": "If located near a flowing water source, a micro hydropower system can provide a consistent renewable energy supply with minimal land impact."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Pico Hydropower", 
      "image": "/assets/images/PicoHydroPower.png",
      "reason": "Pico hydropower is an efficient choice for homes with access to small streams, generating off-grid renewable electricity with minimal setup."
    },
    { 
      "type": "Urban Farming", 
      "name": "Vertical Farming", 
      "image": "/assets/images/VerticalFarming.png",
      "reason": "A shed-style home offers vertical space that can be utilized for urban farming, promoting sustainable food production in limited areas."
    }
  ],
  
    "Single-Family with Butterfly": [
    { 
      "type": "Solar Energy", 
      "name": "Solar Panels", 
      "image": "/assets/images/SolarPanel.png",
      "reason": "The upward-sloping wings of a butterfly roof create an ideal tilt for solar panel installation, optimizing sunlight capture throughout the day."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Roof Tiles", 
      "image": "/assets/images/SolarRoofTiles.png",
      "reason": "Solar roof tiles can be integrated into the sloped sections of the butterfly roof, maintaining a sleek design while generating renewable energy."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Water Heating", 
      "image": "/assets/images/SolarWaterHeating.png",
      "reason": "The sloped roof structure allows for efficient placement of solar water heating collectors, ensuring optimal exposure to sunlight for heating water."
    },
    { 
      "type": "Geothermal Energy", 
      "name": "Heat Pump", 
      "image": "/assets/images/HeatPump.png",
      "reason": "Geothermal heat pumps provide energy-efficient heating and cooling by leveraging stable underground temperatures, making them ideal for eco-conscious homes."
    },
    { 
      "type": "Wind Energy", 
      "name": "Small Wind Turbines", 
      "image": "/assets/images/SmallWindTurbine.png",
      "reason": "Butterfly roofs often direct airflow upward, which can be advantageous for small wind turbines placed strategically to harness wind energy."
    },
    { 
      "type": "Wind Energy", 
      "name": "Vertical Axis Wind Turbines", 
      "image": "/assets/images/VerticalAxisWindTurbine.png",
      "reason": "Vertical axis wind turbines can be installed on or near the house, effectively generating electricity even in areas with fluctuating wind directions."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Micro Hydropower System", 
      "image": "/assets/images/MicroHydroPowerSystem.png",
      "reason": "If located near a water source, a micro hydropower system can generate sustainable energy with minimal environmental impact."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Pico Hydropower", 
      "image": "/assets/images/PicoHydroPower.png",
      "reason": "Pico hydropower is suitable for homes with small water streams, providing an off-grid renewable energy solution with low maintenance."
    },
    { 
      "type": "Urban Farming", 
      "name": "Vertical Farming", 
      "image": "/assets/images/VerticalFarming.png",
      "reason": "The inward slope of a butterfly roof naturally collects rainwater, which can be used for vertical farming, supporting sustainable food production."
    }
  ],
  
     "Cottages": [
    { 
      "type": "Solar Energy", 
      "name": "Solar Panels", 
      "image": "/assets/images/SolarPanel.png",
      "reason": "Cottages often have unobstructed access to sunlight, making solar panels an efficient and sustainable energy source for off-grid or rural areas."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Roof Tiles", 
      "image": "/assets/images/SolarRoofTiles.png",
      "reason": "Solar roof tiles blend seamlessly with traditional cottage aesthetics while providing renewable energy without the need for separate panel installations."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Water Heating", 
      "image": "/assets/images/SolarWaterHeating.png",
      "reason": "Cottages in remote locations benefit from solar water heating systems, reducing dependency on external energy sources for hot water."
    },
    { 
      "type": "Geothermal Energy", 
      "name": "Heat Pump", 
      "image": "/assets/images/HeatPump.png",
      "reason": "Geothermal heat pumps provide consistent heating and cooling, making them ideal for cottages in regions with seasonal temperature variations."
    },
    { 
      "type": "Wind Energy", 
      "name": "Small Wind Turbines", 
      "image": "/assets/images/SmallWindTurbine.png",
      "reason": "Rural cottages often have open spaces with steady winds, making small wind turbines a reliable renewable energy source."
    },
    { 
      "type": "Wind Energy", 
      "name": "Vertical Axis Wind Turbines", 
      "image": "/assets/images/VerticalAxisWindTurbine.png",
      "reason": "Vertical axis wind turbines require less space and can generate electricity in changing wind conditions, making them suitable for cottage landscapes."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Micro Hydropower System", 
      "image": "/assets/images/MicroHydroPowerSystem.png",
      "reason": "Cottages located near streams or small rivers can utilize micro hydropower systems for a consistent, off-grid energy supply."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Pico Hydropower", 
      "image": "/assets/images/PicoHydroPower.png",
      "reason": "Pico hydropower systems are ideal for cottages with access to small water flows, offering an efficient, low-maintenance energy solution."
    },
    { 
      "type": "Urban Farming", 
      "name": "Vertical Farming", 
      "image": "/assets/images/VerticalFarming.png",
      "reason": "Cottages with limited garden space can utilize vertical farming techniques to grow fresh produce in a sustainable manner."
    }
  ],
  
     "TownHouse": [
    { 
      "type": "Solar Energy", 
      "name": "Solar Roof Tiles", 
      "image": "/assets/images/SolarRoofTiles.png",
      "reason": "Solar roof tiles integrate seamlessly into townhouse roofing structures, offering a discreet yet efficient renewable energy solution without compromising aesthetics."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Panels", 
      "image": "/assets/images/SolarPanel.png",
      "reason": "Townhouses often have limited roof space, making solar panels a practical and efficient option for maximizing renewable energy generation."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Water Heating", 
      "image": "/assets/images/SolarWaterHeating.png",
      "reason": "Solar water heating systems provide an eco-friendly way to heat water, reducing energy costs for multi-unit townhouses with shared heating needs."
    },
    { 
      "type": "Geothermal Energy", 
      "name": "Heat Pump", 
      "image": "/assets/images/HeatPump.png",
      "reason": "Geothermal heat pumps utilize underground temperatures for heating and cooling, making them an energy-efficient option for space-constrained townhouses."
    },
    { 
      "type": "Wind Energy", 
      "name": "Vertical Axis Wind Turbines", 
      "image": "/assets/images/VerticalAxisWindTurbine.png",
      "reason": "Vertical axis wind turbines are compact and can be installed on rooftops, making them suitable for urban townhouse environments with variable wind conditions."
    },
    { 
      "type": "Wind Energy", 
      "name": "Small Wind Turbines", 
      "image": "/assets/images/SmallWindTurbine.png",
      "reason": "Small wind turbines can be installed in townhouse communities where wind resources are available, providing an additional source of clean energy."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Micro Hydropower System", 
      "image": "/assets/images/MicroHydroPowerSystem.png",
      "reason": "If located near a water source, micro hydropower systems can generate renewable energy, supporting townhouse communities with sustainable power."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Pico Hydropower", 
      "image": "/assets/images/PicoHydroPower.png",
      "reason": "Pico hydropower is ideal for townhouses with access to small water streams, providing an off-grid renewable energy solution in suitable locations."
    },
    { 
      "type": "Urban Farming", 
      "name": "Vertical Farming", 
      "image": "/assets/images/VerticalFarming.png",
      "reason": "Vertical farming is an efficient way to grow fresh produce in limited spaces, making it perfect for townhouses with small yards or rooftop gardens."
    }
  ],
  
     "Mobile Home": [
    { 
      "type": "Solar Energy", 
      "name": "Solar Panels", 
      "image": "/assets/images/SolarPanel.png",
      "reason": "Lightweight and easy to install on the limited roof space of mobile homes, providing an off-grid power solution for energy independence."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Water Heating", 
      "image": "/assets/images/SolarWaterHeating.png",
      "reason": "Reduces reliance on electric or gas-powered water heating, making it an energy-efficient solution for mobile living."
    },
    { 
      "type": "Geothermal Energy", 
      "name": "Heat Pump", 
      "image": "/assets/images/HeatPump.png",
      "reason": "A compact and efficient heating/cooling system that can be adapted for mobile home settings where ground-source energy is available."
    },
    { 
      "type": "Wind Energy", 
      "name": "Vertical Axis Wind Turbines", 
      "image": "/assets/images/VerticalAxisWindTurbine.png",
      "reason": "Ideal for small spaces and can be mounted on mobile homes to generate electricity from wind in open areas."
    },
    { 
      "type": "Wind Energy", 
      "name": "Small Wind Turbines", 
      "image": "/assets/images/SmallWindTurbine.png",
      "reason": "Portable and easy to install, small wind turbines can generate power for mobile homes in windy regions."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Micro Hydropower System", 
      "image": "/assets/images/MicroHydroPowerSystem.png",
      "reason": "Useful for mobile homes parked near a water source, providing continuous energy without reliance on the grid."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Pico Hydropower", 
      "image": "/assets/images/PicoHydroPower.png",
      "reason": "A compact hydropower option for off-grid living, suitable for mobile homes stationed near running water."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Roof Tiles", 
      "image": "/assets/images/SolarRoofTiles.png",
      "reason": "Aesthetic and functional, solar roof tiles blend seamlessly into mobile home roofs, offering a space-efficient energy solution."
    },
    { 
      "type": "Urban Farming", 
      "name": "Vertical Farming", 
      "image": "/assets/images/VerticalFarming.png",
      "reason": "Compact and adaptable for mobile living, vertical farming allows residents to grow fresh produce in small spaces."
    }
  ],
  
    "Apartments": [
    { 
      "type": "Solar Energy", 
      "name": "Solar Panels", 
      "image": "/assets/images/SolarPanel.png",
      "reason": "Can be installed on apartment rooftops to provide shared renewable energy for multiple units."
    },
    { 
      "type": "Geothermal Energy", 
      "name": "Heat Pump", 
      "image": "/assets/images/HeatPump.png",
      "reason": "A centralized geothermal system can efficiently heat and cool multi-story buildings, reducing energy costs."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Water Heating", 
      "image": "/assets/images/SolarWaterHeating.png",
      "reason": "Efficiently provides hot water for apartment buildings, reducing dependence on traditional heating systems."
    },
    { 
      "type": "Wind Energy", 
      "name": "Vertical Axis Wind Turbines", 
      "image": "/assets/images/VerticalAxisWindTurbine.png",
      "reason": "Can be installed on rooftops of apartment complexes to generate wind energy in urban areas."
    },
    { 
      "type": "Wind Energy", 
      "name": "Small Wind Turbines", 
      "image": "/assets/images/SmallWindTurbine.png",
      "reason": "Suitable for apartment buildings in windy locations, providing supplementary renewable energy."
    },
    { 
      "type": "Urban Farming", 
      "name": "Vertical Farming", 
      "image": "/assets/images/VerticalFarming.png",
      "reason": "Maximizes food production in limited spaces, allowing residents to grow fresh produce on balconies or rooftops."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Micro Hydropower System", 
      "image": "/assets/images/MicroHydroPowerSystem.png",
      "reason": "If located near a water source, micro hydropower can provide clean energy for apartment buildings."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Pico Hydropower", 
      "image": "/assets/images/PicoHydroPower.png",
      "reason": "A small-scale hydropower option for apartment complexes with access to running water."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Roof Tiles", 
      "image": "/assets/images/SolarRoofTiles.png",
      "reason": "Aesthetic and effective for apartment rooftops, providing renewable energy without requiring extra installation space."
    }
  ],
  
  "Office Building": [
    { 
      "type": "Solar Energy", 
      "name": "Solar Panels", 
      "image": "/assets/images/SolarPanel.png",
      "reason": "Large roof space makes office buildings ideal for installing solar panels to generate clean electricity."
    },
    { 
      "type": "Geothermal Energy", 
      "name": "Heat Pump", 
      "image": "/assets/images/HeatPump.png",
      "reason": "Geothermal heat pumps provide energy-efficient climate control for office spaces, reducing operational costs."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Water Heating", 
      "image": "/assets/images/SolarWaterHeating.png",
      "reason": "Efficiently supplies hot water for office restrooms and cafeterias, reducing reliance on traditional heating methods."
    },
    { 
      "type": "Wind Energy", 
      "name": "Vertical Axis Wind Turbines", 
      "image": "/assets/images/VerticalAxisWindTurbine.png",
      "reason": "Can be installed on office rooftops to harness urban wind energy without requiring large open spaces."
    },
    { 
      "type": "Wind Energy", 
      "name": "Small Wind Turbines", 
      "image": "/assets/images/SmallWindTurbine.png",
      "reason": "Small wind turbines supplement energy needs in offices located in windy regions, reducing grid dependence."
    },
    { 
      "type": "Urban Farming", 
      "name": "Vertical Farming", 
      "image": "/assets/images/VerticalFarming.png",
      "reason": "Encourages sustainable food production in office buildings, utilizing green walls and rooftop gardens for fresh produce."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Micro Hydropower System", 
      "image": "/assets/images/MicroHydroPowerSystem.png",
      "reason": "Office buildings near a water source can benefit from micro hydropower, generating sustainable energy on-site."
    },
    { 
      "type": "HydroPower Energy", 
      "name": "Pico Hydropower", 
      "image": "/assets/images/PicoHydroPower.png",
      "reason": "A viable renewable energy option for offices with access to small-scale water flow."
    },
    { 
      "type": "Solar Energy", 
      "name": "Solar Roof Tiles", 
      "image": "/assets/images/SolarRoofTiles.png",
      "reason": "Blends seamlessly into office architecture while generating renewable energy without requiring extra space."
    }
  ],
  
    };
export default renewableEnergyRankings;
export { energyTechnologies };