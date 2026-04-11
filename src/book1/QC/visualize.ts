import type { QCConfiguration } from "./parser"

interface Point {
  x: number
  y: number
}

interface BoundaryPoint extends Point {
  boundaryOffset: number
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
const FOUR_COLOR_PALETTE = [
  "rgb(var(--v-theme-error))",
  "rgb(var(--v-theme-primary))",
  "rgb(var(--v-theme-warning))",
  "rgb(var(--v-theme-success))"
]
const EDGE_COLOR = "rgb(var(--v-theme-on-surface))"
const LABEL_COLOR = "rgb(var(--v-theme-on-surface))"
const NODE_STROKE_COLOR = "rgba(var(--v-theme-on-surface), 0.82)"

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

function scale(point: Point, factor: number) {
  return {
    x: point.x * factor,
    y: point.y * factor
  }
}

function subtract(a: Point, b: Point) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  }
}

function dot(a: Point, b: Point) {
  return a.x * b.x + a.y * b.y
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

function perimeterOffset(point: Point) {
  if (Math.abs(point.y) < EPSILON) {
    return point.x
  }

  if (Math.abs(point.x - VIEWBOX_SIZE) < EPSILON) {
    return VIEWBOX_SIZE + point.y
  }

  if (Math.abs(point.y - VIEWBOX_SIZE) < EPSILON) {
    return 2 * VIEWBOX_SIZE + (VIEWBOX_SIZE - point.x)
  }

  return 3 * VIEWBOX_SIZE + (VIEWBOX_SIZE - point.y)
}

function rayToBoundary(origin: Point, direction: Point) {
  const candidates: BoundaryPoint[] = []

  if (Math.abs(direction.x) > EPSILON) {
    const tx0 = (0 - origin.x) / direction.x
    const tx1 = (VIEWBOX_SIZE - origin.x) / direction.x

    if (tx0 > EPSILON) {
      const y = origin.y + tx0 * direction.y

      if (y >= -EPSILON && y <= VIEWBOX_SIZE + EPSILON) {
        const point = {
          x: 0,
          y: Math.min(VIEWBOX_SIZE, Math.max(0, y))
        }
        candidates.push({
          ...point,
          boundaryOffset: perimeterOffset(point)
        })
      }
    }

    if (tx1 > EPSILON) {
      const y = origin.y + tx1 * direction.y

      if (y >= -EPSILON && y <= VIEWBOX_SIZE + EPSILON) {
        const point = {
          x: VIEWBOX_SIZE,
          y: Math.min(VIEWBOX_SIZE, Math.max(0, y))
        }
        candidates.push({
          ...point,
          boundaryOffset: perimeterOffset(point)
        })
      }
    }
  }

  if (Math.abs(direction.y) > EPSILON) {
    const ty0 = (0 - origin.y) / direction.y
    const ty1 = (VIEWBOX_SIZE - origin.y) / direction.y

    if (ty0 > EPSILON) {
      const x = origin.x + ty0 * direction.x

      if (x >= -EPSILON && x <= VIEWBOX_SIZE + EPSILON) {
        const point = {
          x: Math.min(VIEWBOX_SIZE, Math.max(0, x)),
          y: 0
        }
        candidates.push({
          ...point,
          boundaryOffset: perimeterOffset(point)
        })
      }
    }

    if (ty1 > EPSILON) {
      const x = origin.x + ty1 * direction.x

      if (x >= -EPSILON && x <= VIEWBOX_SIZE + EPSILON) {
        const point = {
          x: Math.min(VIEWBOX_SIZE, Math.max(0, x)),
          y: VIEWBOX_SIZE
        }
        candidates.push({
          ...point,
          boundaryOffset: perimeterOffset(point)
        })
      }
    }
  }

  if (candidates.length === 0) {
    throw new Error("Ray does not hit the boundary")
  }

  return candidates.reduce((best, candidate) => {
    const bestDistance = distance(origin, best)
    const candidateDistance = distance(origin, candidate)
    return candidateDistance < bestDistance ? candidate : best
  })
}

function outwardBisectorBoundary(owner: Point, neighbor: Point) {
  const mid = midpoint(owner, neighbor)
  let direction = {
    x: neighbor.y - owner.y,
    y: owner.x - neighbor.x
  }
  const outward = subtract(mid, { x: VIEWBOX_CENTER, y: VIEWBOX_CENTER })

  if (dot(direction, outward) < 0) {
    direction = scale(direction, -1)
  }

  return rayToBoundary(mid, direction)
}

function clockwiseDistance(start: number, end: number) {
  const perimeter = 4 * VIEWBOX_SIZE
  return (end - start + perimeter) % perimeter
}

function clockwiseContains(start: number, end: number, target: number) {
  return clockwiseDistance(start, target) <= clockwiseDistance(start, end)
}

function boundaryCornersClockwise() {
  return [
    { x: VIEWBOX_SIZE, y: 0, boundaryOffset: VIEWBOX_SIZE },
    { x: VIEWBOX_SIZE, y: VIEWBOX_SIZE, boundaryOffset: 2 * VIEWBOX_SIZE },
    { x: 0, y: VIEWBOX_SIZE, boundaryOffset: 3 * VIEWBOX_SIZE },
    { x: 0, y: 0, boundaryOffset: 4 * VIEWBOX_SIZE }
  ]
}

function boundaryPath(start: BoundaryPoint, end: BoundaryPoint, through: BoundaryPoint) {
  const useClockwise = clockwiseContains(start.boundaryOffset, end.boundaryOffset, through.boundaryOffset)
  const corners = boundaryCornersClockwise()
  const path: Point[] = []

  if (useClockwise) {
    for (const corner of corners) {
      if (clockwiseDistance(start.boundaryOffset, corner.boundaryOffset) < clockwiseDistance(start.boundaryOffset, end.boundaryOffset)) {
        path.push({ x: corner.x, y: corner.y })
      }
    }
  } else {
    for (let index = corners.length - 1; index >= 0; index--) {
      const corner = corners[index]

      if (clockwiseDistance(end.boundaryOffset, corner.boundaryOffset) < clockwiseDistance(end.boundaryOffset, start.boundaryOffset)) {
        path.push({ x: corner.x, y: corner.y })
      }
    }
  }

  path.push({ x: end.x, y: end.y })
  return path
}

function signedTriangleArea(a: Point, b: Point, c: Point) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
}

function triangleCircumcenter(a: Point, b: Point, c: Point) {
  const d = 2 * (
    a.x * (b.y - c.y) +
    b.x * (c.y - a.y) +
    c.x * (a.y - b.y)
  )

  if (Math.abs(d) < EPSILON) {
    return null
  }

  const a2 = a.x * a.x + a.y * a.y
  const b2 = b.x * b.x + b.y * b.y
  const c2 = c.x * c.x + c.y * c.y

  return {
    x: (
      a2 * (b.y - c.y) +
      b2 * (c.y - a.y) +
      c2 * (a.y - b.y)
    ) / d,
    y: (
      a2 * (c.x - b.x) +
      b2 * (a.x - c.x) +
      c2 * (b.x - a.x)
    ) / d
  }
}

function pointInTriangle(point: Point, a: Point, b: Point, c: Point) {
  const area1 = signedTriangleArea(point, a, b)
  const area2 = signedTriangleArea(point, b, c)
  const area3 = signedTriangleArea(point, c, a)
  const hasNegative = area1 < -EPSILON || area2 < -EPSILON || area3 < -EPSILON
  const hasPositive = area1 > EPSILON || area2 > EPSILON || area3 > EPSILON

  return !(hasNegative && hasPositive)
}

function preferredTriangleCenter(a: Point, b: Point, c: Point) {
  const circumcenter = triangleCircumcenter(a, b, c)

  if (circumcenter && pointInTriangle(circumcenter, a, b, c)) {
    return circumcenter
  }

  return triangleIncenter(a, b, c)
}

function collectFaceCenters(cfg: QCConfiguration, coords: Point[]) {
  const faceCenters = new Map<string, Point>()

  for (const vertex of cfg.vertices) {
    const neighbors = vertex.neighbors
    const faceCount = vertex.id <= cfg.ringSize ? neighbors.length - 1 : neighbors.length

    for (let index = 0; index < faceCount; index++) {
      const left = neighbors[index]
      const right = neighbors[(index + 1) % neighbors.length]
      const key = triangleKey(vertex.id, left, right)

      if (!faceCenters.has(key)) {
        faceCenters.set(
          key,
          preferredTriangleCenter(coords[vertex.id], coords[left], coords[right])
        )
      }
    }
  }

  return faceCenters
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
  const faceCenters = collectFaceCenters(cfg, coords)
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
      const faceCenter = faceCenters.get(triangleKey(vertex.id, neighborId, nextNeighborId))

      if (!faceCenter) {
        throw new Error(`Missing triangle center for configuration ${cfg.name} at vertex ${vertex.id}`)
      }

      polygon.push(faceCenter)
    }

    if (vertex.id <= cfg.ringSize) {
      const nextRingBoundary = outwardBisectorBoundary(owner, coords[vertex.neighbors[0]])
      const prevRingBoundary = outwardBisectorBoundary(owner, coords[vertex.neighbors[vertex.neighbors.length - 1]])
      const ownerBoundary = rayToBoundary(owner, subtract(owner, { x: VIEWBOX_CENTER, y: VIEWBOX_CENTER }))

      polygon.push({ x: prevRingBoundary.x, y: prevRingBoundary.y })
      polygon.push(...boundaryPath(prevRingBoundary, nextRingBoundary, ownerBoundary))
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
    countries += `<polygon points="${points}" fill="${fill}" fill-opacity="0.5" stroke="${fill}" stroke-opacity="0.28" stroke-width="1" />\n`
  }

  let edges = ""

  for (const vertex of cfg.vertices) {
    const p1 = coords[vertex.id]

    for (const neighborId of vertex.neighbors) {
      if (neighborId <= vertex.id) {
        continue
      }

      const p2 = coords[neighborId]
      edges += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${EDGE_COLOR}" stroke-opacity="0.7" stroke-width="1" />\n`
    }
  }

  let nodes = ""

  for (const vertex of cfg.vertices) {
    const point = coords[vertex.id]
    const fill = FOUR_COLOR_PALETTE[nodeColors[vertex.id]]
    nodes += `<circle cx="${point.x}" cy="${point.y}" r="${radius}" fill="${fill}" stroke="${NODE_STROKE_COLOR}" stroke-width="1.25" />\n`

    if (showLabels) {
      nodes += `<text x="${point.x + 8}" y="${point.y + 4}" font-size="10" fill="${LABEL_COLOR}">${vertex.id}</text>\n`
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
