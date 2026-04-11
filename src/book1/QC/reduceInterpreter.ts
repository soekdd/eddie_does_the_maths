import confText from './U_2822.conf?raw'
import type { QCConfiguration } from './parser'
import { parseU2822Conf } from './parser'
import type { AxleState } from './presentInterpreter'
import { CARTVERT } from './presentInterpreter'
import { copyAxle, getAdjmat } from './hubcapEvaluator'

export interface QueryEntry {
  z: number
  xi: number
  u: number
  v: number
}

export type Question = QueryEntry[]

export interface ReducibilityMatch {
  config: QCConfiguration
  configIndex: number
  image: number[]
  orientationPreserving: boolean
}

export interface ReducibilityResult {
  reducible: boolean
  matches: ReducibilityMatch[]
  testedConfigs: number
  exploredAxles: number
}

export interface EdgeListMap {
  [key: string]: number[]
}

let cachedConfigurations: QCConfiguration[] | null = null
let cachedQuestions: Question[] | null = null

export function loadStaticConfigurations(): QCConfiguration[] {
  if (!cachedConfigurations) {
    cachedConfigurations = parseU2822Conf(confText)
  }
  return cachedConfigurations
}

export function loadStaticQuestions(): Question[] {
  if (!cachedQuestions) {
    cachedQuestions = loadStaticConfigurations().map(getQuestion)
  }
  return cachedQuestions
}

export function getQuestion(cfg: QCConfiguration): Question {
  const nverts = cfg.vertexCount
  const ring = cfg.ringSize
  const found = new Array<boolean>(nverts + 1).fill(false)
  const question: Question = []

  let best = ring + 1
  let max = -1
  for (let v = ring + 1; v <= nverts; v++) {
    const d = cfg.vertices[v - 1].degree
    if (d > max) {
      max = d
      best = v
    }
  }
  question[0] = { z: best, xi: cfg.vertices[best - 1].degree, u: 0, v: 0 }
  found[best] = true

  let secondbest = -1
  max = -1
  for (const v of cfg.vertices[best - 1].neighbors) {
    if (v <= ring) continue
    const d = cfg.vertices[v - 1].degree
    if (d > max) {
      max = d
      secondbest = v
    }
  }
  if (secondbest < 0) {
    throw new Error(`No secondbest internal neighbor found for configuration ${cfg.name}`)
  }
  question[1] = { z: secondbest, xi: cfg.vertices[secondbest - 1].degree, u: nverts, v: ring }
  found[secondbest] = true

  let nfound = 2
  for (let search = 0; search < nfound; search++) {
    const v = question[search].z
    if (v <= ring) continue
    const nbrs = cfg.vertices[v - 1].neighbors
    const d = nbrs.length

    let i = 0
    while (i < d && !found[nbrs[i]]) i++
    if (i >= d) continue

    let h = i === 0 ? d - 1 : i - 1
    while (h !== i) {
      const u = nbrs[h]
      if (u <= ring) break
      if (!found[u]) {
        const next = nbrs[h === d - 1 ? 0 : h + 1]
        question[nfound] = { z: u, xi: u > ring ? cfg.vertices[u - 1].degree : 0, u: next, v }
        nfound++
        found[u] = true
      }
      h = h === 0 ? d - 1 : h - 1
    }
    if (h === i) continue

    let j = i === d - 1 ? 0 : i + 1
    while (true) {
      const w = nbrs[j]
      if (w <= ring) break
      if (!found[w]) {
        const prev = nbrs[j === 0 ? d - 1 : j - 1]
        question[nfound] = { z: w, xi: w > ring ? cfg.vertices[w - 1].degree : 0, u: v, v: prev }
        nfound++
        found[w] = true
      }
      j = j === d - 1 ? 0 : j + 1
    }

    const r = h >= j ? h - j : h - j + d
    if (r <= 2) continue

    const u = nbrs[h]
    question[nfound] = { z: u, xi: u > ring ? cfg.vertices[u - 1].degree : 0, u: nbrs[h === d - 1 ? 0 : h + 1], v }
    nfound++

    let g = h === 0 ? d - 1 : h - 1
    while (g !== j) {
      const t = nbrs[g]
      if (t <= ring || found[t]) {
        throw new Error(`Error in getQuestion for configuration ${cfg.name}`)
      }
      question[nfound] = { z: t, xi: t > ring ? cfg.vertices[t - 1].degree : 0, u: question[nfound - 1].z, v }
      nfound++
      found[t] = true
      g = g === 0 ? d - 1 : g - 1
    }
  }

  question[nfound] = { z: -1, xi: 0, u: -1, v: 0 }
  return question
}

export function getEdgeList(axle: AxleState): EdgeListMap {
  const degree = axle.upp
  const deg = axle.upp[0]
  const map: EdgeListMap = {}

  for (let i = 1; i <= deg; i++) {
    addToList(map, 0, i, degree)
    const h = i === 1 ? deg : i - 1
    addToList(map, i, h, degree)
    const a = deg + h
    const b = deg + i
    addToList(map, i, a, degree)
    addToList(map, i, b, degree)
    if (axle.low[i] !== axle.upp[i]) continue
    if (axle.upp[i] === 5) {
      addToList(map, a, b, degree)
      continue
    }
    const c = 2 * deg + i
    addToList(map, a, c, degree)
    addToList(map, i, c, degree)
    if (axle.upp[i] === 6) {
      addToList(map, b, c, degree)
      continue
    }
    const d = 3 * deg + i
    addToList(map, c, d, degree)
    addToList(map, i, d, degree)
    if (axle.upp[i] === 7) {
      addToList(map, b, d, degree)
      continue
    }
    if (axle.upp[i] !== 8) {
      throw new Error('Unexpected axle degree in getEdgeList')
    }
    const e = 4 * deg + i
    addToList(map, d, e, degree)
    addToList(map, i, e, degree)
    addToList(map, b, e, degree)
  }

  return map
}

function edgeKey(a: number, b: number): string {
  return `${a},${b}`
}

function addPair(map: EdgeListMap, a: number, b: number, u: number, v: number): void {
  const key = edgeKey(a, b)
  if (!map[key]) map[key] = []
  map[key].push(u, v)
}

export function addToList(map: EdgeListMap, u: number, v: number, degree: number[]): void {
  const a = degree[u]
  const b = degree[v]
  if (a >= b && b <= 8 && a <= 11 && (a <= 8 || u === 0)) {
    addPair(map, a, b, u, v)
  }
  if (b >= a && a <= 8 && b <= 11 && (b <= 8 || v === 0)) {
    addPair(map, b, a, v, u)
  }
}

export function rootedSubConf(
  degree: number[],
  adjmat: number[][],
  question: Question,
  image: number[],
  x: number,
  y: number,
  clockwise: boolean
): boolean {
  const deg = degree[0]
  const used = new Array<boolean>(CARTVERT).fill(false)
  for (let j = 0; j < CARTVERT; j++) image[j] = -1
  image[0] = clockwise ? 1 : 0
  image[question[0].z] = x
  image[question[1].z] = y
  used[x] = true
  used[y] = true

  for (let idx = 2; idx < question.length && question[idx].u >= 0; idx++) {
    const q = question[idx]
    const w = clockwise ? adjmat[image[q.u]][image[q.v]] : adjmat[image[q.v]][image[q.u]]
    if (w === -1) return false
    if (q.xi && q.xi !== degree[w]) return false
    if (used[w]) return false
    image[q.z] = w
    used[w] = true
  }

  for (let j = 1; j <= deg; j++) {
    if (!used[j] && used[deg + j] && used[j === 1 ? 2 * deg : deg + j - 1]) {
      return false
    }
  }

  return true
}

export function subConf(
  adjmat: number[][],
  degree: number[],
  question: Question,
  edgelist: EdgeListMap,
  image: number[]
): boolean {
  const key = edgeKey(question[0].xi, question[1].xi)
  const edges = edgelist[key] ?? []
  for (let i = 0; i < edges.length; i += 2) {
    const x = edges[i]
    const y = edges[i + 1]
    if (rootedSubConf(degree, adjmat, question, image, x, y, true)) return true
    if (rootedSubConf(degree, adjmat, question, image, x, y, false)) return true
  }
  return false
}

export function reduceAxle(
  axle: AxleState,
  configs: QCConfiguration[] = loadStaticConfigurations(),
  questions: Question[] = loadStaticQuestions()
): ReducibilityResult {
  const stack: AxleState[] = [copyAxle(axle)]
  const matches: ReducibilityMatch[] = []
  let testedConfigs = 0
  let exploredAxles = 0

  while (stack.length > 0) {
    const current = stack.pop()!
    exploredAxles++
    const adjmat = getAdjmat(current)
    const edgelist = getEdgeList(current)
    const image = new Array<number>(CARTVERT).fill(-1)

    let foundIndex = -1
    for (let h = 0; h < configs.length; h++) {
      testedConfigs++
      if (subConf(adjmat, current.upp, questions[h], edgelist, image)) {
        foundIndex = h
        break
      }
    }

    if (foundIndex < 0) {
      return { reducible: false, matches, testedConfigs, exploredAxles }
    }

    const matchedConfig = configs[foundIndex]
    matches.push({
      config: matchedConfig,
      configIndex: foundIndex,
      image: image.slice(),
      orientationPreserving: image[0] === 1
    })

    for (let i = matchedConfig.ringSize + 1; i <= matchedConfig.vertexCount; i++) {
      const v = image[i]
      if (v < 0) continue
      if (current.low[v] === current.upp[v]) continue
      const next = copyAxle(current)
      next.upp[v] = current.upp[v] - 1
      stack.push(next)
    }
  }

  return { reducible: true, matches, testedConfigs, exploredAxles }
}

export function summarizeReducibility(result: ReducibilityResult) {
  return {
    reducible: result.reducible,
    exploredAxles: result.exploredAxles,
    testedConfigs: result.testedConfigs,
    matchCount: result.matches.length,
    firstMatch: result.matches[0]?.config.name ?? null,
    lastMatch: result.matches[result.matches.length - 1]?.config.name ?? null
  }
}
