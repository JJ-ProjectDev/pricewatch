// CSS can't bend a single div along an S-curve, so the curve is approximated
// as a chain of short, overlapping "capsule" segments (thin pill divs), each
// rotated to match the curve's tangent at that point. The neon look comes
// from a single box-shadow per segment: tight+bright near the core, wider
// and more transparent further out. Positions/angles are sampled from the
// same cubic-bezier path used by the previous SVG version, so the S-curve
// shape (bottom-centre -> right -> left -> top-right corner) is unchanged.
// left/top are percentages of the viewport; length/height are px, so the
// glow keeps its intended thickness regardless of viewport size.
const SEGMENTS = [
  { left: 52.18, top: 113.57, length: 134, angle: -41.7 },
  { left: 56.18, top: 107.41, length: 122, angle: -46.3 },
  { left: 59.46, top: 101.34, length: 110, angle: -52.4 },
  { left: 61.97, top: 95.34, length: 99, angle: -60.5 },
  { left: 63.65, top: 89.4, length: 90, angle: -71.2 },
  { left: 64.47, top: 83.51, length: 85, angle: -84.3 },
  { left: 64.36, top: 77.65, length: 85, angle: -99 },
  { left: 63.29, top: 71.81, length: 92, angle: -113.3 },
  { left: 61.04, top: 66.36, length: 99, angle: -132.6 },
  { left: 57.46, top: 61.95, length: 112, angle: -151.1 },
  { left: 52.79, top: 58.66, length: 124, angle: -160.9 },
  { left: 47.52, top: 56.12, length: 130, angle: -165.5 },
  { left: 42.13, top: 53.98, length: 126, angle: -166.5 },
  { left: 37.12, top: 51.86, length: 113, angle: -163.7 },
  { left: 32.97, top: 49.41, length: 92, angle: -154.7 },
  { left: 30.17, top: 46.25, length: 69, angle: -131.6 },
  { left: 29.12, top: 42.27, length: 63, angle: -92.1 },
  { left: 29.89, top: 37.78, length: 77, angle: -60.3 },
  { left: 32.32, top: 33.09, length: 101, angle: -42.9 },
  { left: 36.19, top: 28.34, length: 125, angle: -33.1 },
  { left: 41.29, top: 23.68, length: 147, angle: -26.8 },
  { left: 47.44, top: 19.24, length: 164, angle: -22 },
  { left: 54.42, top: 15.18, length: 178, angle: -18.1 },
  { left: 62.03, top: 11.63, length: 187, angle: -14.5 },
  { left: 68.58, top: 9.04, length: 123, angle: -13 },
  { left: 73.79, top: 7.05, length: 124, angle: -13.7 },
  { left: 79.02, top: 4.95, length: 124, angle: -14.4 },
  { left: 84.26, top: 2.74, length: 126, angle: -15.2 },
  { left: 89.54, top: 0.39, length: 127, angle: -15.9 },
  { left: 94.85, top: -2.09, length: 128, angle: -16.6 },
  { left: 100.21, top: -4.7, length: 130, angle: -17.4 },
  { left: 105.61, top: -7.47, length: 132, angle: -18.1 },
]

const NEON_GLOW = [
  '0 0 20px 10px #10b981',
  '0 0 60px 30px #10b981',
  '0 0 120px 60px rgba(16,185,129,0.4)',
  '0 0 200px 100px rgba(16,185,129,0.15)',
].join(', ')

export default function BackgroundWave() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ filter: 'blur(18px)' }}
    >
      {SEGMENTS.map((segment, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-primary"
          style={{
            left: `${segment.left}%`,
            top: `${segment.top}%`,
            width: `${segment.length}px`,
            height: '4px',
            transform: `translate(-50%, -50%) rotate(${segment.angle}deg)`,
            boxShadow: NEON_GLOW,
            opacity: 0.1,
          }}
        />
      ))}
    </div>
  )
}
