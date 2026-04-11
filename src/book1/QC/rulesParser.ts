export interface RuleVertexConstraint {
  index: number;
  beta: number;
  delta: number;
}

export interface Rule {
  number: number;
  v0: [number, number];
  v1: [number, number];
  vertices: RuleVertexConstraint[];
  invert?: boolean;
}

function decodePair(token: string): [number, number] {
  if (token.length === 1) {
    const v = Number(token);
    return [v, v];
  }
  if (token.length === 2) {
    return [Number(token[0]), Number(token[1])];
  }
  throw new Error(`Invalid encoded pair: ${token}`);
}

export function parseRules(text: string): Rule[] {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const rules: Rule[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    if (line === '' || line.startsWith('#')) {
      i++;
      continue;
    }

    const headerMatch = line.match(/^(\d+)\s+([0-9]+)\s+([0-9]+)/);
    if (!headerMatch) {
      i++;
      continue;
    }

    const number = Number(headerMatch[1]);
    const v0 = decodePair(headerMatch[2]);
    const v1 = decodePair(headerMatch[3]);

    i++;

    const vertices: RuleVertexConstraint[] = [];
    let invert = false;

    while (i < lines.length) {
      const l = lines[i].trim();

      if (l === '') {
        i++;
        break;
      }

      if (l === 'invert') {
        invert = true;
        i++;
        break;
      }

      const tripleRegex = /(\d+)\s+([0-9]+)/g;
      let m: RegExpExecArray | null;

      while ((m = tripleRegex.exec(l)) !== null) {
        const index = Number(m[1]);
        const [beta, delta] = decodePair(m[2]);
        vertices.push({ index, beta, delta });
      }

      i++;
    }

    rules.push({ number, v0, v1, vertices, invert });
  }

  return rules;
}
