import type {
  ConditionStatement,
  HubcapStatement,
  PresentationFile,
  ProofNode,
  ReduceStatement,
  Statement,
  SymmetryStatement
} from './presentParser'
import { buildProofForest, parsePresentation } from './presentParser'

export const MAXVAL = 12
export const CARTVERT = 5 * MAXVAL + 2
export const INFTY = 12

export interface AxleState {
  degree: number
  low: number[]
  upp: number[]
}

export interface InterpreterPathStep {
  lineNumber: number
  kind: Statement['kind']
  raw: string
}

export interface ReduceLeaf {
  leafKind: 'R'
  statement: ReduceStatement
  axle: AxleState
  path: InterpreterPathStep[]
}

export interface HubcapLeaf {
  leafKind: 'H'
  statement: HubcapStatement
  axle: AxleState
  path: InterpreterPathStep[]
}

export interface SymmetryLeaf {
  leafKind: 'S'
  statement: SymmetryStatement
  axle: AxleState
  path: InterpreterPathStep[]
}

export type InterpreterLeaf = ReduceLeaf | HubcapLeaf | SymmetryLeaf

export interface PresentationTrace {
  degree: number
  leaves: InterpreterLeaf[]
}

export function createInitialAxleState(degree: number): AxleState {
  const low = new Array(CARTVERT).fill(5)
  const upp = new Array(CARTVERT).fill(INFTY)
  low[0] = degree
  upp[0] = degree
  return { degree, low, upp }
}

export function cloneAxleState(axle: AxleState): AxleState {
  return {
    degree: axle.degree,
    low: axle.low.slice(),
    upp: axle.upp.slice()
  }
}

function assertCompatiblePosition(position: number, axle: AxleState): void {
  const deg = axle.degree
  if (position < 1 || position > 5 * deg) {
    throw new Error(`Invalid vertex in condition: ${position}`)
  }
}

export function applyCondition(axle: AxleState, statement: ConditionStatement): [AxleState, AxleState] {
  assertCompatiblePosition(statement.position, axle)

  const left = cloneAxleState(axle)
  const right = cloneAxleState(axle)
  const n = statement.position
  const m = statement.bound

  if (m > 0) {
    if (left.low[n] >= m || m > left.upp[n]) {
      throw new Error(`Invalid lower bound in condition at line ${statement.lineNumber}`)
    }
    left.upp[n] = m - 1
    right.low[n] = m
  } else {
    const upper = -m
    if (left.low[n] > upper || upper >= left.upp[n]) {
      throw new Error(`Invalid upper bound in condition at line ${statement.lineNumber}`)
    }
    left.low[n] = upper + 1
    right.upp[n] = upper
  }

  return [left, right]
}

function pathWith(path: InterpreterPathStep[], statement: Statement): InterpreterPathStep[] {
  return path.concat({
    lineNumber: statement.lineNumber,
    kind: statement.kind,
    raw: statement.raw
  })
}

function walkNode(node: ProofNode, axle: AxleState, path: InterpreterPathStep[], leaves: InterpreterLeaf[]): void {
  const nextPath = pathWith(path, node.statement)

  if (node.statement.kind === 'C') {
    const [left, right] = applyCondition(axle, node.statement)
    const childCount = node.children.length

    if (childCount === 0) {
      return
    }
    if (childCount === 1) {
      walkNode(node.children[0], right, nextPath, leaves)
      return
    }

    walkNode(node.children[0], left, nextPath, leaves)
    walkNode(node.children[1], right, nextPath, leaves)

    for (let i = 2; i < childCount; i++) {
      walkNode(node.children[i], right, nextPath, leaves)
    }
    return
  }

  if (node.statement.kind === 'R') {
    leaves.push({
      leafKind: 'R',
      statement: node.statement,
      axle: cloneAxleState(axle),
      path: nextPath
    })
    return
  }

  if (node.statement.kind === 'H') {
    leaves.push({
      leafKind: 'H',
      statement: node.statement,
      axle: cloneAxleState(axle),
      path: nextPath
    })
    return
  }

  if (node.statement.kind === 'S') {
    leaves.push({
      leafKind: 'S',
      statement: node.statement,
      axle: cloneAxleState(axle),
      path: nextPath
    })
    return
  }
}

export function tracePresentation(presentation: PresentationFile): PresentationTrace {
  const forest = buildProofForest(presentation.statements)
  const initial = createInitialAxleState(presentation.degree)
  const leaves: InterpreterLeaf[] = []

  for (const root of forest) {
    walkNode(root, initial, [], leaves)
  }

  return {
    degree: presentation.degree,
    leaves
  }
}

export function parseAndTracePresentation(text: string): PresentationTrace {
  return tracePresentation(parsePresentation(text))
}

export function summarizeTrace(trace: PresentationTrace) {
  let reduceLeaves = 0
  let hubcapLeaves = 0
  let symmetryLeaves = 0
  let maxPathLength = 0

  for (const leaf of trace.leaves) {
    if (leaf.leafKind === 'R') reduceLeaves++
    else if (leaf.leafKind === 'H') hubcapLeaves++
    else if (leaf.leafKind === 'S') symmetryLeaves++
    if (leaf.path.length > maxPathLength) maxPathLength = leaf.path.length
  }

  return {
    degree: trace.degree,
    totalLeaves: trace.leaves.length,
    reduceLeaves,
    hubcapLeaves,
    symmetryLeaves,
    maxPathLength
  }
}
