export interface PresentationFile {
  degree: number;
  statements: Statement[];
}

export type Statement = ConditionStatement | SymmetryStatement | ReduceStatement | HubcapStatement;

export interface BaseStatement {
  kind: 'C' | 'S' | 'R' | 'H';
  level: number;
  lineNumber: number;
  raw: string;
}

export interface ConditionStatement extends BaseStatement {
  kind: 'C';
  position: number;
  bound: number;
}

export interface SymmetryStatement extends BaseStatement {
  kind: 'S';
  k: number;
  epsilon: 0 | 1;
  levelRef: number;
  lineRef: number;
}

export interface ReduceStatement extends BaseStatement {
  kind: 'R';
}

export interface HubcapMember {
  x: number;
  y: number;
  value: number;
}

export interface HubcapStatement extends BaseStatement {
  kind: 'H';
  members: HubcapMember[];
}

export interface ProofNode {
  statement: Statement;
  children: ProofNode[];
}

function parseHubcapMembers(input: string, lineNumber: number): HubcapMember[] {
  const members: HubcapMember[] = [];
  const memberRegex = /\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g;
  let match: RegExpExecArray | null;

  while ((match = memberRegex.exec(input)) !== null) {
    members.push({
      x: Number(match[1]),
      y: Number(match[2]),
      value: Number(match[3])
    });
  }

  if (members.length === 0) {
    throw new Error(`Invalid H statement at line ${lineNumber}`);
  }

  return members;
}

export function parsePresentation(text: string): PresentationFile {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const meaningful = lines
    .map((raw, index) => ({ raw, lineNumber: index + 1 }))
    .filter(({ raw }) => raw.trim() !== '');

  if (meaningful.length === 0) {
    throw new Error('Empty presentation file');
  }

  const degreeMatch = meaningful[0].raw.trim().match(/^Degree\s*(\d+)$/);
  if (!degreeMatch) {
    throw new Error(`Expected Degree line at ${meaningful[0].lineNumber}`);
  }

  const degree = Number(degreeMatch[1]);
  const statements: Statement[] = [];

  for (let i = 1; i < meaningful.length; i++) {
    const { raw, lineNumber } = meaningful[i];
    const trimmed = raw.trim();

    if (trimmed === 'Q.E.D.') {
      if (i !== meaningful.length - 1) {
        throw new Error(`Q.E.D. must be last statement (${lineNumber})`);
      }
      return { degree, statements };
    }

    const levelMatch = trimmed.match(/^L(\d+)\s+(.+)$/);
    if (!levelMatch) {
      throw new Error(`Invalid statement syntax at line ${lineNumber}`);
    }

    const level = Number(levelMatch[1]);
    const rest = levelMatch[2].trim();

    if (/^R$/.test(rest)) {
      statements.push({ kind: 'R', level, lineNumber, raw: trimmed });
      continue;
    }

    const conditionMatch = rest.match(/^C\s+(-?\d+)\s+(-?\d+)$/);
    if (conditionMatch) {
      statements.push({
        kind: 'C',
        level,
        lineNumber,
        raw: trimmed,
        position: Number(conditionMatch[1]),
        bound: Number(conditionMatch[2])
      });
      continue;
    }

    const symmetryMatch = rest.match(/^S\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)$/);
    if (symmetryMatch) {
      const epsilon = Number(symmetryMatch[2]);
      if (epsilon !== 0 && epsilon !== 1) {
        throw new Error(`Invalid epsilon in symmetry statement at line ${lineNumber}`);
      }
      statements.push({
        kind: 'S',
        level,
        lineNumber,
        raw: trimmed,
        k: Number(symmetryMatch[1]),
        epsilon,
        levelRef: Number(symmetryMatch[3]),
        lineRef: Number(symmetryMatch[4])
      });
      continue;
    }

    const hubcapMatch = rest.match(/^H\s+(.+)$/);
    if (hubcapMatch) {
      statements.push({
        kind: 'H',
        level,
        lineNumber,
        raw: trimmed,
        members: parseHubcapMembers(hubcapMatch[1], lineNumber)
      });
      continue;
    }

    throw new Error(`Unknown statement at line ${lineNumber}: ${trimmed}`);
  }

  throw new Error('Missing Q.E.D.');
}

export function buildProofForest(statements: Statement[]): ProofNode[] {
  const roots: ProofNode[] = [];
  const stack: ProofNode[] = [];

  for (const statement of statements) {
    const node: ProofNode = { statement, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].statement.level >= statement.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    if (statement.kind === 'C') {
      stack.push(node);
    }
  }

  return roots;
}
