import type { QCConfiguration } from './parser'

export interface RenderOptions {
  width?: number
  height?: number
  showLabels?: boolean
  nodeRadius?: number
}

function polarLayout(cfg: QCConfiguration) {
  const n = cfg.vertexCount
  const r = cfg.ringSize

  const coords: Array<{x:number,y:number}> = new Array(n+1)

  const R = 200
  const cx = 250
  const cy = 250

  // ring
  for (let i=1;i<=r;i++){
    const angle = (2*Math.PI*(i-1))/r
    coords[i] = {
      x: cx + R*Math.cos(angle),
      y: cy + R*Math.sin(angle)
    }
  }

  // interior vertices (simple radial fallback)
  const innerR = R*0.55
  const countInner = n-r
  for (let i=0;i<countInner;i++){
    const v = r+1+i
    const angle = (2*Math.PI*i)/countInner
    coords[v] = {
      x: cx + innerR*Math.cos(angle),
      y: cy + innerR*Math.sin(angle)
    }
  }

  return coords
}

export function renderSVG(cfg: QCConfiguration, opts: RenderOptions = {}){
  const width = opts.width ?? 500
  const height = opts.height ?? 500
  const showLabels = opts.showLabels ?? true
  const radius = opts.nodeRadius ?? 6

  const coords = polarLayout(cfg)

  let edges = ''
  for(const v of cfg.vertices){
    const p1 = coords[v.id]
    for(const n of v.neighbors){
      if(n > v.id){
        const p2 = coords[n]
        edges += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#444" stroke-width="1" />\n`
      }
    }
  }

  let nodes = ''
  for(const v of cfg.vertices){
    const p = coords[v.id]
    nodes += `<circle cx="${p.x}" cy="${p.y}" r="${radius}" fill="#fff" stroke="#000" />\n`
    if(showLabels){
      nodes += `<text x="${p.x+8}" y="${p.y+4}" font-size="10">${v.id}</text>\n`
    }
  }

  return `<?xml version="1.0"?>
<svg width="${width}" height="${height}" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
${edges}
${nodes}
</svg>`
}

export function renderHTML(cfg: QCConfiguration){
  const svg = renderSVG(cfg)
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${cfg.name}</title>
</head>
<body>
${svg}
</body>
</html>`
}

export function renderAll(configs: QCConfiguration[]){
  return configs.map(cfg => ({
    name: cfg.name,
    svg: renderSVG(cfg)
  }))
}
