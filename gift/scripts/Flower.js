import { ControlPoint } from "./ControlPoint.js"
import { Stem } from "./Stem.js"

export class Flower extends ControlPoint {
  constructor(bouquet, flowerData, stepX, stepY, stemStepX = stepX, stemStepY = stepY){
    super(bouquet, stepX, stepY, 80)

    this.data = flowerData
    this.image = new Image()
    this.image.src = flowerData.src

    this.image.onload = () => {
      this.bouquet.draw()
    }

    this.basePoint = new ControlPoint(bouquet, stemStepX, stemStepY)

    this.stem = new Stem(this, this.basePoint)
    this.currentAngle = null
  }

  updateFlowerImage() {
    if (!this.data.angle_increment) return

    const tangent = this.stem.getTopTangent()
    let angle = Math.atan2(-tangent.x, tangent.y) * (180 / Math.PI)
    if (angle < 0) angle += 360

    const increment = this.data.angle_increment
    const angleIndex = Math.round(angle / increment) * increment
    const normalizedAngle = (angleIndex + 360) % 360

    if (this.currentAngle !== normalizedAngle) {
      this.currentAngle = normalizedAngle
      const folder = this.data.src.substring(0, this.data.src.lastIndexOf('/'))
      const ext = this.data.src.substring(this.data.src.lastIndexOf('.'))
      this.image.src = `${folder}/${this.data.id}_${normalizedAngle}${ext}`
    }
  }

  getCenter(){
    const position = this.getPixelPosition()
    return {
      x: position.x + this.width / 2,
      y: position.y + this.height / 2
    }
  }

  draw(context){
    this.updateFlowerImage()
    this.stem.draw(context)

    const position = this.getPixelPosition()
    context.drawImage(this.image, position.x, position.y, this.width, this.height)

    if(this.bouquet.selectedObject === this){
      context.strokeStyle = "hotpink"
      context.lineWidth = 2
      context.strokeRect(position.x, position.y, this.width, this.height)

      this.drawHandle(context, this.basePoint, "brown")
    }
  }

  drawHandle(context, point, color){
    const position = point.getPixelPosition()
    const radius = point.width / 2

    context.beginPath()
    context.arc(position.x, position.y, radius, 0, Math.PI * 2)
    context.fillStyle = color
    context.fill()
    context.strokeStyle = "white"
    context.stroke()
  }

  hitTest(x, y) {
    const position = this.getPixelPosition()
    return (
      x >= position.x &&
      x <= position.x + this.width &&
      y >= position.y &&
      y <= position.y + this.height
    )
  }
}
