'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * CinematicLayer
 * ----------------
 * A transparent, GPU-light Three.js overlay that renders slow-drifting
 * warm bokeh particles with additive blending and subtle mouse parallax.
 * Designed to sit above the hero video and behind the foreground content,
 * adding atmospheric depth without competing for attention.
 *
 * Performance notes:
 * - Particle count is reduced on small / low-power screens.
 * - Geometry & material are built once and disposed on unmount.
 * - Animation uses a single requestAnimationFrame loop driven by a clock,
 *   so motion speed is independent of frame rate.
 * - Respects `prefers-reduced-motion` by slowing motion to near-static.
 */
export default function CinematicLayer({ className }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // ---- Scene / camera / renderer -------------------------------------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // ---- Soft circular sprite texture (procedural, no asset needed) ----
    const spriteTexture = (() => {
      const size = 128;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.25, 'rgba(255,255,255,0.7)');
      gradient.addColorStop(0.6, 'rgba(255,255,255,0.12)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    })();

    // ---- Particle field ---------------------------------------------
    const isSmallScreen = mount.clientWidth < 768;
    const particleCount = isSmallScreen ? 45 : 100;

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount * 2); // x, y phase offsets
    const speeds = new Float32Array(particleCount);

    // Warm palette with rare cool monitor-blue accents for depth contrast
    const warmWhite = new THREE.Color('#fff4e6');
    const amber = new THREE.Color('#ffb873');
    const ember = new THREE.Color('#ff7a33');
    const monitorBlue = new THREE.Color('#5b86ad');

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 26; // x
      positions[i3 + 1] = (Math.random() - 0.5) * 16; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 14; // z

      const roll = Math.random();
      const color =
        roll < 0.08
          ? monitorBlue
          : roll < 0.4
          ? warmWhite
          : roll < 0.75
          ? amber
          : ember;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 1.6 + 0.4;
      phases[i * 2] = Math.random() * Math.PI * 2;
      phases[i * 2 + 1] = Math.random() * Math.PI * 2;
      speeds[i] = Math.random() * 0.4 + 0.15;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.9,
      map: spriteTexture,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      opacity: 0.85,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Base position cache for sine-wave drift (avoid recomputing origin)
    const basePositions = positions.slice();

    // ---- Mouse parallax state ------------------------------------------
    const mouse = { x: 0, y: 0 };
    const targetCameraOffset = { x: 0, y: 0 };
    const currentCameraOffset = { x: 0, y: 0 };

    function handlePointerMove(e) {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetCameraOffset.x = mouse.x * (prefersReducedMotion ? 0.3 : 1.4);
      targetCameraOffset.y = -mouse.y * (prefersReducedMotion ? 0.2 : 0.9);
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // ---- Resize handling -------------------------------------------------
    function handleResize() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', handleResize);

    // ---- Animation loop (delta-time driven) -------------------------------
    const clock = new THREE.Clock();
    let rafId;
    const motionScale = prefersReducedMotion ? 0.08 : 1;

    function animate() {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      const posAttr = geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const phaseX = phases[i * 2];
        const phaseY = phases[i * 2 + 1];
        const speed = speeds[i] * motionScale;

        posAttr.array[i3] =
          basePositions[i3] + Math.sin(elapsed * speed + phaseX) * 1.1;
        posAttr.array[i3 + 1] =
          basePositions[i3 + 1] +
          Math.cos(elapsed * speed * 0.8 + phaseY) * 0.8;
        posAttr.array[i3 + 2] =
          basePositions[i3 + 2] + Math.sin(elapsed * speed * 0.5 + phaseX) * 0.6;
      }
      posAttr.needsUpdate = true;

      // Smooth (lerped) camera parallax drift
      currentCameraOffset.x += (targetCameraOffset.x - currentCameraOffset.x) * 0.04;
      currentCameraOffset.y += (targetCameraOffset.y - currentCameraOffset.y) * 0.04;
      camera.position.x = currentCameraOffset.x;
      camera.position.y = currentCameraOffset.y;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    // ---- Cleanup: dispose every GPU resource ------------------------------
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      spriteTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  );
}
