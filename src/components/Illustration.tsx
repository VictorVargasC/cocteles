import { useId } from 'react'
import type { Garnish, Glass, IllustrationSpec } from '../types'

interface GlassShape {
  /** Contorno abierto (o cerrado si `closed`) */
  d: string
  closed?: boolean
  /** Línea del tallo/base, solo trazo */
  extra?: string
  /** Nivel superior del líquido y fondo */
  top: number
  bottom: number
  /** Borde superior del vaso: y, x izquierda, x derecha */
  rim: { y: number; l: number; r: number }
  /** Asa (solo trazo) */
  handle?: string
}

const GLASSES: Record<Glass, GlassShape> = {
  highball: {
    d: 'M34 26 L38 142 Q38.5 148 45 148 L75 148 Q81.5 148 82 142 L86 26',
    top: 40,
    bottom: 148,
    rim: { y: 26, l: 34, r: 86 },
  },
  rocks: {
    d: 'M24 62 L31 142 Q32 148 39 148 L81 148 Q88 148 89 142 L96 62',
    top: 74,
    bottom: 148,
    rim: { y: 62, l: 24, r: 96 },
  },
  coupe: {
    d: 'M20 56 Q20 98 60 102 Q100 98 100 56',
    closed: true,
    extra: 'M60 102 V140 M40 146 H80',
    top: 62,
    bottom: 102,
    rim: { y: 56, l: 20, r: 100 },
  },
  martini: {
    d: 'M18 42 L102 42 L60 98',
    closed: true,
    extra: 'M60 98 V140 M40 146 H80',
    top: 52,
    bottom: 98,
    rim: { y: 42, l: 18, r: 102 },
  },
  margarita: {
    d: 'M14 46 H106 Q102 82 66 86 L54 86 Q18 82 14 46',
    closed: true,
    extra: 'M60 86 V140 M40 146 H80',
    top: 56,
    bottom: 86,
    rim: { y: 46, l: 14, r: 106 },
  },
  hurricane: {
    d: 'M40 24 C28 56 46 74 54 90 L54 132 L42 146 L78 146 L66 132 L66 90 C74 74 92 56 80 24',
    closed: true,
    top: 40,
    bottom: 146,
    rim: { y: 24, l: 40, r: 80 },
  },
  wine: {
    d: 'M32 38 Q30 92 60 96 Q90 92 88 38',
    closed: true,
    extra: 'M60 96 V140 M40 146 H80',
    top: 52,
    bottom: 96,
    rim: { y: 38, l: 32, r: 88 },
  },
  mug: {
    d: 'M30 40 L34 142 Q35 148 42 148 L72 148 Q79 148 80 142 L84 40',
    closed: true,
    handle: 'M83 58 H96 Q106 58 106 70 V108 Q106 120 96 120 H82',
    top: 52,
    bottom: 148,
    rim: { y: 40, l: 30, r: 84 },
  },
  shot: {
    d: 'M40 92 L44 144 Q45 150 51 150 L69 150 Q75 150 76 144 L80 92',
    top: 100,
    bottom: 150,
    rim: { y: 92, l: 40, r: 80 },
  },
  tall: {
    d: 'M40 20 L43 142 Q43.5 148 50 148 L70 148 Q76.5 148 77 142 L80 20',
    top: 34,
    bottom: 148,
    rim: { y: 20, l: 40, r: 80 },
  },
  goblet: {
    d: 'M22 50 Q14 108 60 112 Q106 108 98 50',
    closed: true,
    extra: 'M60 112 V138 M42 146 H78',
    top: 62,
    bottom: 112,
    rim: { y: 50, l: 22, r: 98 },
  },
  flute: {
    d: 'M46 22 L49 100 Q50 108 60 108 Q70 108 71 100 L74 22',
    extra: 'M60 108 V140 M42 146 H78',
    top: 34,
    bottom: 108,
    rim: { y: 22, l: 46, r: 74 },
  },
}

const INK = 'var(--ill-ink)'
const SW = 3.5

function Wheel({ x, y, rind, fill }: { x: number; y: number; rind: string; fill: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={12} fill={rind} stroke={INK} strokeWidth={2.5} />
      <circle cx={x} cy={y} r={8.5} fill={fill} />
      <path
        d={`M${x} ${y - 8.5} V${y + 8.5} M${x - 8.5} ${y} H${x + 8.5} M${x - 6} ${y - 6} L${x + 6} ${y + 6} M${x + 6} ${y - 6} L${x - 6} ${y + 6}`}
        stroke={rind}
        strokeWidth={1.2}
      />
    </g>
  )
}

function GarnishShape({
  kind,
  shape,
  cx,
}: {
  kind: Garnish
  shape: GlassShape
  cx: number
}) {
  const { rim, top } = shape
  switch (kind) {
    case 'lime':
      return <Wheel x={rim.r - 4} y={rim.y + 2} rind="#6aa834" fill="#cfe58a" />
    case 'lemon':
      return <Wheel x={rim.r - 4} y={rim.y + 2} rind="#e8c22c" fill="#fbe98a" />
    case 'orange':
      return <Wheel x={rim.r - 4} y={rim.y + 2} rind="#ef8a1f" fill="#f9c56a" />
    case 'strawberry':
      return (
        <g transform={`translate(${rim.r - 4} ${rim.y + 2})`}>
          <path
            d="M0 12 C-14 2 -12 -10 0 -8 C12 -10 14 2 0 12Z"
            fill="#e0424f"
            stroke={INK}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          <path d="M-5 -9 L0 -14 L5 -9" fill="none" stroke="#4d9a3a" strokeWidth={3} strokeLinecap="round" />
        </g>
      )
    case 'pineapple':
      return (
        <g transform={`translate(${rim.r - 6} ${rim.y + 2})`}>
          <path d="M-6 -6 L0 -20 L6 -6" fill="none" stroke="#4d9a3a" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-12 -4 H12 L4 14 H-4Z" fill="#f6cf45" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        </g>
      )
    case 'mint':
      return (
        <g stroke={INK} strokeWidth={2} fill="#6dbb5b">
          <ellipse cx={cx - 8} cy={rim.y - 8} rx={5} ry={10} transform={`rotate(-30 ${cx - 8} ${rim.y - 8})`} />
          <ellipse cx={cx + 2} cy={rim.y - 12} rx={5} ry={10} transform={`rotate(8 ${cx + 2} ${rim.y - 12})`} />
          <ellipse cx={cx + 11} cy={rim.y - 7} rx={5} ry={9} transform={`rotate(38 ${cx + 11} ${rim.y - 7})`} />
        </g>
      )
    case 'cherry':
      return (
        <g transform={`translate(${rim.l + 14} ${rim.y - 4})`}>
          <path d="M0 -2 Q6 -16 14 -20" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={0} cy={2} r={7} fill="#c4262e" stroke={INK} strokeWidth={2.5} />
        </g>
      )
    case 'umbrella': {
      const px = cx + 4
      const y = rim.y
      return (
        <g>
          <path d={`M${px - 3} ${y + 12} L${px + 4} ${y - 24}`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <path
            d={`M${px - 10} ${y - 20} Q${px + 4} ${y - 40} ${px + 18} ${y - 22} Q${px + 11} ${y - 26} ${px + 4} ${y - 22} Q${px - 3} ${y - 26} ${px - 10} ${y - 20}Z`}
            fill="#ff8fa3"
            stroke={INK}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        </g>
      )
    }
    case 'salt': {
      const dots: number[] = []
      for (let x = rim.l + 3; x <= rim.r - 3; x += 7) dots.push(x)
      return (
        <g fill="#ffffff" stroke={INK} strokeWidth={1}>
          {dots.map((x, i) => (
            <circle key={x} cx={x} cy={rim.y - 2 + (i % 2 ? 2 : -1)} r={2.2} />
          ))}
        </g>
      )
    }
    case 'olive':
      return (
        <g>
          <path d={`M${cx - 14} ${rim.y - 8} L${cx + 6} ${top + 22}`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={cx + 2} cy={top + 15} r={7} fill="#8fae3d" stroke={INK} strokeWidth={2.5} />
          <circle cx={cx + 3} cy={top + 15} r={2.4} fill="#d9413b" />
        </g>
      )
    case 'celery':
      return (
        <g strokeLinecap="round">
          <path d={`M${cx + 8} ${top + 14} L${cx + 16} ${rim.y - 26}`} stroke={INK} strokeWidth={8} />
          <path d={`M${cx + 8} ${top + 14} L${cx + 16} ${rim.y - 26}`} stroke="#8cc665" strokeWidth={4} />
          <path d={`M${cx + 16} ${rim.y - 26} l-8 -8 M${cx + 16} ${rim.y - 26} l8 -8`} stroke="#4d9a3a" strokeWidth={3} />
        </g>
      )
    case 'twist':
      return (
        <g fill="none" strokeLinecap="round">
          <path
            d={`M${cx - 14} ${rim.y - 16} C${cx - 6} ${rim.y - 26} ${cx + 6} ${rim.y - 8} ${cx - 2} ${rim.y + 2} S${cx - 14} ${rim.y + 12} ${cx - 6} ${rim.y + 20}`}
            stroke={INK}
            strokeWidth={6}
          />
          <path
            d={`M${cx - 14} ${rim.y - 16} C${cx - 6} ${rim.y - 26} ${cx + 6} ${rim.y - 8} ${cx - 2} ${rim.y + 2} S${cx - 14} ${rim.y + 12} ${cx - 6} ${rim.y + 20}`}
            stroke="#f4b73a"
            strokeWidth={3}
          />
        </g>
      )
    case 'berries':
      return (
        <g>
          <path d={`M${rim.l + 10} ${rim.y - 14} L${rim.l + 18} ${rim.y + 12}`} stroke={INK} strokeWidth={2} strokeLinecap="round" />
          <circle cx={rim.l + 9} cy={rim.y - 12} r={5} fill="#b02a4a" stroke={INK} strokeWidth={2} />
          <circle cx={rim.l + 16} cy={rim.y - 6} r={5} fill="#7a2450" stroke={INK} strokeWidth={2} />
          <circle cx={rim.l + 12} cy={rim.y + 2} r={5} fill="#b02a4a" stroke={INK} strokeWidth={2} />
        </g>
      )
    case 'whipcream':
      return (
        <g>
          <path
            d={`M${cx - 16} ${top + 3} Q${cx - 18} ${top - 8} ${cx - 6} ${top - 8} Q${cx - 4} ${top - 20} ${cx + 4} ${top - 16} Q${cx + 16} ${top - 16} ${cx + 14} ${top - 6} Q${cx + 20} ${top} ${cx + 16} ${top + 3} Z`}
            fill="#fffaf0"
            stroke={INK}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        </g>
      )
    case 'banana':
      return (
        <g transform={`translate(${rim.r - 16} ${rim.y - 2})`}>
          <path d="M0 0 Q12 -14 26 -4 Q14 8 0 0Z" fill="#f8dc5a" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M6 -2 Q13 -7 20 -3" fill="none" stroke="#d8b53a" strokeWidth={1.5} />
        </g>
      )
    case 'onion':
      return (
        <g>
          <path d={`M${cx - 14} ${rim.y - 8} L${cx + 6} ${top + 22}`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={cx + 2} cy={top + 15} r={6.5} fill="#f6f1e4" stroke={INK} strokeWidth={2.5} />
          <circle cx={cx + 2} cy={top + 15} r={2.5} fill="none" stroke="#cdbfa0" strokeWidth={1.5} />
        </g>
      )
    case 'coffee':
      return (
        <g fill="#3b2418" stroke={INK} strokeWidth={1.5}>
          <ellipse cx={cx - 9} cy={top + 3} rx={5} ry={3.3} transform={`rotate(-20 ${cx - 9} ${top + 3})`} />
          <ellipse cx={cx} cy={top + 1} rx={5} ry={3.3} />
          <ellipse cx={cx + 9} cy={top + 3} rx={5} ry={3.3} transform={`rotate(20 ${cx + 9} ${top + 3})`} />
        </g>
      )
    case 'cinnamon':
      return (
        <g strokeLinecap="round">
          <path d={`M${cx - 4} ${top + 30} L${cx + 14} ${rim.y - 14}`} stroke={INK} strokeWidth={8} />
          <path d={`M${cx - 4} ${top + 30} L${cx + 14} ${rim.y - 14}`} stroke="#a5642f" strokeWidth={4} />
        </g>
      )
  }
}

/** Ilustración vectorial plana de un cóctel. Colores definidos por variables CSS para el tema. */
export function Illustration({ spec, className }: { spec: IllustrationSpec; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const shape = GLASSES[spec.glass]
  const cx = (shape.rim.l + shape.rim.r) / 2
  const liquidH = shape.bottom - shape.top
  const totalW = spec.layers.reduce((s, [, w]) => s + w, 0)

  // capas de abajo hacia arriba
  let y = shape.bottom
  const rects = spec.layers.map(([color, w], i) => {
    const h = (w / totalW) * liquidH
    y -= h
    return <rect key={i} x={0} y={y - 0.5} width={120} height={h + 1} fill={color} />
  })

  // [x, y, rotación, tamaño]
  let iceCubes: number[][] = []
  if (spec.ice === 'big') {
    iceCubes = [[cx - 13, shape.top + 4, -6, 26]]
  } else if (spec.ice === 'crushed') {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 6; col++) {
        iceCubes.push([cx - 24 + col * 8 + (row % 2) * 4, shape.top + 1 + row * 9, ((row * 7 + col * 13) % 40) - 20, 7.5])
      }
    }
  } else if (spec.ice) {
    iceCubes = [
      [cx - 15, shape.top + 6, -12, 15],
      [cx + 6, shape.top + 3, 10, 15],
      [cx - 5, shape.top + 26, 4, 15],
      [cx + 12, shape.top + 30, -8, 15],
    ]
  }

  const topColor = spec.layers[spec.layers.length - 1][0]
  const bubbles: [number, number, number][] = spec.bubbles
    ? [
        [cx - 6, shape.bottom - 8, 2],
        [cx + 5, shape.bottom - 22, 1.6],
        [cx - 2, shape.top + 30, 2.2],
        [cx + 7, shape.top + 16, 1.6],
        [cx - 8, shape.top + 12, 1.4],
        [cx + 2, shape.top + 6, 1.8],
        [cx + 9, shape.top + 40, 1.4],
      ].filter(([, by]) => by < shape.bottom - 2 && by > shape.top) as [number, number, number][]
    : []

  const strawStart = { x: cx + 6, y: shape.top + 34 }
  const strawEnd = { x: cx + 24, y: shape.rim.y - 26 }

  const outline = shape.closed ? `${shape.d} Z` : shape.d

  return (
    <svg
      className={className}
      viewBox="0 0 120 160"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={`clip-${uid}`}>
          <path d={`${shape.d} Z`} />
        </clipPath>
      </defs>

      {/* vaso (relleno suave) */}
      <path d={`${shape.d} Z`} fill="var(--ill-glass)" stroke="none" />

      <g clipPath={`url(#clip-${uid})`}>
        {rects}
        {spec.foam && (
          <rect x={0} y={shape.top - 2} width={120} height={9} fill="#fbf6e9" opacity={0.95} />
        )}
        {iceCubes.map(([x, yy, r, size], i) => (
          <rect
            key={i}
            x={x}
            y={yy}
            width={size}
            height={size}
            rx={size > 20 ? 5 : 2.5}
            transform={`rotate(${r} ${x + size / 2} ${yy + size / 2})`}
            fill="#ffffff"
            fillOpacity={size > 20 ? 0.4 : 0.55}
            stroke="#ffffff"
            strokeOpacity={0.9}
            strokeWidth={size > 20 ? 2 : 1.2}
          />
        ))}
        {bubbles.map(([bx, by, r], i) => (
          <circle key={i} cx={bx} cy={by} r={r} fill="none" stroke="#ffffff" strokeOpacity={0.85} strokeWidth={1.2} />
        ))}
        {/* brillo */}
        <rect x={shape.rim.l + 5} y={shape.top + 4} width={4} height={liquidH * 0.55} rx={2} fill="#fff" opacity={0.28} />
      </g>

      {spec.frozen && (
        <g>
          <path
            d={`M${shape.rim.l + 6} ${shape.top + 6} Q${shape.rim.l + 4} ${shape.top - 6} ${cx - 10} ${shape.top - 8} Q${cx} ${shape.top - 20} ${cx + 10} ${shape.top - 8} Q${shape.rim.r - 4} ${shape.top - 6} ${shape.rim.r - 6} ${shape.top + 6} Z`}
            fill={topColor}
            stroke={INK}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          <g fill="#ffffff" opacity={0.7}>
            <circle cx={cx - 12} cy={shape.top - 1} r={1.6} />
            <circle cx={cx + 3} cy={shape.top - 8} r={1.8} />
            <circle cx={cx + 14} cy={shape.top - 1} r={1.4} />
          </g>
        </g>
      )}

      {spec.straw && (
        <g strokeLinecap="round">
          <path d={`M${strawStart.x} ${strawStart.y} L${strawEnd.x} ${strawEnd.y}`} stroke={INK} strokeWidth={7} />
          <path d={`M${strawStart.x} ${strawStart.y} L${strawEnd.x} ${strawEnd.y}`} stroke="var(--ill-straw)" strokeWidth={3.5} />
        </g>
      )}

      {/* contorno */}
      <g fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
        <path d={outline} />
        {shape.extra && <path d={shape.extra} />}
        {shape.handle && <path d={shape.handle} />}
      </g>

      {spec.garnish?.map((g) => (
        <GarnishShape key={g} kind={g} shape={shape} cx={cx} />
      ))}
    </svg>
  )
}
