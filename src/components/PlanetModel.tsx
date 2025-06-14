'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const Planet = ({ name }: { name: string }) => {
  const planetConfigs: Record<string, { size: number; color: string }> = {
    'mercurio': { size: 0.4, color: '#A9A9A9' },
    'venus': { size: 0.6, color: '#E6C229' },
    'tierra': { size: 0.6, color: '#3498db' },
    'marte': { size: 0.5, color: '#e74c3c' },
    'jupiter': { size: 1.2, color: '#f39c12' },
    'saturno': { size: 1.0, color: '#f1c40f' },
    'urano': { size: 0.8, color: '#1abc9c' },
    'neptuno': { size: 0.8, color: '#3498db' }
  };

  const config = planetConfigs[name.toLowerCase()] || { size: 1, color: '#FFFFFF' };

  return (
    <mesh>
      <sphereGeometry args={[config.size, 32, 32]} />
      <meshStandardMaterial 
        color={new THREE.Color(config.color)} 
        roughness={0.8}
        metalness={0.2}
      />
      {name.toLowerCase() === 'saturno' && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[config.size * 1.5, config.size * 1.7, 32]} />
          <meshStandardMaterial 
            color={new THREE.Color(0xdddddd)}
            roughness={0.5}
            metalness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </mesh>
  );
};

export default function PlanetModel({ planetName }: { planetName: string }) {
  return (
    <div className="w-full h-96">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Planet name={planetName} />
          <OrbitControls 
            enableZoom={false}
            autoRotate
            autoRotateSpeed={2}
          />
          <Stars radius={100} depth={50} count={5000} factor={4} />
        </Suspense>
      </Canvas>
    </div>
  );
}