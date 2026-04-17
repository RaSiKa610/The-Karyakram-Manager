"use client";

import { useEffect, useState } from 'react';

// A four-pointed royal star/sparkle SVG
const SparkleIcon = () => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M256,0C256,141.3 370.7,256 512,256C370.7,256 256,370.7 256,512C256,370.7 141.3,256 0,256C141.3,256 256,141.3 256,0Z" />
  </svg>
);

export default function FallingClovers() {
  const [clovers, setClovers] = useState<{ id: number; left: string; size: string; duration: string; delay: string; rotationStart: number; rotationEnd: number }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate random clovers
    const newClovers = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      size: `${Math.random() * 20 + 20}px`,
      duration: `${Math.random() * 15 + 10}s`, // fall speed
      delay: `${Math.random() * -25}s`, // negative delay so they start immediately
      rotationStart: Math.random() * 360,
      rotationEnd: Math.random() * 360 + 360
    }));
    setClovers(newClovers);
  }, []);

  if (!mounted) return null;

  return (
    <div className="clover-container" aria-hidden="true">
      {clovers.map(clover => (
        <div
          key={clover.id}
          className="clover"
          style={{
            left: clover.left,
            width: clover.size,
            height: clover.size,
            animationDuration: clover.duration,
            animationDelay: clover.delay,
            '--rot-start': `${clover.rotationStart}deg`,
            '--rot-end': `${clover.rotationEnd}deg`,
          } as React.CSSProperties}
        >
          <SparkleIcon />
        </div>
      ))}
    </div>
  );
}
