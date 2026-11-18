# Coin Flip

A coin flip in the browser. A real one euro coin, photographed on both sides,
tossed in 3D — heads or tails, fifty-fifty.

The coin is tossed once when the page opens, and again every time you press
**Flip**. Each toss does five to seven full turns and always lands on the side
the toss picked, so the animation and the result never disagree.

## Run it

Node 24 or newer.

```bash
npm install
npm run dev          # http://localhost:8080
```

For a production build:

```bash
npm run build
npm start            # serves dist/ on $PORT (default 8080)
```

`npm run check` type-checks the project.

## How it works

- `Math.random() < 0.5` picks the side; nothing is sent to a server.
- The rotation is kept in a ref and only ever increases, so every toss starts
  where the last one stopped and ends on a full turn to the chosen face.
- `src/index.css` has the toss: the coin rises and falls while it `rotateY`s,
  with a ground shadow that shrinks and fades while it is in the air. The two
  faces are back-to-back `<img>` elements with `backface-visibility: hidden`.
- `prefers-reduced-motion` shortens the toss to 700 ms.
- Dark mode follows the operating system.

## Layout

| Path | What |
|------|------|
| `server/index.ts` | Serves `dist/` in production, Vite in development |
| `src/pages/home.tsx` | The app: the coin, the toss and the result |
| `src/components/app-shell.tsx` | The page frame and footer |
| `src/index.css` | Theme tokens and the coin animation |
| `src/config.ts` | The app's name |
| `public/assets/` | The two coin faces |

## Coin images

The faces are flat scans of a 1 euro coin — the German national side and the
common European side — from the Wikimedia Commons article on the 1 euro coin.
The coin designs are the property of the European Central Bank and the euro
area's national central banks. The MIT license below covers the code, not the
coin images.

## License

MIT — see [LICENSE](LICENSE).
