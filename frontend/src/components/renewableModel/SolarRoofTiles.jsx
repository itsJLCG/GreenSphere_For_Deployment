import { useTexture } from "@react-three/drei";
import React from "react";

const SolarRoofTiles = ({ position, rotation }) => {
  const panelTexture = useTexture("../assets/images/SolarRoofTiles.avif");

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[2, 2]} /> {/* Matches the grid cell size */}
      <meshStandardMaterial map={panelTexture} />
    </mesh>
  );
};

export default SolarRoofTiles;
