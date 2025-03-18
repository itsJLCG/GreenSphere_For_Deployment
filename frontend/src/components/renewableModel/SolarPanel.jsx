import { useTexture } from "@react-three/drei";
import React from "react";

const SolarPanel = ({ position, rotation }) => {
  const panelTexture = useTexture("../assets/images/solarpanel.jpg");

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[2, 2]} /> {/* Matches the grid cell size */}
      <meshStandardMaterial map={panelTexture} />
    </mesh>
  );
};

export default SolarPanel;
