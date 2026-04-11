import { generateAllPresentations } from './generator'

describe('QC full generator', () => {
  it('generates the full RSST unavoidable set with 2822 unique configurations', () => {
    const result = generateAllPresentations()

    expect(result.summary.totalSources).toBe(5)
    expect(result.summary.uniqueGeneratedConfigCount).toBe(2822)
    expect(result.summary.uniqueGeneratedConfigNames.length).toBe(2822)

    const numericNames = result.summary.uniqueGeneratedConfigNames.map((name) => Number(name))
    expect(numericNames.every((value) => Number.isInteger(value) && value > 0)).toBe(true)
    expect(new Set(numericNames).size).toBe(2822)
  })
})
