import type { QCConfiguration } from "./parser"

interface Point {
  x: number
  y: number
}

export interface RenderOptions {
  width?: number
  height?: number
  showLabels?: boolean
  nodeRadius?: number
}

const VIEWBOX_SIZE = 500
const VIEWBOX_CENTER = VIEWBOX_SIZE / 2
const OUTER_RADIUS = 205
const INNER_RADIUS = OUTER_RADIUS * 0.58
const EPSILON = 1e-10
const TUTTE_FALLBACK_STEPS = 96
const FOUR_COLOR_PALETTE = [ "#f94144", "#277da1", "#f9c74f", "#43aa8b" ]

const layoutCache = new WeakMap<QCConfiguration, Point[]>()
const cellCache = new WeakMap<QCConfiguration, Point[][]>()
const colorCache = new WeakMap<QCConfiguration, number[]>()

function createCoordinateBuffer(size: number) {
  return Array.from({ length: size }, () => ({
    x: VIEWBOX_CENTER,
    y: VIEWBOX_CENTER
  }))
}

function placeRingVertices(coords: Point[], ringSize: number) {
  for (let i = 1; i <= ringSize; i++) {
    const angle = -Math.PI / 2 + (2 * Math.PI * (i - 1)) / ringSize
    coords[i] = {
      x: VIEWBOX_CENTER + OUTER_RADIUS * Math.cos(angle),
      y: VIEWBOX_CENTER + OUTER_RADIUS * Math.sin(angle)
    }
  }
}

function seedInteriorVertices(cfg: QCConfiguration, coords: Point[]) {
  const countInner = cfg.vertexCount - cfg.ringSize

  if (countInner <= 0) {
    return
  }

  for (let i = 0; i < countInner; i++) {
    const vertexId = cfg.ringSize + 1 + i
    const angle = (2 * Math.PI * i) / countInner
    coords[vertexId] = {
      x: VIEWBOX_CENTER + INNER_RADIUS * Math.cos(angle),
      y: VIEWBOX_CENTER + INNER_RADIUS * Math.sin(angle)
    }
  }
}

function solveLinearSystem(matrix: number[][], rhs: number[]) {
  const size = matrix.length

  if (size === 0) {
    return []
  }

  const augmented = matrix.map((row, index) => [ ...row, rhs[index] ])

  for (let col = 0; col < size; col++) {
    let pivotRow = col

    for (let row = col + 1; row < size; row++) {
      if (Math.abs(augmented[row][col]) > Math.abs(augmented[pivotRow][col])) {
        pivotRow = row
      }
    }

    if (Math.abs(augmented[pivotRow][col]) < EPSILON) {
      return null
    }

    if (pivotRow !== col) {
      [ augmented[col], augmented[pivotRow] ] = [ augmented[pivotRow], augmented[col] ]
    }

    const pivot = augmented[col][col]

    for (let j = col; j <= size; j++) {
      augmented[col][j] /= pivot
    }

    for (let row = 0; row < size; row++) {
      if (row === col) {
        continue
      }

      const factor = augmented[row][col]

      if (Math.abs(factor) < EPSILON) {
        continue
      }

      for (let j = col; j <= size; j++) {
        augmented[row][j] -= factor * augmented[col][j]
      }
    }
  }

  return augmented.map((row) => row[size])
}

function applyTutteEmbedding(cfg: QCConfiguration, coords: Point[]) {
  const interiorCount = cfg.vertexCount - cfg.ringSize

  if (interiorCount <= 0) {
    return true
  }

  const interiorIds = Array.from(
    { length: interiorCount },
    (_, index) => cfg.ringSize + 1 + index
  )
  const rowOfVertex = new Map(interiorIds.map((vertexId, row) => [ vertexId, row ]))
  const matrix = Array.from({ length: interiorCount }, () => new Array(interiorCount).fill(0))
  const rhsX = new Array(interiorCount).fill(0)
  const rhsY = new Array(interiorCount).fill(0)

  for (const vertexId of interiorIds) {
    const row = rowOfVertex.get(vertexId)

    if (row == null) {
      return false
    }

    const vertex = cfg.vertices[vertexId - 1]
    matrix[row][row] = vertex.degree

    for (const neighborId of vertex.neighbors) {
      if (neighborId <= cfg.ringSize) {
        rhsX[row] += coords[neighborId].x
        rhsY[row] += coords[neighborId].y
        continue
      }

      const col = rowOfVertex.get(neighborId)

      if (col == null) {
        return false
      }

      matrix[row][col] -= 1
    }
  }

  const xs = solveLinearSystem(matrix, rhsX)
  const ys = solveLinearSystem(matrix, rhsY)

  if (xs == null || ys == null) {
    return false
  }

  for (let i = 0; i < interiorIds.length; i++) {
    const vertexId = interiorIds[i]
    coords[vertexId] = {
      x: xs[i],
      y: ys[i]
    }
  }

  return true
}

function relaxInteriorVertices(cfg: QCConfiguration, coords: Point[], steps = TUTTE_FALLBACK_STEPS) {
  const next = coords.map((point) => ({ ...point }))

  for (let step = 0; step < steps; step++) {
    for (let vertexId = cfg.ringSize + 1; vertexId <= cfg.vertexCount; vertexId++) {
      const vertex = cfg.vertices[vertexId - 1]
      let sumX = 0
      let sumY = 0

      for (const neighborId of vertex.neighbors) {
        sumX += coords[neighborId].x
        sumY += coords[neighborId].y
      }

      next[vertexId] = {
        x: sumX / vertex.degree,
        y: sumY / vertex.degree
      }
    }

    for (let vertexId = cfg.ringSize + 1; vertexId <= cfg.vertexCount; vertexId++) {
      coords[vertexId] = { ...next[vertexId] }
    }
  }
}

function tutteLayout(cfg: QCConfiguration) {
  const cached = layoutCache.get(cfg)

  if (cached) {
    return cached
  }

  const coords = createCoordinateBuffer(cfg.vertexCount + 1)

  placeRingVertices(coords, cfg.ringSize)
  seedInteriorVertices(cfg, coords)

  if (!applyTutteEmbedding(cfg, coords)) {
    relaxInteriorVertices(cfg, coords)
  }

  layoutCache.set(cfg, coords)
  return coords
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function midpoint(a: Point, b: Point) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2
  }
}

function samePoint(a: Point, b: Point) {
  return Math.abs(a.x - b.x) < EPSILON && Math.abs(a.y - b.y) < EPSILON
}

function triangleKey(a: number, b: number, c: number) {
  return [ a, b, c ].sort((left, right) => left - right).join(":")
}

function triangleIncenter(a: Point, b: Point, c: Point) {
  const weightA = distance(b, c)
  const weightB = distance(a, c)
  const weightC = distance(a, b)
  const totalWeight = weightA + weightB + weightC

  return {
    x: (weightA * a.x + weightB * b.x + weightC * c.x) / totalWeight,
    y: (weightA * a.y + weightB * b.y + weightC * c.y) / totalWeight
  }
}

function collectFaceIncenters(cfg: QCConfiguration, coords: Point[]) {
  const faceIncenters = new Map<string, Point>()

  for (const vertex of cfg.vertices) {
    const neighbors = vertex.neighbors
    const faceCount = vertex.id <= cfg.ringSize ? neighbors.length - 1 : neighbors.length

    for (let index = 0; index < faceCount; index++) {
      const left = neighbors[index]
      const right = neighbors[(index + 1) % neighbors.length]
      const key = triangleKey(vertex.id, left, right)

      if (!faceIncenters.has(key)) {
        faceIncenters.set(
          key,
          triangleIncenter(coords[vertex.id], coords[left], coords[right])
        )
      }
    }
  }

  return faceIncenters
}

function simplifyPolygon(points: Point[]) {
  if (points.length === 0) {
    return points
  }

  const simplified: Point[] = []

  for (const point of points) {
    if (simplified.length === 0 || !samePoint(simplified[simplified.length - 1], point)) {
      simplified.push(point)
    }
  }

  if (simplified.length > 1 && samePoint(simplified[0], simplified[simplified.length - 1])) {
    simplified.pop()
  }

  return simplified
}

function landsForConfiguration(cfg: QCConfiguration) {
  const cached = cellCache.get(cfg)

  if (cached) {
    return cached
  }

  const coords = tutteLayout(cfg)
  const faceIncenters = collectFaceIncenters(cfg, coords)
  const cells = Array.from({ length: cfg.vertexCount + 1 }, () => [] as Point[])

  for (const vertex of cfg.vertices) {
    const owner = coords[vertex.id]
    const polygon: Point[] = []

    for (let index = 0; index < vertex.neighbors.length; index++) {
      const neighborId = vertex.neighbors[index]
      polygon.push(midpoint(owner, coords[neighborId]))

      if (vertex.id <= cfg.ringSize && index === vertex.neighbors.length - 1) {
        continue
      }

      const nextNeighborId = vertex.neighbors[(index + 1) % vertex.neighbors.length]
      const incenter = faceIncenters.get(triangleKey(vertex.id, neighborId, nextNeighborId))

      if (!incenter) {
        throw new Error(`Missing triangle incenter for configuration ${cfg.name} at vertex ${vertex.id}`)
      }

      polygon.push(incenter)
    }

    if (vertex.id <= cfg.ringSize) {
      polygon.push(owner)
    }

    cells[vertex.id] = simplifyPolygon(polygon)

    if (cells[vertex.id].length < 3) {
      throw new Error(`Degenerate land polygon for configuration ${cfg.name} at vertex ${vertex.id}`)
    }
  }

  cellCache.set(cfg, cells)
  return cells
}

function getAvailableColors(cfg: QCConfiguration, colors: number[], vertexId: number) {
  const blocked = new Array(FOUR_COLOR_PALETTE.length).fill(false)

  for (const neighborId of cfg.vertices[vertexId - 1].neighbors) {
    const color = colors[neighborId]

    if (color >= 0) {
      blocked[color] = true
    }
  }

  const available: number[] = []

  for (let color = 0; color < FOUR_COLOR_PALETTE.length; color++) {
    if (!blocked[color]) {
      available.push(color)
    }
  }

  return available
}

function selectNextVertex(cfg: QCConfiguration, colors: number[]) {
  let bestVertexId = -1
  let bestSaturation = -1
  let bestDegree = -1

  for (const vertex of cfg.vertices) {
    if (colors[vertex.id] >= 0) {
      continue
    }

    const usedNeighborColors = new Set<number>()

    for (const neighborId of vertex.neighbors) {
      const color = colors[neighborId]

      if (color >= 0) {
        usedNeighborColors.add(color)
      }
    }

    const saturation = usedNeighborColors.size

    if (
      saturation > bestSaturation ||
      (saturation === bestSaturation && vertex.degree > bestDegree) ||
      (saturation === bestSaturation && vertex.degree === bestDegree && vertex.id < bestVertexId)
    ) {
      bestVertexId = vertex.id
      bestSaturation = saturation
      bestDegree = vertex.degree
    }
  }

  return bestVertexId
}

function colorWithFourColors(cfg: QCConfiguration, colors: number[]) {
  const vertexId = selectNextVertex(cfg, colors)

  if (vertexId < 0) {
    return true
  }

  const availableColors = getAvailableColors(cfg, colors, vertexId)

  for (const color of availableColors) {
    colors[vertexId] = color

    if (colorWithFourColors(cfg, colors)) {
      return true
    }

    colors[vertexId] = -1
  }

  return false
}

export function fourColoring(cfg: QCConfiguration) {
  const cached = colorCache.get(cfg)

  if (cached) {
    return cached
  }

  const colors = new Array(cfg.vertexCount + 1).fill(-1)

  if (!colorWithFourColors(cfg, colors)) {
    throw new Error(`No valid 4-coloring found for configuration ${cfg.name}`)
  }

  colorCache.set(cfg, colors)
  return colors
}

export function renderSVG(cfg: QCConfiguration, opts: RenderOptions = {}) {
  const width = opts.width ?? VIEWBOX_SIZE
  const height = opts.height ?? VIEWBOX_SIZE
  const showLabels = opts.showLabels ?? true
  const radius = opts.nodeRadius ?? 6
  const coords = tutteLayout(cfg)
  const lands = landsForConfiguration(cfg)
  const nodeColors = fourColoring(cfg)

  let countries = ""

  for (const vertex of cfg.vertices) {
    const fill = FOUR_COLOR_PALETTE[nodeColors[vertex.id]]
    const polygon = lands[vertex.id]
    const points = polygon.map((point) => `${point.x},${point.y}`).join(" ")
    countries += `<polygon points="${points}" fill="${fill}" fill-opacity="0.5" stroke="${fill}" stroke-opacity="0.3" stroke-width="1" />\n`
  }

  let edges = ""

  for (const vertex of cfg.vertices) {
    const p1 = coords[vertex.id]

    for (const neighborId of vertex.neighbors) {
      if (neighborId <= vertex.id) {
        continue
      }

      const p2 = coords[neighborId]
      edges += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#444" stroke-width="1" />\n`
    }
  }

  let nodes = ""

  for (const vertex of cfg.vertices) {
    const point = coords[vertex.id]
    const fill = FOUR_COLOR_PALETTE[nodeColors[vertex.id]]
    nodes += `<circle cx="${point.x}" cy="${point.y}" r="${radius}" fill="${fill}" stroke="#111" stroke-width="1.25" />\n`

    if (showLabels) {
      nodes += `<text x="${point.x + 8}" y="${point.y + 4}" font-size="10" fill="#111">${vertex.id}</text>\n`
    }
  }

  return `<?xml version="1.0"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}" xmlns="http://www.w3.org/2000/svg">
${countries}
${edges}
${nodes}
</svg>`
}

export function renderHTML(cfg: QCConfiguration) {
  const svg = renderSVG(cfg)
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${cfg.name}</title>
</head>
<body>
${svg}
</body>
</html>`
}

export function renderAll(configs: QCConfiguration[]) {
  return configs.map((cfg) => ({
    name: cfg.name,
    svg: renderSVG(cfg)
  }))
}
