import present7Text from './original/present7?raw'
import present8Text from './original/present8?raw'
import present9Text from './original/present9?raw'
import present10Text from './original/present10?raw'
import present11Text from './original/present11?raw'
import rulesText from './original/rules.txt?raw'

import type { Statement } from './presentParser'
import { parsePresentation } from './presentParser'
import type { PresentationTrace, InterpreterLeaf } from './presentInterpreter'
import { parseAndTracePresentation, summarizeTrace } from './presentInterpreter'
import type { HubcapEvaluation } from './hubcapEvaluator'
import { evaluateHubcapLeaves, summarizeHubcapEvaluations } from './hubcapEvaluator'
import type { ReducibilityResult } from './reduceInterpreter'
import { reduceAxle, summarizeReducibility } from './reduceInterpreter'

export interface SourceBundle {
  name: string
  text: string
}

export interface LeafGenerationRecord {
  source: string
  degree: number
  leafKind: InterpreterLeaf['leafKind']
  lineNumber: number
  raw: string
  pathLength: number
  hubcapEvaluation?: HubcapEvaluation
  reducibility?: ReducibilityResult
}

export interface SourceGenerationSummary {
  source: string
  degree: number
  trace: ReturnType<typeof summarizeTrace>
  hubcaps: ReturnType<typeof summarizeHubcapEvaluations>
  reducibleLeafCount: number
  nonReducibleLeafCount: number
  generatedConfigNames: string[]
}

export interface FullGenerationSummary {
  totalSources: number
  totalLeaves: number
  totalHubcapLeaves: number
  totalReduceLeaves: number
  totalSymmetryLeaves: number
  totalGeneratedConfigHits: number
  uniqueGeneratedConfigCount: number
  uniqueGeneratedConfigNames: string[]
  perSource: SourceGenerationSummary[]
}

export interface FullGenerationResult {
  records: LeafGenerationRecord[]
  summary: FullGenerationSummary
}

export function getDefaultPresentationSources(): SourceBundle[] {
  return [
    { name: 'present7', text: present7Text },
    { name: 'present8', text: present8Text },
    { name: 'present9', text: present9Text },
    { name: 'present10', text: present10Text },
    { name: 'present11', text: present11Text },
  ]
}

export function generateFromPresentationSource(source: SourceBundle): {
  trace: PresentationTrace
  hubcapEvaluations: HubcapEvaluation[]
  records: LeafGenerationRecord[]
  summary: SourceGenerationSummary
} {
  const trace = parseAndTracePresentation(source.text)
  const hubcapEvaluations = evaluateHubcapLeaves(trace, rulesText)
  const hubcapByLine = new Map<number, HubcapEvaluation>()
  for (const evaluation of hubcapEvaluations) {
    hubcapByLine.set(evaluation.statement.lineNumber, evaluation)
  }

  const records: LeafGenerationRecord[] = []
  const generatedConfigNames: string[] = []
  let reducibleLeafCount = 0
  let nonReducibleLeafCount = 0
  let hubcapLeavesCount = 0

  for (const leaf of trace.leaves) {
    const record: LeafGenerationRecord = {
      source: source.name,
      degree: trace.degree,
      leafKind: leaf.leafKind,
      lineNumber: leaf.statement.lineNumber,
      raw: leaf.statement.raw,
      pathLength: leaf.path.length,
    }

    if (leaf.leafKind === 'H') {
      hubcapLeavesCount++
      const evaluation = hubcapByLine.get(leaf.statement.lineNumber)
      if (evaluation) {
        record.hubcapEvaluation = evaluation
      }
    }

    if (leaf.leafKind === 'R') {
      const reducibility = reduceAxle(leaf.axle)
      record.reducibility = reducibility
      if (reducibility.reducible) {
        reducibleLeafCount++
        for (const match of reducibility.matches) {
          generatedConfigNames.push(match.config.name)
        }
      } else {
        nonReducibleLeafCount++
      }
    }

    records.push(record)
  }

  return {
    trace,
    hubcapEvaluations,
    records,
    summary: {
      source: source.name,
      degree: trace.degree,
      trace: summarizeTrace(trace),
      hubcaps: summarizeHubcapEvaluations(hubcapEvaluations),
      reducibleLeafCount,
      nonReducibleLeafCount,
      generatedConfigNames,
    }
  }
}

export function generateAllPresentations(sources: SourceBundle[] = getDefaultPresentationSources()): FullGenerationResult {
  const records: LeafGenerationRecord[] = []
  const perSource: SourceGenerationSummary[] = []
  const uniqueGenerated = new Set<string>()

  let totalLeaves = 0
  let totalHubcapLeaves = 0
  let totalReduceLeaves = 0
  let totalSymmetryLeaves = 0
  let totalGeneratedConfigHits = 0

  for (const source of sources) {
    const partial = generateFromPresentationSource(source)
    records.push(...partial.records)
    perSource.push(partial.summary)

    totalLeaves += partial.records.length
    totalHubcapLeaves += partial.summary.hubcaps.total
    totalReduceLeaves += partial.summary.trace.reduceLeaves
    totalSymmetryLeaves += partial.summary.trace.symmetryLeaves
    totalGeneratedConfigHits += partial.summary.generatedConfigNames.length

    for (const name of partial.summary.generatedConfigNames) {
      uniqueGenerated.add(name)
    }
  }

  return {
    records,
    summary: {
      totalSources: sources.length,
      totalLeaves,
      totalHubcapLeaves,
      totalReduceLeaves,
      totalSymmetryLeaves,
      totalGeneratedConfigHits,
      uniqueGeneratedConfigCount: uniqueGenerated.size,
      uniqueGeneratedConfigNames: [...uniqueGenerated].sort((a, b) => Number(a) - Number(b)),
      perSource,
    }
  }
}

export function summarizeFullGeneration(result: FullGenerationResult): FullGenerationSummary {
  return result.summary
}
