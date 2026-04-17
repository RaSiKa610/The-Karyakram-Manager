"use client";

import { useEffect, useState } from 'react';

// A realistic 4-leaf clover SVG path
const CloverIcon = () => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M260.6,220.2c-15.6-28.7-18.7-65.4-8-96.1c11.9-34.1,36.5-62.8,69.5-73.6c31.1-10.2,65.3-4.5,91.8,12.7c31.8,20.6,50.7,56.5,50.8,94.2c0,35.6-16.7,68.9-46,88.7c-29.3,19.9-66.2,25.4-101.3,17.4C298.5,259.1,274.6,243.6,260.6,220.2z" />
    <path d="M305,263c26.2,20.1,60.8,26.9,92.5,18.4c34.5-9.2,65.4-32.5,78.2-66.2c12-31.5,7.7-67.6-11.4-95.2c-22.9-33.1-62-50.6-102.1-46.7c-37.1,3.6-70.6,22.2-88.7,53.8C255.4,158.5,251,200.7,268.6,236.4C275.5,250.4,288.7,250.5,305,263z" />
    <path d="M248.5,280c-2.3,31-16.5,61.6-40.4,82.4c-26.6,23.3-64,32.7-98.3,23.8c-32.9-8.5-62-31.1-73-64.4c-12-36-4-76.3,20.8-105.1c25-29,63.5-43,101.6-38.3C196.4,183,231,202.9,248.5,236C255,248.4,249,268,248.5,280z" />
    <path d="M217.4,275c-28.7,23.7-65.7,35-101.4,27.1c-37.5-8.3-70.9-32.9-84.6-69.8c-12.8-34.6-4.5-75.1,20.9-102.4c25.4-27.3,64.2-39.7,100.8-34.1c34.8,5.4,65.5,25.6,83.1,55.9c16.3,28,16.5,62.8,4.1,91.8C235.8,255.1,228.7,268.7,217.4,275z" />
    <path d="M261.5,267.5c1.4,43.2-6.5,88.2-28.1,126c-17.6,30.8-43.5,57.1-75.2,74c-12,6.4-17.7,23.1-7.2,33.3c7.5,7.3,19.3,8.7,27.6,2.2c35.6-27.7,65-62.8,85-103.3C287.4,351,291.8,296,275.1,248.7c-3.1-8.7-14.7-10.7-20.7-3.7C250.7,250,260.6,259.9,261.5,267.5z" />
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
          <CloverIcon />
        </div>
      ))}
    </div>
  );
}
