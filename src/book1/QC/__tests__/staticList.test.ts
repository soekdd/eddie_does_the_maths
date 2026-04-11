import { parseAndValidateStaticList, summarizeStaticList } from '../testStaticList'

describe('U_2822 static configuration list', () => {
  it('parses and validates all configurations', () => {
    const configs = parseAndValidateStaticList()
    expect(configs.length).toBe(2822)
  })

  it('has continuous numbering 1..2822', () => {
    const configs = parseAndValidateStaticList()
    configs.forEach((cfg, idx) => {
      expect(Number(cfg.name)).toBe(idx + 1)
    })
  })

  it('summary statistics are consistent', () => {
    const summary = summarizeStaticList()

    expect(summary.count).toBe(2822)
    expect(summary.firstName).toBe('1')
    expect(summary.lastName).toBe('2822')
    expect(summary.minVertexCount).toBeGreaterThan(0)
    expect(summary.maxVertexCount).toBeGreaterThan(summary.minVertexCount)
    expect(summary.maxRingSize).toBeGreaterThan(summary.minRingSize)
    expect(summary.totalContractPairs).toBeGreaterThan(0)
  })
})
