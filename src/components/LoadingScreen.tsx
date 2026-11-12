import { useEffect, useState } from 'react';

const WORD = 'BOARDING';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function FlapTile({ target, delayMs }: { target: string; delayMs: number }) {
  const [char, setChar] = useState(prefersReducedMotion ? target : ' ');
  const [settled, setSettled] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;
    let frame = 0;
    const totalFrames = 8 + Math.round(delayMs / 40);
    const id = setInterval(() => {
      frame += 1;
      if (frame >= totalFrames) {
        setChar(target);
        setSettled(true);
        clearInterval(id);
      } else {
        setChar(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);
      }
    }, 45);
    return () => clearInterval(id);
  }, [target, delayMs]);

  return <span className={`flap-tile${settled ? ' flap-tile--settled' : ''}`}>{char}</span>;
}

export function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-live="polite" aria-label="Loading seat map">
      <div className="flap-row">
        {WORD.split('').map((letter, i) => (
          <FlapTile key={i} target={letter} delayMs={i * 90} />
        ))}
      </div>
      <p className="loading-caption">Fetching your flight</p>
    </div>
  );
}
