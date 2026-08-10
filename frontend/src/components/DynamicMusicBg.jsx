import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import * as THREE from 'three';

const MUSIC_SIGNS = ['♪', '♫', '♩', '♬', '♭', '♯', '🎼', '🎶', '🎤', '🎧', '🔊', '🎷', '🎸', '🎹'];

export default function DynamicMusicBg() {
  const canvasRef = useRef(null);
  const [floatingSigns, setFloatingSigns] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const colors = ['#d0bcff', '#2fd9f4', '#bec6e0', '#a078ff', '#00fbff'];
      const signsCount = window.innerWidth < 768 ? 16 : 28;

      const generated = Array.from({ length: signsCount }).map((_, i) => {
        const symbol = MUSIC_SIGNS[i % MUSIC_SIGNS.length];
        const left = `${(i * 100) / signsCount + ((i * 7) % 8) - 4}%`;
        const top = `${(i * 90) / signsCount + ((i * 13) % 12) + 2}%`;
        const fontSize = 16 + (i % 5) * 6;
        const color = colors[i % colors.length];
        const opacity = 0.14 + (i % 4) * 0.05;
        const duration = 16 + (i % 6) * 4;
        const delay = (i % 7) * 1.2;
        const blur = i % 3 === 0 ? 1.5 : 0;
        const floatY = -35 - (i % 4) * 15;
        const floatX = (i % 2 === 0 ? 1 : -1) * (12 + (i % 5) * 6);
        const rotateDeg = (i % 2 === 0 ? 1 : -1) * (15 + (i % 6) * 8);

        return {
          id: i,
          symbol,
          left,
          top,
          fontSize,
          color,
          opacity,
          duration,
          delay,
          blur,
          floatY,
          floatX,
          rotateDeg,
        };
      });

      setFloatingSigns(generated);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#15121b', 0.035);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight('#201a2e', 1.2);
    scene.add(ambientLight);

    const purpleLight = new THREE.PointLight('#d0bcff', 3.5, 30);
    purpleLight.position.set(-6, 4, 6);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight('#2fd9f4', 3.0, 30);
    cyanLight.position.set(6, -4, 5);
    scene.add(cyanLight);

    const musicGroup = new THREE.Group();
    scene.add(musicGroup);

    // Vinyl Record
    const vinylGroup = new THREE.Group();
    const discGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.08, 64);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x110f18,
      roughness: 0.3,
      metalness: 0.8,
    });
    const discMesh = new THREE.Mesh(discGeo, discMat);
    discMesh.rotation.x = Math.PI / 3;
    vinylGroup.add(discMesh);

    const ringGeo = new THREE.RingGeometry(0.8, 2.0, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x2d263b,
      side: THREE.DoubleSide,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    ringMesh.position.y = 0.045;
    vinylGroup.add(ringMesh);

    const labelGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.09, 32);
    const labelMat = new THREE.MeshStandardMaterial({
      color: 0x2fd9f4,
      emissive: 0x3c0091,
      emissiveIntensity: 0.5,
      roughness: 0.2,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.rotation.x = Math.PI / 3;
    vinylGroup.add(labelMesh);

    const holeGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x15121b });
    const holeMesh = new THREE.Mesh(holeGeo, holeMat);
    holeMesh.rotation.x = Math.PI / 3;
    vinylGroup.add(holeMesh);

    vinylGroup.position.set(6.5, 3.2, -2);
    musicGroup.add(vinylGroup);

    // 3D Notes
    const createNoteMesh = (colorHex, emissiveHex) => {
      const noteGroup = new THREE.Group();
      const headGeo = new THREE.SphereGeometry(0.45, 16, 16);
      headGeo.scale(1.3, 0.85, 0.7);
      const noteMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: emissiveHex,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.6,
      });
      const head = new THREE.Mesh(headGeo, noteMat);
      head.rotation.z = Math.PI / 6;
      noteGroup.add(head);

      const stemGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.6, 16);
      const stem = new THREE.Mesh(stemGeo, noteMat);
      stem.position.set(0.45, 0.75, 0);
      noteGroup.add(stem);

      const flagGeo = new THREE.BoxGeometry(0.5, 0.25, 0.06);
      const flag = new THREE.Mesh(flagGeo, noteMat);
      flag.position.set(0.65, 1.45, 0);
      flag.rotation.z = -Math.PI / 8;
      noteGroup.add(flag);

      return noteGroup;
    };

    const note1 = createNoteMesh(0xd0bcff, 0xa078ff);
    note1.position.set(-6.8, 2.5, -1);
    note1.scale.set(1.2, 1.2, 1.2);
    musicGroup.add(note1);

    const note2 = createNoteMesh(0x2fd9f4, 0x009fb4);
    note2.position.set(5.5, -3.5, 1);
    note2.rotation.z = -Math.PI / 6;
    note2.scale.set(0.9, 0.9, 0.9);
    musicGroup.add(note2);

    // Sonic Wireframe Orb
    const orbGroup = new THREE.Group();
    const orbGeo = new THREE.IcosahedronGeometry(1.2, 2);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0xd0bcff,
      wireframe: true,
      emissive: 0x6d3bd7,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.6,
    });
    const orbMesh = new THREE.Mesh(orbGeo, orbMat);
    orbGroup.add(orbMesh);

    const coreGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x2fd9f4,
      transparent: true,
      opacity: 0.4,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    orbGroup.add(coreMesh);

    const ring1Geo = new THREE.TorusGeometry(1.8, 0.02, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x2fd9f4,
      transparent: true,
      opacity: 0.7,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 4;
    orbGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.3, 0.015, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xd0bcff,
      transparent: true,
      opacity: 0.5,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3;
    orbGroup.add(ring2);

    orbGroup.position.set(-5.5, -3.2, 0);
    musicGroup.add(orbGroup);

    // Polyhedrons
    const polyGroup = new THREE.Group();
    const polyGeos = [
      new THREE.OctahedronGeometry(0.5),
      new THREE.DodecahedronGeometry(0.4),
      new THREE.TetrahedronGeometry(0.45),
    ];

    const polyPositions = [
      { x: -3.2, y: 4.5, z: -4, color: 0xd0bcff },
      { x: 2.8, y: -4.8, z: -3, color: 0x2fd9f4 },
      { x: 0.5, y: 5.2, z: -5, color: 0xbec6e0 },
      { x: -7.5, y: -0.5, z: -4, color: 0xa078ff },
    ];

    const polys = [];
    polyPositions.forEach((pos, idx) => {
      const geo = polyGeos[idx % polyGeos.length];
      const mat = new THREE.MeshStandardMaterial({
        color: pos.color,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pos.x, pos.y, pos.z);
      polyGroup.add(mesh);
      polys.push(mesh);
    });
    musicGroup.add(polyGroup);

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX * 0.8;
      camera.position.y = -mouseY * 0.8;
      camera.lookAt(0, 0, 0);

      vinylGroup.rotation.y = elapsedTime * 0.5;
      vinylGroup.rotation.z = Math.sin(elapsedTime * 0.8) * 0.1;
      vinylGroup.position.y = 3.2 + Math.sin(elapsedTime * 1.2) * 0.25;

      note1.rotation.y = elapsedTime * 0.7;
      note1.rotation.x = Math.cos(elapsedTime * 0.6) * 0.2;
      note1.position.y = 2.5 + Math.sin(elapsedTime * 1.5) * 0.3;

      note2.rotation.y = -elapsedTime * 0.6;
      note2.position.y = -3.5 + Math.cos(elapsedTime * 1.3) * 0.25;

      orbMesh.rotation.x = elapsedTime * 0.3;
      orbMesh.rotation.y = elapsedTime * 0.4;
      ring1.rotation.z = elapsedTime * 0.6;
      ring2.rotation.x = -elapsedTime * 0.5;
      orbGroup.position.y = -3.2 + Math.sin(elapsedTime * 1.1) * 0.2;

      polys.forEach((poly, i) => {
        poly.rotation.x = elapsedTime * (0.4 + i * 0.1);
        poly.rotation.y = elapsedTime * (0.3 + i * 0.15);
        poly.position.y += Math.sin(elapsedTime * 1.4 + i) * 0.002;
      });

      purpleLight.intensity = 3.2 + Math.sin(elapsedTime * 2.0) * 0.6;
      cyanLight.intensity = 2.8 + Math.cos(elapsedTime * 2.2) * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
      />

      <div className="absolute top-1/4 left-1/5 w-[420px] h-[420px] bg-primary/12 rounded-full blur-[110px] animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-1/4 right-1/5 w-[450px] h-[450px] bg-tertiary/10 rounded-full blur-[130px] animate-pulse duration-[10000ms]" />
      <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-secondary/8 rounded-full blur-[100px] animate-pulse duration-[7000ms]" />

      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(21, 18, 27, 0.45) 0%, rgba(21, 18, 27, 0.88) 85%, rgba(21, 18, 27, 0.98) 100%)'
        }}
      />

      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {floatingSigns.map((item) => (
          <motion.div
            key={item.id}
            className="absolute font-sans font-bold select-none cursor-pointer pointer-events-auto transition-colors"
            style={{
              left: item.left,
              top: item.top,
              fontSize: `${item.fontSize}px`,
              color: item.color,
              opacity: item.opacity,
              filter: `drop-shadow(0 0 10px ${item.color}66) blur(${item.blur}px)`,
            }}
            animate={{
              y: [0, item.floatY, 0],
              x: [0, item.floatX, 0],
              rotate: [0, item.rotateDeg, -item.rotateDeg, 0],
              opacity: [item.opacity, item.opacity * 1.6, item.opacity],
            }}
            whileHover={{
              scale: 1.65,
              opacity: 1,
              rotate: 360,
              filter: `drop-shadow(0 0 25px ${item.color}) blur(0px)`,
              transition: { duration: 0.4 },
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: 'easeInOut',
            }}
          >
            {item.symbol}
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20 flex items-end justify-between px-2 overflow-hidden z-0">
        {Array.from({ length: 54 }).map((_, i) => {
          const delay = (i * 0.12) % 2.5;
          const duration = 1.1 + (i % 5) * 0.3;
          return (
            <motion.div
              key={i}
              className="w-[1.4%] rounded-t-sm bg-gradient-to-t from-primary via-tertiary to-transparent"
              initial={{ height: '4px' }}
              animate={{
                height: [
                  '6px',
                  `${12 + (i % 7) * 14}px`,
                  `${35 + (i % 4) * 22}px`,
                  '10px',
                  `${22 + (i % 6) * 16}px`,
                  '4px',
                ],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: delay,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(rgba(208,188,255,0.03)_1px,transparent_1px)] [background-size:28px_28px] opacity-60 z-0" />
    </div>
  );
}
