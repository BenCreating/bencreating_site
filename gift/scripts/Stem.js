export class Stem {
  constructor(flower, basePoint){
    this.flower = flower
    this.basePoint = basePoint
  }

  draw(context){
    const P0 = this.flower.getCenter()
    const P2 = this.basePoint.getPixelPosition()
    const Q = {
      x: P2.x - 0.3 * (P2.x - P0.x),
      y: P0.y + 0.3 * (P2.y - P0.y)
    }

    let t = this.estimateT(P0, Q, P2)
    const control = this.controlFromPointOnCurve(P0, Q, P2, t)

    context.beginPath()
    context.moveTo(P0.x, P0.y)
    context.quadraticCurveTo(control.x, control.y, P2.x, P2.y)

    // Outline
    context.lineWidth = 6
    context.strokeStyle = "#67987f"
    context.stroke()

    // Fill
    context.lineWidth = 3
    context.strokeStyle = "#94ddc1"
    context.stroke()
  }

  controlFromPointOnCurve(P0, Q, P2, t = 0.5) {
    const mt = 1 - t
    const denom = 2 * mt * t

    return {
      x: (Q.x - mt * mt * P0.x - t * t * P2.x) / denom,
      y: (Q.y - mt * mt * P0.y - t * t * P2.y) / denom
    }
  }

  estimateT(P0, Q, P2) {
    const vx = P2.x - P0.x
    const vy = P2.y - P0.y

    const wx = Q.x - P0.x
    const wy = Q.y - P0.y

    const len2 = vx * vx + vy * vy
    if (len2 === 0) return 0.5

    // Project Q onto the line (gives t along infinite line)
    let t = (wx * vx + wy * vy) / len2

    // Clamp to segment (important!)
    t = Math.max(0.05, Math.min(0.95, t))

    return t
  }
}
