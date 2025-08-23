import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, useGLTF, Text, PointerLockControls, OrbitControls, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

// --- DATA: Added descriptions and refined data ---
const exhibits = [
  {
    url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    position: [-15, 0, -10],
    info: 'Astronaut',
    description: 'A detailed model of an astronaut suit, complete with reflective visor and life-support backpack. Designed for extravehicular activities in space.',
    scale: 2,
    boxSize: [3, 4.5, 2]
  },
  {
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    position: [-7.5, 2, -10],
    info: 'Helmet',
    description: 'A battle-damaged sci-fi helmet. The weathering and scratches on its surface tell a story of past conflicts.',
    scale: 1,
    boxSize: [3, 3, 3],
    boxYOffset: -1.5
  },
  {
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb',
    position: [0, 0, -10],
    info: 'Vintage Camera',
    description: 'A beautifully modeled vintage box camera mounted on a tripod. It represents a classic era of photography.',
    scale: 0.5,
    boxSize: [2, 4, 3]
  },
  {
    url: '/models/robot.glb',
    position: [7.5, 2, -10],
    info: 'Deep Space Robot',
    description: 'A humanoid robot designed for deep space exploration and maintenance tasks. Note the expressive animated features.',
    scale: 3,
    boxSize: [3, 4.25, 3],
    rotation: [0, Math.PI, 0], 
    boxYOffset: -2
  },
  {
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyCar/glTF-Binary/ToyCar.glb',
    position: [15, 0, -10],
    info: 'Vintage Race Car',
    description: 'A classic collectible toy race car with a vibrant red paint job and detailed features from a bygone era.',
    scale: 200,
    boxSize: [6, 4, 9]
  },
  {
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MosquitoInAmber/glTF-Binary/MosquitoInAmber.glb',
    position: [-15, 2, 10],
    info: 'Amber',
    description: 'A prehistoric mosquito perfectly preserved in amber, a nod to the wonders of natural history and paleontology.',
    scale: 30,
    boxSize: [3, 4, 3],
    boxYOffset: -2
  },
  {
    url: '/models/allosaurus.glb',
    position: [-7.5, 2.2, 10],
    info: 'Armored Allosaurus',
    description: 'A fearsome Allosaurus equipped with futuristic battle armor.',
    scale: 1,
    boxSize: [5, 5, 6.3],
    boxYOffset: -2
  },
  {
    url: '/models/giant_mech.glb',
    position: [0, 2.1, 10],
    info: 'Giant Mech',
    description: 'A colossal mech warrior, ready for interplanetary combat.',
    scale: 1.3,
    rotation: [0, Math.PI/-2.2, 0], 
    boxSize: [8, 6, 4],
    boxYOffset: -2

  },
  {
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DragonAttenuation/glTF-Binary/DragonAttenuation.glb',
    position: [7.5, 1, 10],
    info: 'Dragon',
    description: 'A stylized, glass-like dragon figure that showcases light attenuation, making it appear to glow from within.',
    scale: 1,
    boxSize: [6, 4, 6],
    boxYOffset: -1
  },
  {
    url: '/models/x_wing.glb',
    position: [15, 2.5, 10],
    info: 'X-Wing Fighter',
    description: 'A classic starfighter known for its distinctive S-foils.',
    scale: 1,
    boxSize: [6, 4, 11],
    boxYOffset: -2

  },
];

// --- COMPONENT: Loading Screen ---
function LoadingScreen({ onStarted }) {
  const [startAnimation, setStartAnimation] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const VIRTUAL = 'VIRTUAL'.split('');
  const MUSEUM = 'MUSEUM'.split('');
  useEffect(() => {
    const startTimer = setTimeout(() => setStartAnimation(true), 100);
    const buttonTimer = setTimeout(() => setShowButton(true), 2000);
    return () => { clearTimeout(startTimer); clearTimeout(buttonTimer); };
  }, []);
  return (
    <>
      <style>{`
        .title-container { display: flex; font-size: 4rem; margin-bottom: 2rem; white-space: pre; perspective: 500px; }
        .word-container { display: flex; }
        .letter { display: inline-block; opacity: 0; transform: translateX(0); transition: opacity 0.8s ease, transform 0.8s ease; }
        .animate .letter { opacity: 1; }
        .word-container.left .letter { transform: translateX(2em); }
        .word-container.right .letter { transform: translateX(-2em); }
        .animate .word-container .letter { transform: translateX(0); }
        .word-container.left .letter:last-child, .word-container.right .letter:first-child { transform: translateX(0); }
      `}</style>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#111', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 100, transition: 'opacity 1s ease', fontFamily: 'monospace' }}>
        <div className={`title-container ${startAnimation ? 'animate' : ''}`}>
          <div className="word-container left">{VIRTUAL.map((char, index) => (<span key={index} className="letter" style={{ transitionDelay: `${(VIRTUAL.length - 1 - index) * 0.15}s` }}>{char}</span>))}</div>
          <div style={{ width: '2rem' }} />
          <div className="word-container right">{MUSEUM.map((char, index) => (<span key={index} className="letter" style={{ transitionDelay: `${index * 0.15}s` }}>{char}</span>))}</div>
        </div>
        {showButton && (<button onClick={onStarted} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{ padding: '1rem 2rem', fontSize: '1.5rem', border: '2px solid white', borderRadius: '8px', cursor: 'pointer', opacity: showButton ? 1 : 0, transition: 'opacity 0.5s ease 0.5s, background 0.3s ease, color 0.3s ease', background: isHovered ? 'white' : 'transparent', color: isHovered ? '#111' : 'white' }}>Start the Tour</button>)}
      </div>
    </>
  );
}

// --- COMPONENT: A single Exhibit ---
function Exhibit({ modelData, onSelect, isNavigating, onShowDescription }) {
  const { scene } = useGLTF(modelData.url);
  const [hovered, setHovered] = useState(false);
  const clonedScene = scene.clone();
  const boxSize = modelData.boxSize || [3, 4, 3];
  const boxYOffset = modelData.boxYOffset || 0;

  const handleClick = () => {
    if (isNavigating) {
      onShowDescription(modelData);
    } else {
      onSelect(modelData);
    }
  };

  return (
    <group position={modelData.position}>
      <primitive object={clonedScene} scale={modelData.scale} rotation={modelData.rotation || [0, 0, 0]} />
      <Box args={boxSize} position={[0, (boxSize[1] / 2) + boxYOffset, 0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} onClick={handleClick}>
        <meshPhysicalMaterial color={hovered ? '#aaddff' : 'white'} transmission={1.0} roughness={0.1} thickness={0.1} transparent opacity={hovered ? 0.25 : 0.15} />
      </Box>
      {(isNavigating || hovered) && (
        <Html position={[0, boxSize[1] + boxYOffset + 0.5, 0]} center>
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', padding: '4px 8px', borderRadius: '5px', fontWeight: 'bold', fontFamily: 'sans-serif', fontSize: '8px', whiteSpace: 'nowrap' }}>
            {modelData.info}
          </div>
        </Html>
      )}
    </group>
  );
}

// --- COMPONENT: Player Controller with Collision and Description Logic ---
function PlayerControls({ exhibits, activeDescription, setActiveDescription }) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();

  const exhibitBounds = exhibits.map(exhibit => {
    const boxSize = exhibit.boxSize || [3, 4, 3];
    return new THREE.Box3(
      new THREE.Vector3(exhibit.position[0] - boxSize[0] / 2, 0, exhibit.position[2] - boxSize[2] / 2),
      new THREE.Vector3(exhibit.position[0] + boxSize[0] / 2, boxSize[1], exhibit.position[2] + boxSize[2] / 2)
    );
  });

  const wallBounds = [
    new THREE.Box3(new THREE.Vector3(-25, 0, -25.5), new THREE.Vector3(25, 20, -24.5)),
    new THREE.Box3(new THREE.Vector3(-25, 0, 24.5), new THREE.Vector3(25, 20, 25.5)),
    new THREE.Box3(new THREE.Vector3(-25.5, 0, -25), new THREE.Vector3(-24.5, 20, 25)),
    new THREE.Box3(new THREE.Vector3(24.5, 0, -25), new THREE.Vector3(25.5, 20, 25)),
  ];

  const allBounds = [...exhibitBounds, ...wallBounds];

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'ArrowUp': case 'KeyW': moveForward.current = true; break;
        case 'ArrowLeft': case 'KeyA': moveLeft.current = true; break;
        case 'ArrowDown': case 'KeyS': moveBackward.current = true; break;
        case 'ArrowRight': case 'KeyD': moveRight.current = true; break;
      }
    };
    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'ArrowUp': case 'KeyW': moveForward.current = false; break;
        case 'ArrowLeft': case 'KeyA': moveLeft.current = false; break;
        case 'ArrowDown': case 'KeyS': moveBackward.current = false; break;
        case 'ArrowRight': case 'KeyD': moveRight.current = false; break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    controlsRef.current?.lock();
    return () => { document.removeEventListener('keydown', handleKeyDown); document.removeEventListener('keyup', handleKeyUp); };
  }, []);

  useFrame((state, delta) => {
    if (controlsRef.current?.isLocked) {
      const playerPosition = camera.position;
      const prevPosition = playerPosition.clone();

      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;
      direction.z = Number(moveForward.current) - Number(moveBackward.current);
      direction.x = Number(moveRight.current) - Number(moveLeft.current);
      direction.normalize();

      if (moveForward.current || moveBackward.current) velocity.z -= direction.z * 80.0 * delta;
      if (moveLeft.current || moveRight.current) velocity.x -= direction.x * 80.0 * delta;

      controlsRef.current.moveRight(-velocity.x * delta);
      controlsRef.current.moveForward(-velocity.z * delta);

      const playerCollider = new THREE.Box3().setFromCenterAndSize(playerPosition, new THREE.Vector3(1, 2, 1));
      for (const bound of allBounds) {
        if (playerCollider.intersectsBox(bound)) {
          playerPosition.copy(prevPosition);
          velocity.set(0,0,0);
          break;
        }
      }

      if (activeDescription) {
        const exhibitPosition = new THREE.Vector3(...activeDescription.position);
        const distance = playerPosition.distanceTo(exhibitPosition);
        if (distance > 10) {
          setActiveDescription(null);
          return;
        }
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        const toExhibitDirection = exhibitPosition.clone().sub(playerPosition).normalize();
        const dotProduct = cameraDirection.dot(toExhibitDirection);
        if (dotProduct < 0.3) {
          setActiveDescription(null);
        }
      }
    }
  });

  return <PointerLockControls ref={controlsRef} />;
}


// --- COMPONENT: The Main Museum Scene ---
function MuseumScene({ onShowDescription, activeDescription, setActiveDescription }) {
  const { camera } = useThree();
  const [target, setTarget] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [floorTexture, wallTexture, ceilingTexture] = useTexture(['/textures/Onyx015_1K-JPG_Color.jpg', '/textures/Fabric081B_1K-JPG_Color.jpg', '/textures/Fabric082B_1K-JPG_Color.jpg']);
  [floorTexture, wallTexture, ceilingTexture].forEach(t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(10, 10); });
  wallTexture.repeat.set(20, 2);
  const initialCameraPosition = new THREE.Vector3(0, 5, 25);
  const wideAngleLookAt = new THREE.Vector3(0, 2, 0);

  useEffect(() => { camera.position.copy(initialCameraPosition); camera.lookAt(wideAngleLookAt); }, [camera]);

  const handleSelectExhibit = (exhibit) => {
    if (!isNavigating) {
      const targetPosition = new THREE.Vector3(exhibit.position[0], exhibit.position[1] + 1.5, exhibit.position[2] + 4);
      setTarget({ position: targetPosition, lookAt: new THREE.Vector3(...exhibit.position) });
    }
  };

  useFrame(() => {
    if (target) {
      camera.position.lerp(target.position, 0.05);
      const lookAtPoint = new THREE.Vector3().lerpVectors(camera.position, target.lookAt, 0.1);
      camera.lookAt(lookAtPoint);
      if (camera.position.distanceTo(target.position) < 0.1) { setTarget(null); setIsNavigating(true); }
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[20, 30, 10]} intensity={1.5} castShadow />
      <directionalLight position={[-20, 30, -10]} intensity={1} />
      <Box args={[50, 0.2, 50]} position={[0, -0.1, 0]}><meshStandardMaterial map={floorTexture} /></Box>
      <Box args={[50, 20, 0.2]} position={[0, 9.9, -25]}><meshStandardMaterial map={wallTexture} /></Box>
      <Box args={[50, 20, 0.2]} position={[0, 9.9, 25]}><meshStandardMaterial map={wallTexture} /></Box>
      <Box args={[0.2, 20, 50]} position={[-25, 9.9, 0]}><meshStandardMaterial map={wallTexture} /></Box>
      <Box args={[0.2, 20, 50]} position={[25, 9.9, 0]}><meshStandardMaterial map={wallTexture} /></Box>
      <Box args={[50, 0.2, 50]} position={[0, 20, 0]}><meshStandardMaterial map={ceilingTexture} /></Box>
      <Suspense fallback={null}>
        {exhibits.map((exhibit, index) => (
          <Exhibit key={index} modelData={exhibit} onSelect={handleSelectExhibit} isNavigating={isNavigating} onShowDescription={onShowDescription} />
        ))}
      </Suspense>
      {isNavigating ? <PlayerControls exhibits={exhibits} activeDescription={activeDescription} setActiveDescription={setActiveDescription} /> : <OrbitControls target={wideAngleLookAt} enablePan={false} enableZoom={false} />}
    </>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const [tourStarted, setTourStarted] = useState(false);
  const [activeDescription, setActiveDescription] = useState(null);

  useEffect(() => { exhibits.forEach(exhibit => useGLTF.preload(exhibit.url)); }, []);

  // Effect to handle keyboard shortcut for closing description
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.key === 'c' || event.key === 'C') && activeDescription) {
        setActiveDescription(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDescription]); // Re-run effect if activeDescription changes

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      {!tourStarted && <LoadingScreen onStarted={() => setTourStarted(true)} />}
      <Canvas shadows>
        {tourStarted && <MuseumScene onShowDescription={setActiveDescription} activeDescription={activeDescription} setActiveDescription={setActiveDescription} />}
      </Canvas>
      {activeDescription && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', zIndex: 101 }} onClick={() => setActiveDescription(null)}>
          <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0, 0, 0, 0.7)', color: 'white', padding: '20px', borderRadius: '10px', maxWidth: '300px', fontFamily: 'sans-serif' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>{activeDescription.info}</h2>
            <p>{activeDescription.description}</p>
            <button onClick={() => setActiveDescription(null)} style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>Close (C)</button>
          </div>
        </div>
      )}
      {tourStarted && !activeDescription && (
         <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: 'white', background: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: '10px', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <p>Click an exhibit to begin your tour.</p>
            <p>Once started: Use WASD/Arrow Keys to move. Use Mouse to look.</p>
         </div>
      )}
    </div>
  );
}
