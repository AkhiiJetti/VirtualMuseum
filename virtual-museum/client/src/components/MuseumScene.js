import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, useGLTF, Environment, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import './MuseumScene.css';

const textureURL = 'https://cdn.pixabay.com/photo/2017/11/07/00/41/brick-2922368_1280.jpg';

const models = [
  {
    title: 'Astronaut',
    description: 'A space explorer suit used in orbital missions.',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  },
  {
    title: 'Helmet',
    description: 'A battle-damaged sci-fi helmet.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
  },
  {
    title: 'Vintage Camera',
    description: 'A beautifully modeled vintage box camera mounted on a tripod.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb',
  },
  {
    title: 'Robot',
    description: 'A humanoid robot with expressive animations.',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
  },
  {
    title: 'Vintage Race Car',
    description: 'This is a vintage collectible race car.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyCar/glTF-Binary/ToyCar.glb',
  },
  {
    title: 'Amber',
    description: 'Mosquito in Amber.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MosquitoInAmber/glTF-Binary/MosquitoInAmber.glb',
  },
  {
    title: 'Glam Velvet Sofa',
    description: 'A mid‑century styled velvet sofa.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb',
  },
  {
    title: 'Barn Lamp',
    description: 'An old-fashioned barn lamp with metallic finishes.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AnisotropyBarnLamp/glTF-Binary/AnisotropyBarnLamp.glb',
  },
  {
    title: 'Dragon',
    description: 'A stylized glass‑like dragon figure.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DragonAttenuation/glTF-Binary/DragonAttenuation.glb',
  },
  {
    title: 'Pot of Coals',
    description: 'A rustic iron pot containing glowing coals.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/PotOfCoalsAnimationPointer/glTF-Binary/PotOfCoalsAnimationPointer.glb',
  },
];

function Model({ url, onClick, hovered }) {
  const gltf = useGLTF(url);
  const ref = useRef();
  useCursor(hovered);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }
  }, [hovered]);

  return (
    <primitive
      ref={ref}
      object={gltf.scene}
      scale={hovered ? 1.2 : 1}
      onClick={onClick}
      onPointerOver={() => onClick('hover')}
      onPointerOut={() => onClick(null)}
    />
  );
}

function Ground({ texture }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function MuseumScene() {
  const [stage, setStage] = useState('start');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const texture = useRef();

  useEffect(() => {
    new THREE.TextureLoader().load(textureURL, (tex) => {
      texture.current = tex;
    });
  }, []);

  const handleModelClick = (index) => {
    if (stage === 'preview') {
      setSelectedIndex(index);
      setStage('tour');
    }
  };

  const handleHover = (index) => {
    setHoveredIndex(index);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % models.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + models.length) % models.length);
  };

  return (
    <div className="museum-container">
      {stage === 'start' && (
        <button className="start-button" onClick={() => setStage('preview')}>Start Tour</button>
      )}

      {stage === 'preview' && (
        <button className="go-button" onClick={() => setStage('tour')}>Go</button>
      )}

      <Canvas shadows camera={{ position: [0, 10, 30], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} castShadow />
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          {texture.current && <Ground texture={texture.current} />}

          {stage === 'preview' && models.map((model, index) => (
            <group
              key={index}
              position={[index * 5 - 25, 0, 0]}
            >
              <Model
                url={model.modelUrl}
                hovered={hoveredIndex === index}
                onClick={() => handleModelClick(index)}
              />
              <Html distanceFactor={10} position={[0, 3, 0]}>
                <div className="label">{model.title}</div>
              </Html>
            </group>
          ))}

          {stage === 'tour' && selectedIndex !== null && (
            <group position={[0, 0, 0]}>
              <Model
                url={models[selectedIndex].modelUrl}
                hovered={true}
                onClick={() => {}}
              />
              <Html distanceFactor={10} position={[0, 3, 0]}>
                <div className="label">
                  <h3>{models[selectedIndex].title}</h3>
                  <p>{models[selectedIndex].description}</p>
                  <div className="nav-buttons">
                    <button onClick={handlePrev}>←</button>
                    <button onClick={handleNext}>→</button>
                  </div>
                </div>
              </Html>
            </group>
          )}
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
}
