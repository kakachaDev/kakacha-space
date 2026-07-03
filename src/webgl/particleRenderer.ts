export function hexToRgbFloat(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

const VERTEX_SHADER = `
attribute vec2 aPosition;
attribute float aRadius;
attribute float aOpacity;
uniform vec2 uResolution;
varying float vOpacity;
void main() {
  vec2 clipSpace = (aPosition / uResolution) * 2.0 - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  gl_PointSize = aRadius * 2.0;
  vOpacity = aOpacity;
}
`

const FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 uColor;
varying float vOpacity;
void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;
  float alpha = (1.0 - smoothstep(0.3, 0.5, dist)) * vOpacity;
  gl_FragColor = vec4(uColor, alpha);
}
`

interface RenderableParticle {
  x: number
  y: number
  radius: number
  opacity: number
}

export class ParticleGLRenderer {
  private gl: WebGLRenderingContext
  private program: WebGLProgram
  private positionBuffer: WebGLBuffer
  private radiusBuffer: WebGLBuffer
  private opacityBuffer: WebGLBuffer
  private color: [number, number, number]

  constructor(gl: WebGLRenderingContext, colorHex: string) {
    this.gl = gl
    this.color = hexToRgbFloat(colorHex)
    this.program = this.compileProgram()
    this.positionBuffer = gl.createBuffer()!
    this.radiusBuffer = gl.createBuffer()!
    this.opacityBuffer = gl.createBuffer()!
  }

  private compileShader(type: number, source: string): WebGLShader {
    const gl = this.gl
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader)
      gl.deleteShader(shader)
      throw new Error(`Shader compile error: ${info}`)
    }
    return shader
  }

  private compileProgram(): WebGLProgram {
    const gl = this.gl
    const vertexShader = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER)
    const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program)
      throw new Error(`Program link error: ${info}`)
    }
    return program
  }

  draw(particles: RenderableParticle[], width: number, height: number): void {
    const gl = this.gl
    gl.viewport(0, 0, width, height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.useProgram(this.program)

    const positions = new Float32Array(particles.length * 2)
    const radii = new Float32Array(particles.length)
    const opacities = new Float32Array(particles.length)
    particles.forEach((p, i) => {
      positions[i * 2] = p.x
      positions[i * 2 + 1] = p.y
      radii[i] = p.radius
      opacities[i] = p.opacity
    })

    const aPosition = gl.getAttribLocation(this.program, 'aPosition')
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    const aRadius = gl.getAttribLocation(this.program, 'aRadius')
    gl.bindBuffer(gl.ARRAY_BUFFER, this.radiusBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, radii, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(aRadius)
    gl.vertexAttribPointer(aRadius, 1, gl.FLOAT, false, 0, 0)

    const aOpacity = gl.getAttribLocation(this.program, 'aOpacity')
    gl.bindBuffer(gl.ARRAY_BUFFER, this.opacityBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, opacities, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(aOpacity)
    gl.vertexAttribPointer(aOpacity, 1, gl.FLOAT, false, 0, 0)

    const uResolution = gl.getUniformLocation(this.program, 'uResolution')
    gl.uniform2f(uResolution, width, height)
    const uColor = gl.getUniformLocation(this.program, 'uColor')
    gl.uniform3f(uColor, this.color[0], this.color[1], this.color[2])

    gl.drawArrays(gl.POINTS, 0, particles.length)
  }
}
