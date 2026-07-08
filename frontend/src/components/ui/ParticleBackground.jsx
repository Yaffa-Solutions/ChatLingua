import { useEffect, useRef, useCallback } from 'react';

const COLORS = [
  'rgba(185, 28, 28, ALPHA)',
  'rgba(217, 119, 6, ALPHA)',
  'rgba(234, 88, 12, ALPHA)',
  'rgba(249, 115, 22, ALPHA)',
];

function useParticleAnimation(canvasRef) {
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const initParticles = useCallback((width, height) => {
    const count = Math.min(Math.floor((width * height) / 12000), 60);
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particlesRef.current = initParticles(width, height);
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const particles = particlesRef.current;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.x -= dx * 0.003;
          p.y -= dy * 0.003;
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('ALPHA', p.alpha);
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouse);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [canvasRef, initParticles]);
}

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  useParticleAnimation(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
