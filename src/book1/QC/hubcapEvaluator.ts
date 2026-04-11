import type { HubcapMember, HubcapStatement, PresentationFile } from './presentParser'
import type { AxleState, HubcapLeaf, InterpreterLeaf, PresentationTrace } from './presentInterpreter'
import { CARTVERT, INFTY, MAXVAL, parseAndTracePresentation } from './presentInterpreter'
import type { Rule } from './rulesParser'
import { parseRules } from './rulesParser'

export interface Outlet {
  number: number
  nolines: number
  value: number
  pos: number[]
  low: number[]
  upp: number[]
}

export interface PositionedOutlet {
  T: Outlet
  x: number
}

export interface HubcapCheckSuccess {
  ok: true
  member: HubcapMember
  maxCharge: number
  forcedCharge: number
  allowedCharge: number
}

export interface HubcapCheckFailure {
  ok: false
  member: HubcapMember
  reason: string
  forcedCharge: number
  allowedCharge: number
}

export type HubcapMemberCheck = HubcapCheckSuccess | HubcapCheckFailure

export interface HubcapEvaluation {
  ok: boolean
  statement: HubcapStatement
  axle: AxleState
  totalDoubleCoverCost: number
  maxDoubleCoverCost: number
  memberChecks: HubcapMemberCheck[]
}

const U = [0, 0, 0, 1, 0, 3, 2, 1, 4, 3, 8, 3, 0, 0, 5, 6, 15]
const V = [0, 0, 1, 0, 2, 0, 1, 3, 2, 5, 2, 9, 4, 12, 0, 1, 1]

export function copyAxle(axle: AxleState): AxleState {
  return {
    degree: axle.degree,
    low: axle.low.slice(),
    upp: axle.upp.slice()
  }
}

export function getAdjmat(axle: AxleState): number[][] {
  const deg = axle.low[0]
  const adjmat = Array.from({ length: CARTVERT }, () => new Array<number>(CARTVERT).fill(-1))

  for (let i = 1; i <= deg; i++) {
    const h = i === 1 ? deg : i - 1
    adjmat[0][h] = i
    adjmat[i][0] = h
    adjmat[h][i] = 0
    const a = deg + h
    adjmat[i][h] = a
    adjmat[a][i] = h
    adjmat[h][a] = i
    if (axle.upp[i] < 9) {
      doFan(deg, i, axle.upp[i], adjmat)
    }
  }

  return adjmat
}

export function doFan(deg: number, i: number, k: number, adjmat: number[][]): void {
  const a = i === 1 ? 2 * deg : deg + i - 1
  const b = deg + i
  if (k === 5) {
    adjmat[i][a] = b
    adjmat[a][b] = i
    adjmat[b][i] = a
    return
  }

  const c = 2 * deg + i
  adjmat[i][a] = c
  adjmat[a][c] = i
  adjmat[c][i] = a
  if (k === 6) {
    adjmat[i][c] = b
    adjmat[c][b] = i
    adjmat[b][i] = c
    return
  }

  const d = 3 * deg + i
  adjmat[i][c] = d
  adjmat[c][d] = i
  adjmat[d][i] = c
  if (k === 7) {
    adjmat[i][d] = b
    adjmat[d][b] = i
    adjmat[b][i] = d
    return
  }

  const e = 4 * deg + i
  adjmat[i][d] = e
  adjmat[d][e] = i
  adjmat[e][i] = d
  adjmat[i][e] = b
  adjmat[e][b] = i
  adjmat[b][i] = e
}

export function buildOutletsForDegree(rules: Rule[], degree: number): Outlet[] {
  const axle: AxleState = {
    degree,
    low: new Array(CARTVERT).fill(5),
    upp: new Array(CARTVERT).fill(INFTY)
  }
  axle.low[0] = degree
  axle.upp[0] = degree

  const outlets: Outlet[] = []
  let previousRule: Rule | null = null

  for (const rule of rules) {
    if (rule.invert) {
      if (!previousRule) {
        throw new Error(`Invert rule ${rule.number} has no previous rule`)
      }
      const z = extractZ(previousRule)
      const b = extractB(previousRule)
      const plus = doOutlet(axle, rule.number, V, U, z, b)
      if (plus) outlets.push(plus)
      const minus = doOutlet(axle, -rule.number, V, U, z, b)
      if (minus) outlets.push(minus)
      continue
    }

    previousRule = rule
    const z = extractZ(rule)
    const b = extractB(rule)
    const plus = doOutlet(axle, rule.number, U, V, z, b)
    if (plus) outlets.push(plus)
    const minus = doOutlet(axle, -rule.number, U, V, z, b)
    if (minus) outlets.push(minus)
  }

  return outlets
}

function extractZ(rule: Rule): number[] {
  const z = new Array<number>(17).fill(0)
  let maxIndex = 2
  for (const vertex of rule.vertices) {
    z[vertex.index] = vertex.index
    if (vertex.index + 1 > maxIndex) maxIndex = vertex.index + 1
  }
  z[0] = maxIndex
  return z
}

function extractB(rule: Rule): number[] {
  const b = new Array<number>(17).fill(0)
  b[0] = encodePair(rule.v0)
  b[1] = encodePair(rule.v1)
  for (const vertex of rule.vertices) {
    b[vertex.index] = vertex.beta * 10 + normalizeDelta(vertex.delta)
  }
  return b
}

function encodePair(pair: [number, number]): number {
  return pair[0] * 10 + normalizeDelta(pair[1])
}

function normalizeDelta(delta: number): number {
  return delta === 12 ? 9 : delta
}

export function doOutlet(
  axle: AxleState,
  number: number,
  X: number[],
  Y: number[],
  z: number[],
  b: number[]
): Outlet | null {
  const adjmat = getAdjmat(axle)
  const deg = axle.low[0]
  const outlet: Outlet = {
    nolines: z[0] - 1,
    number,
    value: 0,
    pos: [],
    low: [],
    upp: []
  }

  const phi = new Array<number>(17).fill(-1)
  let k = 0
  if (number > 0) {
    phi[0] = 1
    phi[1] = 0
    outlet.value = 1
    k = 1
  } else {
    phi[0] = 0
    phi[1] = 1
    outlet.value = -1
    k = 0
  }
  outlet.pos[0] = 1

  for (let i = 0, j = 0; j < z[0]; i++, j++) {
    outlet.low[i] = Math.trunc(b[j] / 10)
    outlet.upp[i] = b[j] % 10
    if (outlet.upp[i] === 9) outlet.upp[i] = INFTY
    if (outlet.low[i] === 0) outlet.low[i] = outlet.upp[i]

    if (outlet.low[i] > outlet.upp[i]) {
      throw new Error(`Condition (T2) violated for outlet ${number}`)
    }
    if (outlet.low[i] < 5 || outlet.low[i] > 9 || outlet.upp[i] > INFTY || outlet.upp[i] === 9) {
      throw new Error(`Condition (T3) violated for outlet ${number}`)
    }

    if (j === k) {
      if (outlet.low[k] > deg || outlet.upp[k] < deg) {
        return null
      }
      i--
      continue
    }

    if (j >= 2) {
      const u = phi[X[z[j]]]
      const v = phi[Y[z[j]]]
      if (u < 0 || u > 5 * deg || v < 0 || v > 5 * deg) {
        throw new Error(`Rule ${number} references illegal vertex`)
      }
      outlet.pos[i] = phi[z[j]] = adjmat[u][v]
    }

    const u = outlet.pos[i]
    if (u <= 0 || u > 5 * deg) {
      throw new Error(`Rule ${number} uses illegal vertex`)
    }
    if (u <= deg && outlet.low[i] === outlet.upp[i]) {
      doFan(deg, u, outlet.low[i], adjmat)
    }
  }

  return outlet
}

export function outletForced(axle: AxleState, outlet: Outlet, x: number): number {
  const deg = axle.low[0]
  const shift = x - 1

  for (let i = 0; i < outlet.nolines; ++i) {
    const p0 = outlet.pos[i]
    const p = shift + ((p0 - 1) % deg) < deg ? p0 + shift : p0 + shift - deg
    if (outlet.low[i] > axle.low[p] || outlet.upp[i] < axle.upp[p]) {
      return 0
    }
  }
  return outlet.value
}

export function outletPermitted(axle: AxleState, outlet: Outlet, x: number): number {
  const deg = axle.low[0]
  const shift = x - 1

  for (let i = 0; i < outlet.nolines; ++i) {
    const p0 = outlet.pos[i]
    const p = shift + ((p0 - 1) % deg) < deg ? p0 + shift : p0 + shift - deg
    if (outlet.low[i] > axle.upp[p] || outlet.upp[i] < axle.low[p]) {
      return 0
    }
  }
  return outlet.value
}

export function reflForced(axle: AxleState, outlet: Outlet, x: number): number {
  const deg = axle.low[0]
  const shift = x - 1

  for (let i = 0; i < outlet.nolines; ++i) {
    const p0 = outlet.pos[i]
    const p = shift + ((p0 - 1) % deg) < deg ? p0 + shift : p0 + shift - deg
    let q = 0
    if (p < 1 || p > 2 * deg) return 0
    else if (p <= deg) q = deg - p + 1
    else if (p < 2 * deg) q = 3 * deg - p
    else q = 2 * deg

    if (outlet.low[i] > axle.low[q] || outlet.upp[i] < axle.upp[q]) {
      return 0
    }
  }

  return outlet.value
}

export function evaluateHubcap(axle: AxleState, statement: HubcapStatement, outlets: Outlet[]): HubcapEvaluation {
  const deg = axle.low[0]
  const covered = new Array<number>(deg + 1).fill(0)
  const aux = new Array<number>(deg + 1).fill(0)
  let totalDoubleCoverCost = 0

  for (const member of statement.members) {
    if (member.x < 1 || member.x > deg || member.y < 1 || member.y > deg) {
      return failHubcap(axle, statement, totalDoubleCoverCost, 20 * (deg - 6) + 1, [], `Invalid hubcap member (${member.x},${member.y},${member.value})`)
    }

    if (member.x === member.y) {
      totalDoubleCoverCost += 2 * member.value
      if (covered[member.x]) {
        return failHubcap(axle, statement, totalDoubleCoverCost, 20 * (deg - 6) + 1, [], 'Invalid double cover')
      }
      covered[member.x] = -1
    } else {
      totalDoubleCoverCost += (aux[member.x] = member.value)
      if (covered[member.x] === -1 || covered[member.y] === -1) {
        return failHubcap(axle, statement, totalDoubleCoverCost, 20 * (deg - 6) + 1, [], 'Invalid double cover')
      }
      covered[member.x] = covered[member.x] === 0 ? member.y : -1
      covered[member.y] = covered[member.y] === 0 ? member.x : -1
    }
  }

  for (let i = 1; i <= deg; ++i) {
    if (covered[i] === 0) {
      return failHubcap(axle, statement, totalDoubleCoverCost, 20 * (deg - 6) + 1, [], 'Invalid hubcap')
    }
    if (covered[i] === -1) continue
    if (covered[covered[i]] !== i) {
      return failHubcap(axle, statement, totalDoubleCoverCost, 20 * (deg - 6) + 1, [], 'Invalid hubcap')
    }
    totalDoubleCoverCost += aux[i]
  }

  const maxDoubleCoverCost = 20 * (deg - 6) + 1
  if (totalDoubleCoverCost > maxDoubleCoverCost) {
    return failHubcap(axle, statement, totalDoubleCoverCost, maxDoubleCoverCost, [], 'Hubcap does not satisfy (H2)')
  }

  const memberChecks: HubcapMemberCheck[] = []
  for (const member of statement.members) {
    const memberResult = checkMemberBound(axle, member, outlets)
    memberChecks.push(memberResult)
    if (!memberResult.ok) {
      return {
        ok: false,
        statement,
        axle: copyAxle(axle),
        totalDoubleCoverCost,
        maxDoubleCoverCost,
        memberChecks
      }
    }
  }

  return {
    ok: true,
    statement,
    axle: copyAxle(axle),
    totalDoubleCoverCost,
    maxDoubleCoverCost,
    memberChecks
  }
}

function failHubcap(
  axle: AxleState,
  statement: HubcapStatement,
  totalDoubleCoverCost: number,
  maxDoubleCoverCost: number,
  memberChecks: HubcapMemberCheck[],
  reason: string
): HubcapEvaluation {
  return {
    ok: false,
    statement,
    axle: copyAxle(axle),
    totalDoubleCoverCost,
    maxDoubleCoverCost,
    memberChecks: memberChecks.length > 0 ? memberChecks : [{
      ok: false,
      member: { x: 0, y: 0, value: 0 },
      reason,
      forcedCharge: 0,
      allowedCharge: 0
    }]
  }
}

export function checkMemberBound(axle: AxleState, member: HubcapMember, outlets: Outlet[]): HubcapMemberCheck {
  const posout: PositionedOutlet[] = []
  const states: number[] = []

  for (const outlet of outlets) {
    posout.push({ T: outlet, x: member.x })
    states.push(0)
  }
  if (member.x !== member.y) {
    for (const outlet of outlets) {
      posout.push({ T: outlet, x: member.y })
      states.push(0)
    }
  }

  const result = searchBound(axle, posout, states, member.value, 0)
  if (result.ok) {
    return {
      ok: true,
      member,
      maxCharge: member.value,
      forcedCharge: result.forcedCharge,
      allowedCharge: result.allowedCharge
    }
  }

  return {
    ok: false,
    member,
    reason: result.reason,
    forcedCharge: result.forcedCharge,
    allowedCharge: result.allowedCharge
  }
}

function searchBound(
  axle: AxleState,
  posout: PositionedOutlet[],
  states: number[],
  maxCharge: number,
  pos: number
): { ok: true; forcedCharge: number; allowedCharge: number } | { ok: false; reason: string; forcedCharge: number; allowedCharge: number } {
  let forcedCharge = 0
  let allowedCharge = 0

  for (let i = 0; i < posout.length; i++) {
    const po = posout[i]
    if (states[i] > 0) forcedCharge += po.T.value
    if (states[i] !== 0) continue

    if (outletForced(axle, po.T, po.x)) {
      states[i] = 1
      forcedCharge += po.T.value
    } else if (!outletPermitted(axle, po.T, po.x)) {
      states[i] = -1
    } else if (po.T.value > 0) {
      allowedCharge += po.T.value
    }
  }

  if (forcedCharge + allowedCharge <= maxCharge) {
    return { ok: true, forcedCharge, allowedCharge }
  }

  if (forcedCharge > maxCharge) {
    return {
      ok: false,
      reason: 'Forced charge exceeds member bound (needs reducibility fallback)',
      forcedCharge,
      allowedCharge
    }
  }

  for (let i = pos; i < posout.length; i++) {
    const po = posout[i]
    if (states[i] !== 0 || po.T.value < 0) continue

    const nextAxle = copyAxle(axle)
    const deg = nextAxle.low[0]
    for (let j = 0; j < po.T.nolines; ++j) {
      const p0 = po.T.pos[j]
      const p = po.x - 1 + ((p0 - 1) % deg) < deg ? p0 + po.x - 1 : p0 + po.x - 1 - deg
      if (po.T.low[j] > nextAxle.low[p]) nextAxle.low[p] = po.T.low[j]
      if (po.T.upp[j] < nextAxle.upp[p]) nextAxle.upp[p] = po.T.upp[j]
      if (nextAxle.low[p] > nextAxle.upp[p]) {
        return { ok: false, reason: 'Unexpected axle contradiction while forcing outlet', forcedCharge, allowedCharge }
      }
    }

    let good = true
    for (let j = 0; j < i; j++) {
      if (states[j] === -1 && outletForced(nextAxle, posout[j].T, posout[j].x)) {
        good = false
        break
      }
    }

    if (good) {
      const forcedStates = states.slice()
      forcedStates[i] = 1
      const recursive = searchBound(nextAxle, posout, forcedStates, maxCharge, i + 1)
      if (!recursive.ok) {
        return recursive
      }
    }

    states[i] = -1
    allowedCharge -= po.T.value
    if (allowedCharge + forcedCharge <= maxCharge) {
      return { ok: true, forcedCharge, allowedCharge }
    }
  }

  return {
    ok: false,
    reason: 'Unexpected search exhaustion in CheckBound',
    forcedCharge,
    allowedCharge
  }
}

export function evaluateHubcapLeaves(trace: PresentationTrace, rulesText: string): HubcapEvaluation[] {
  const rules = parseRules(rulesText)
  const evaluations: HubcapEvaluation[] = []

  for (const leaf of trace.leaves) {
    if (leaf.leafKind !== 'H') continue
    const outlets = buildOutletsForDegree(rules, leaf.axle.degree)
    evaluations.push(evaluateHubcap(leaf.axle, leaf.statement, outlets))
  }

  return evaluations
}

export function summarizeHubcapEvaluations(evaluations: HubcapEvaluation[]) {
  let okCount = 0
  let failedCount = 0

  for (const evaluation of evaluations) {
    if (evaluation.ok) okCount++
    else failedCount++
  }

  return {
    total: evaluations.length,
    okCount,
    failedCount
  }
}
