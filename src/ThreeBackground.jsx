import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const W = window.innerWidth;
    const H = window.innerHeight;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
    camera.position.z = 30;

    // ── Colors ──
    const colors = [0xff6b6b, 0xffd93d, 0x4d96ff, 0x6bcb77, 0xc77dff];

    // ── 1. Floating Icosahedra ──
    const meshes = [];
    for (let i = 0; i < 18; i++) {
      const geo = new THREE.IcosahedronGeometry(
        Math.random() * 1.8 + 0.4, 0
      );
      const mat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        wireframe: Math.random() > 0.5,
        transparent: true,
        opacity: Math.random() * 0.35 + 0.1,
        emissive: colors[i % colors.length],
        emissiveIntensity: 0.3,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 70,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 40
      );
      mesh.userData = {
        speedX: (Math.random() - 0.5) * 0.005,
        speedY: (Math.random() - 0.5) * 0.005,
        speedZ: (Math.random() - 0.5) * 0.003,
        floatAmp: Math.random() * 0.02 + 0.005,
        floatSpeed: Math.random() * 0.5 + 0.3,
        offset: Math.random() * Math.PI * 2,
      };
      scene.add(mesh);
      meshes.push(mesh);
    }

    // ── 2. Torus Knots ──
    const knots = [];
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.TorusKnotGeometry(
        Math.random() * 2 + 1,
        Math.random() * 0.4 + 0.15,
        80, 16,
        Math.floor(Math.random() * 3) + 2,
        Math.floor(Math.random() * 3) + 3
      );
      const mat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        emissive: colors[i % colors.length],
        emissiveIntensity: 0.5,
      });
      const knot = new THREE.Mesh(geo, mat);
      knot.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 5
      );
      knot.userData = {
        speedX: (Math.random() - 0.5) * 0.004,
        speedY: (Math.random() - 0.5) * 0.004,
        speedZ: (Math.random() - 0.5) * 0.002,
      };
      scene.add(knot);
      knots.push(knot);
    }

    // ── 3. Particle Field ──
    const particleCount = 1200;
    const positions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);
    const threeColors = colors.map(c => new THREE.Color(c));
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      const c = threeColors[Math.floor(Math.random() * threeColors.length)];
      pColors[i * 3]     = c.r;
      pColors[i * 3 + 1] = c.g;
      pColors[i * 3 + 2] = c.b;
    }
    const pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pgeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));
    const pmat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(pgeo, pmat);
    scene.add(particles);

    // ── 4. Ring Grid ──
    const rings = [];
    for (let i = 0; i < 5; i++) {
      const geo = new THREE.TorusGeometry(
        Math.random() * 8 + 4, 0.04, 8, 60
      );
      const mat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.12,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      ring.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 10
      );
      ring.userData = {
        rx: (Math.random() - 0.5) * 0.003,
        ry: (Math.random() - 0.5) * 0.003,
      };
      scene.add(ring);
      rings.push(ring);
    }

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const pl1 = new THREE.PointLight(0xff6b6b, 2, 80);
    pl1.position.set(20, 20, 10);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0x4d96ff, 2, 80);
    pl2.position.set(-20, -15, 5);
    scene.add(pl2);
    const pl3 = new THREE.PointLight(0xc77dff, 1.5, 60);
    pl3.position.set(0, 0, 20);
    scene.add(pl3);

    // ── Mouse parallax ──
    let mouseX = 0, mouseY = 0;
    const onMouse = e => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    // ── Scroll reaction ──
    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll);

    // ── Resize ──
    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animate ──
    let frame;
    const clock = new THREE.Clock();
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // camera parallax + scroll
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.03;
      camera.position.z = 30 + scrollY * 0.01;
      camera.lookAt(scene.position);

      // floating icosahedra
      meshes.forEach(m => {
        m.rotation.x += m.userData.speedX;
        m.rotation.y += m.userData.speedY;
        m.rotation.z += m.userData.speedZ;
        m.position.y += Math.sin(t * m.userData.floatSpeed + m.userData.offset) * m.userData.floatAmp;
      });

      // torus knots
      knots.forEach(k => {
        k.rotation.x += k.userData.speedX;
        k.rotation.y += k.userData.speedY;
        k.rotation.z += k.userData.speedZ;
      });

      // rings
      rings.forEach(r => {
        r.rotation.x += r.userData.rx;
        r.rotation.y += r.userData.ry;
      });

      // particle drift
      particles.rotation.y = t * 0.015;
      particles.rotation.x = t * 0.008;

      // point light pulse
      pl1.position.x = Math.sin(t * 0.4) * 25;
      pl1.position.y = Math.cos(t * 0.3) * 20;
      pl2.position.x = Math.cos(t * 0.35) * 25;
      pl2.position.y = Math.sin(t * 0.45) * 20;
      pl3.intensity = 1.5 + Math.sin(t * 1.2) * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
