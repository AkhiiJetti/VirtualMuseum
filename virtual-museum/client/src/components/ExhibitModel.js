import { useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';

const ExhibitModel = ({ modelUrl, position, rotation, scale, onClick = () => {} }) => {
  const { scene } = useGLTF(modelUrl);
  const [hovered, setHovered] = useState(false);

  const { animatedScale } = useSpring({
    animatedScale: hovered ? scale * 1.2 : scale,
    config: { mass: 1, tension: 170, friction: 26 },
  });

  return (
    <a.primitive
      object={scene}
      position={position}
      rotation={rotation}
      scale={animatedScale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
};

export default ExhibitModel;
