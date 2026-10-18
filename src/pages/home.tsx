import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Side = "heads" | "tails";

// Length of one spin, in milliseconds. Keep in sync with the CSS fallback.
const SPIN_MS = 3200;

export function HomePage() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Side | null>(null);

  // The total rotation ever applied, so every spin starts from where the last
  // one stopped and always finishes on a full turn to the chosen face.
  const rotationRef = useRef(0);

  const flip = useCallback(() => {
    if (spinning) return;

    const side: Side = Math.random() < 0.5 ? "heads" : "tails";
    const current = rotationRef.current;
    const currentMod = ((current % 360) + 360) % 360;
    const targetMod = side === "tails" ? 180 : 0;
    const delta = (targetMod - currentMod + 360) % 360;
    const spins = 5 + Math.floor(Math.random() * 3);
    const next = current + spins * 360 + delta;

    rotationRef.current = next;
    setResult(null);
    setSpinning(true);
    setRotation(next);
  }, [spinning]);

  const handleLanded = useCallback(() => {
    setSpinning(false);
    const currentMod = ((rotationRef.current % 360) + 360) % 360;
    setResult(currentMod === 180 ? "tails" : "heads");
  }, []);

  const label = result === "heads" ? "Heads" : result === "tails" ? "Tails" : "";

  return (
    <section className="flex flex-col items-center gap-10">
      <p
        aria-live="polite"
        className="h-6 text-lg font-semibold tracking-tight text-muted-foreground"
      >
        {label}
      </p>

      <div className="coin-scene relative aspect-square w-56 sm:w-64">
        <div className={`coin-toss${spinning ? " is-spinning" : ""}`}>
          <div
            className="coin"
            style={{ transform: `rotateY(${rotation}deg)` }}
            onTransitionEnd={(event) => {
              if (event.propertyName === "transform") handleLanded();
            }}
          >
            <img
              src="/assets/coin-heads.webp"
              alt="Heads: the bust of George Washington on a quarter"
              draggable={false}
              className="coin__face [filter:drop-shadow(0_16px_22px_rgb(0_0_0/0.28))]"
            />
            <img
              src="/assets/coin-tails.webp"
              alt="Tails: the eagle on the reverse of a quarter"
              draggable={false}
              className="coin__face coin__face--back [filter:drop-shadow(0_16px_22px_rgb(0_0_0/0.28))]"
            />
          </div>
        </div>
        <div className={`coin-shadow${spinning ? " is-spinning" : ""}`} aria-hidden />
      </div>

      <Button size="lg" onClick={flip} disabled={spinning} className="min-w-32">
        {spinning ? "Flipping…" : "Flip"}
      </Button>
    </section>
  );
}
