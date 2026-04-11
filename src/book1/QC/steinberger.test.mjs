import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  loadConfigurations,
  loadUnavoidableSet,
  reduceConfigurationSeed,
} from './steinberger.mjs';

const qcDir = path.dirname(fileURLToPath(import.meta.url));
const confPath = path.join(qcDir, 'U_2822.conf');

describe('steinberger', () => {
  test('parses the full unavoidable set', async () => {
    const configs = await loadConfigurations(confPath);

    expect(configs).toHaveLength(2822);
    expect(configs[0].name).toBe('1');
    expect(configs.at(-1).name).toBe('2822');
  });

  test('builds discharge questions for the unavoidable set', async () => {
    const unavoidableSet = await loadUnavoidableSet(confPath);

    expect(unavoidableSet).toHaveLength(2822);
    expect(unavoidableSet[0].cfg.name).toBe('1');
    expect(unavoidableSet[0].question.findIndex((q) => q.u === -1)).toBeGreaterThan(1);
  });

  test('preserves reducibility data for a spread of configurations', async () => {
    const configs = await loadConfigurations(confPath);
    const sampleIndexes = [0, 1, 2, 10, 50, 100, 500, 1000, 2000, 2821];

    for (const index of sampleIndexes) {
      const cfg = configs[index];
      const result = reduceConfigurationSeed(cfg);

      expect(result.configName).toBe(cfg.name);
      expect(result.ring).toBe(cfg.ringSize);
      expect(result.extent).toBe(cfg.extendableColorings);
      expect(result.nlive).toBe(0);
      expect(result.status).toBe('D-reducible');
    }
  });

  test('can parse a temporary subset file', async () => {
    const fullText = await fs.readFile(confPath, 'utf8');
    const subsetText = fullText.trim().split(/\n\s*\n/g).slice(0, 3).join('\n\n') + '\n';
    const subsetPath = path.join(qcDir, 'U_2822.test-subset.conf');

    try {
      await fs.writeFile(subsetPath, subsetText, 'utf8');
      const configs = await loadConfigurations(subsetPath);

      expect(configs.map((cfg) => cfg.name)).toEqual(['1', '2', '3']);
    } finally {
      await fs.rm(subsetPath, { force: true });
    }
  });
});
