export interface QCVertex {
  id: number;
  degree: number;
  neighbors: number[];
}

export interface QCConfiguration {
  name: string;
  vertexCount: number;
  ringSize: number;
  extendableColorings: number;
  maxContractSubset: number;
  contractRaw: number[];
  contractPairs: Array<[number, number]>;
  vertices: QCVertex[];
  coordinates: number[];
}

function isBlank(line: string): boolean {
  return /^\s*$/.test(line);
}

function tokenizeInts(line: string): number[] {
  return (line.match(/-?\d+/g) ?? []).map(Number);
}

function parseContractLine(line: string, configName: string): { raw: number[]; pairs: Array<[number, number]> } {
  const ints = tokenizeInts(line);
  if (ints.length === 0) {
    throw new Error(`Error on contract line while reading ${configName}`);
  }

  const count = ints[0];
  if (2 * count + 1 !== ints.length) {
    throw new Error(`Error on line 3 while reading ${configName}`);
  }

  const pairs: Array<[number, number]> = [];
  for (let i = 0; i < count; i++) {
    pairs.push([ints[1 + 2 * i], ints[2 + 2 * i]]);
  }

  return { raw: ints, pairs };
}

function parseAdjacencyLine(line: string, expectedVertexId: number, configName: string): QCVertex {
  const ints = tokenizeInts(line);
  if (ints.length < 2) {
    throw new Error(`Error while reading vertex ${expectedVertexId} of ${configName}`);
  }

  const [id, degree, ...neighbors] = ints;
  if (id !== expectedVertexId) {
    throw new Error(`Error while reading vertex ${expectedVertexId} of ${configName}`);
  }
  if (neighbors.length !== degree) {
    throw new Error(`Error while reading neighbour list of ${expectedVertexId} of ${configName}`);
  }

  return { id, degree, neighbors };
}

export function validateConfiguration(cfg: QCConfiguration): true {
  const n = cfg.vertexCount;
  const r = cfg.ringSize;

  if (r < 2 || n <= r) {
    throw new Error(`ReadErr(1): invalid vertex/ring relation in ${cfg.name}`);
  }

  for (let i = 1; i <= r; i++) {
    const d = cfg.vertices[i - 1].degree;
    if (d < 3 || d >= n) {
      throw new Error(`ReadErr(2): invalid ring degree at vertex ${i} in ${cfg.name}`);
    }
  }
  for (let i = r + 1; i <= n; i++) {
    const d = cfg.vertices[i - 1].degree;
    if (d < 5 || d >= n) {
      throw new Error(`ReadErr(2): invalid internal degree at vertex ${i} in ${cfg.name}`);
    }
  }

  for (let i = 1; i <= n; i++) {
    for (const k of cfg.vertices[i - 1].neighbors) {
      if (k < 1 || k > n) {
        throw new Error(`ReadErr(3): neighbor ${k} out of range at vertex ${i} in ${cfg.name}`);
      }
    }
  }

  for (let i = 1; i <= r; i++) {
    const nbrs = cfg.vertices[i - 1].neighbors;
    const first = nbrs[0];
    const last = nbrs[nbrs.length - 1];
    const expectedFirst = i === r ? 1 : i + 1;
    const expectedLast = i === 1 ? r : i - 1;
    if (first !== expectedFirst || last !== expectedLast) {
      throw new Error(`ReadErr(4): bad ring order at vertex ${i} in ${cfg.name}`);
    }
    for (let j = 1; j < nbrs.length - 1; j++) {
      if (nbrs[j] <= r || nbrs[j] > n) {
        throw new Error(`ReadErr(4): bad non-ring neighbor at ring vertex ${i} in ${cfg.name}`);
      }
    }
  }

  let degreeSum = 0;
  for (let i = 0; i < n; i++) degreeSum += cfg.vertices[i].degree;
  if (degreeSum !== 6 * (n - 1) - 2 * r) {
    throw new Error(`ReadErr(5): Euler degree sum mismatch in ${cfg.name}`);
  }

  for (let i = r + 1; i <= n; i++) {
    let k = 0;
    const nbrs = cfg.vertices[i - 1].neighbors;
    const d = nbrs.length;
    for (let j = 0; j < d; j++) {
      const a = nbrs[j];
      const b = nbrs[(j + 1) % d];
      const c = nbrs[(j + 2) % d];
      if (a > r && b <= r) {
        k++;
        if (c <= r) k++;
      }
    }
    if (k > 2) {
      throw new Error(`ReadErr(6): too many ring intervals at vertex ${i} in ${cfg.name}`);
    }
  }

  for (let i = 1; i <= n; i++) {
    const nbrs = cfg.vertices[i - 1].neighbors;
    for (let j = 0; j < nbrs.length; j++) {
      // Ring vertices store the outer face between the last and first neighbor.
      // That boundary sector is not paired with a local face at the opposite end.
      if (i <= r && j === nbrs.length - 1) {
        continue;
      }

      const k = nbrs[j];
      const a = nbrs[(j + 1) % nbrs.length];
      const kNbrs = cfg.vertices[k - 1].neighbors;
      let ok = false;
      for (let p = 0; p < kNbrs.length; p++) {
        if (kNbrs[p] === a && kNbrs[(p + 1) % kNbrs.length] === i) {
          ok = true;
          break;
        }
      }
      if (!ok) {
        throw new Error(`ReadErr(7): orientation mismatch at directed edge (${i}, ${k}) in ${cfg.name}`);
      }
    }
  }

  return true;
}

export function parseU2822Conf(text: string): QCConfiguration[] {
  const rawLines = text.replace(/\r\n?/g, '\n').split('\n');
  let idx = 0;
  const configs: QCConfiguration[] = [];

  const nextNonBlank = (): string | null => {
    while (idx < rawLines.length && isBlank(rawLines[idx])) idx++;
    return idx < rawLines.length ? rawLines[idx] : null;
  };

  while (true) {
    const nameLine = nextNonBlank();
    if (nameLine == null) break;
    const name = nameLine.trim();
    idx++;

    if (idx >= rawLines.length) {
      throw new Error(`Unexpected EOF after configuration name ${name}`);
    }
    const header = tokenizeInts(rawLines[idx++]);
    if (header.length !== 4) {
      throw new Error(`Error on line 2 while reading ${name}`);
    }
    const [vertexCount, ringSize, extendableColorings, maxContractSubset] = header;

    if (idx >= rawLines.length) {
      throw new Error(`Unexpected EOF in contract line of ${name}`);
    }
    const contract = parseContractLine(rawLines[idx++], name);

    const vertices: QCVertex[] = [];
    for (let v = 1; v <= vertexCount; v++) {
      if (idx >= rawLines.length) {
        throw new Error(`Unexpected EOF in adjacency of ${name}`);
      }
      vertices.push(parseAdjacencyLine(rawLines[idx++], v, name));
    }

    const coordinates: number[] = [];
    while (coordinates.length < vertexCount) {
      if (idx >= rawLines.length) {
        throw new Error(`Unexpected EOF in coordinates of ${name}`);
      }
      const vals = tokenizeInts(rawLines[idx++]);
      if (vals.length === 0) {
        throw new Error(`Error while reading coordinates of ${name}`);
      }
      coordinates.push(...vals);
    }

    if (idx < rawLines.length && isBlank(rawLines[idx])) idx++;

    const cfg: QCConfiguration = {
      name,
      vertexCount,
      ringSize,
      extendableColorings,
      maxContractSubset,
      contractRaw: contract.raw,
      contractPairs: contract.pairs,
      vertices,
      coordinates: coordinates.slice(0, vertexCount),
    };

    validateConfiguration(cfg);
    configs.push(cfg);
  }

  return configs;
}
