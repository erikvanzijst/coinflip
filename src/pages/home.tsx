import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Side = "heads" | "tails";

const HEADS_SRC = "/assets/coin-heads.webp";
const TAILS_SRC = "/assets/coin-tails.webp";
const COIN_FACES = [HEADS_SRC, TAILS_SRC];

export function HomePage() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Side | null>(null);

  // The total rotation ever applied, so every spin starts from where the last
  // one stopped and always finishes on a full turn to the chosen face.
  const rotationRef = useRef(0);

  // In a ref as well as in state: `flip` stays stable, and a click that lands
  // in the same tick as the end of a spin cannot start a second one.
  const spinningRef = useRef(false);
  const autoFlipped = useRef(false);

  const flip = useCallback(() => {
    if (spinningRef.current) return;

    const side: Side = Math.random() < 0.5 ? "heads" : "tails";
    const current = rotationRef.current;
    const currentMod = ((current % 360) + 360) % 360;
    const targetMod = side === "tails" ? 180 : 0;
    const delta = (targetMod - currentMod + 360) % 360;
    const spins = 5 + Math.floor(Math.random() * 3);
    const next = current + spins * 360 + delta;

    spinningRef.current = true;
    rotationRef.current = next;
    setResult(null);
    setSpinning(true);
    setRotation(next);
  }, []);

  const handleLanded = useCallback(() => {
    spinningRef.current = false;
    setSpinning(false);
    const currentMod = ((rotationRef.current % 360) + 360) % 360;
    setResult(currentMod === 180 ? "tails" : "heads");
  }, []);

  // Toss the coin once on arrival: the flip is the whole app, so nobody should
  // have to find the button to see it. Waits for both faces to decode — but no
  // longer than a moment — so the first spin is never a pair of empty images.
  // The guard keeps it to one toss, including React's double-run in development.
  useEffect(() => {
    if (autoFlipped.current) return;
    autoFlipped.current = true;

    const faces = COIN_FACES.map((src) => {
      const image = new Image();
      image.src = src;
      return image.decode().catch(() => undefined);
    });
    const ready = Promise.race([
      Promise.all(faces),
      new Promise((resolve) => setTimeout(resolve, 800)),
    ]);

    // A beat on the resting coin first, so the page does not blur past before
    // the eye finds it.
    void ready.then(() => setTimeout(flip, 320));
  }, [flip]);

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
              src={HEADS_SRC}
              alt="Heads: the Vitruvian Man on the Italian one euro coin"
              draggable={false}
              className="coin__face [filter:drop-shadow(0_16px_22px_rgb(0_0_0/0.28))]"
            />
            <img
              src={TAILS_SRC}
              alt="Tails: the common side of the one euro coin, with the map of Europe"
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
