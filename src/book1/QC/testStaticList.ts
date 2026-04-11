import confText from './U_2822.conf?raw'
import type { QCConfiguration } from './parser'
import { parseU2822Conf } from './parser'

export interface StaticListSummary {
  count: number
  firstName: string | null
  lastName: string | null
  maxVertexCount: number
  minVertexCount: number
  maxRingSize: number
  minRingSize: number
  totalContractPairs: number
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

function hasEdge(cfg: QCConfiguration, u: number, v: number): boolean {
  return cfg.vertices[u - 1]?.neighbors.includes(v) ?? false
}

function validateStaticList(configs: QCConfiguration[]): void {
  assert(configs.length === 2822, `Expected 2822 configurations, got ${configs.length}`)

  const names = new Set<string>()

  configs.forEach((cfg, index) => {
    assert(!names.has(cfg.name), `Duplicate configuration name: ${cfg.name}`)
    names.add(cfg.name)

    const numericName = Number(cfg.name)
    assert(Number.isFinite(numericName), `Configuration name is not numeric: ${cfg.name}`)
    assert(numericName === index + 1, `Expected configuration ${index + 1}, got ${cfg.name}`)

    assert(cfg.coordinates.length === cfg.vertexCount, `Coordinate length mismatch in ${cfg.name}`)
    assert(cfg.contractPairs.length === cfg.contractRaw[0], `Contract pair count mismatch in ${cfg.name}`)

    cfg.contractPairs.forEach(([u, v], pairIndex) => {
      assert(u >= 1 && u <= cfg.vertexCount, `Contract endpoint out of range in ${cfg.name} at pair ${pairIndex}`)
      assert(v >= 1 && v <= cfg.vertexCount, `Contract endpoint out of range in ${cfg.name} at pair ${pairIndex}`)
      assert(hasEdge(cfg, u, v) && hasEdge(cfg, v, u), `Contract pair is not an edge in ${cfg.name}: (${u}, ${v})`)
    })

    cfg.vertices.forEach((vertex) => {
      assert(vertex.neighbors.length === vertex.degree, `Degree mismatch in ${cfg.name} at vertex ${vertex.id}`)
      const unique = new Set(vertex.neighbors)
      assert(unique.size === vertex.neighbors.length, `Duplicate neighbor in ${cfg.name} at vertex ${vertex.id}`)
      vertex.neighbors.forEach((neighbor) => {
        assert(hasEdge(cfg, neighbor, vertex.id), `Adjacency not symmetric in ${cfg.name}: ${vertex.id} -> ${neighbor}`)
      })
    })
  })
}

export function parseAndValidateStaticList(text = confText): QCConfiguration[] {
  const configs = parseU2822Conf(text)
  validateStaticList(configs)
  return configs
}

export function summarizeStaticList(configs = parseAndValidateStaticList()): StaticListSummary {
  let maxVertexCount = -Infinity
  let minVertexCount = Infinity
  let maxRingSize = -Infinity
  let minRingSize = Infinity
  let totalContractPairs = 0

  for (const cfg of configs) {
    if (cfg.vertexCount > maxVertexCount) maxVertexCount = cfg.vertexCount
    if (cfg.vertexCount < minVertexCount) minVertexCount = cfg.vertexCount
    if (cfg.ringSize > maxRingSize) maxRingSize = cfg.ringSize
    if (cfg.ringSize < minRingSize) minRingSize = cfg.ringSize
    totalContractPairs += cfg.contractPairs.length
  }

  return {
    count: configs.length,
    firstName: configs[0]?.name ?? null,
    lastName: configs[configs.length - 1]?.name ?? null,
    maxVertexCount,
    minVertexCount,
    maxRingSize,
    minRingSize,
    totalContractPairs,
  }
}
