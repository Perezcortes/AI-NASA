'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Mesh, SphereGeometry, MeshStandardMaterial } from 'three';

// Tipos para los componentes de Three.js
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

const Planet = ({ name }: { name: string }) => {
  // Configuraciones de planetas
  const planetConfigs: Record<string, { size: number; color: string; texture?: string }> = {
    mercury: { size: 0.4, color: '#A9A9A9' },
    venus: { size: 0.6, color: '#E6C229' },
    earth: { size: 0.6, color: '#3498db' },
    mars: { size: 0.5, color: '#e74c3c' },
    jupiter: { size: 1.2, color: '#f39c12' },
    saturn: { size: 1.0, color: '#f1c40f' },
    uranus: { size: 0.8, color: '#1abc9c' },
    neptune: { size: 0.8, color: '#3498db' }
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