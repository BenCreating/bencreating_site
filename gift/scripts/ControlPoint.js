export class ControlPoint {
  static randomGridPosition(gridData, pointWidth = 0, pointHeight = pointWidth) {
    const minX = gridData.minX ?? 0
    const minY = gridData.minY ?? 0

    const maxAllowedX = (gridData.maxX ?? gridData.canvasWidth)
    const maxAllowedY = (gridData.maxY ?? gridData.canvasHeight)

    // Ensure the object stays fully inside bounds
    const maxX = maxAllowedX - pointWidth
    const maxY = maxAllowedY - pointHeight

    const clampedMinX = Math.max(0, minX)
    const clampedMinY = Math.max(0, minY)

    const clampedMaxX = Math.max(clampedMinX, Math.min(gridData.canvasWidth - pointWidth, maxX))
    const clampedMaxY = Math.max(clampedMinY, Math.min(gridData.canvasHeight - pointHeight, maxY))

    const pixelX = Math.floor(
      Math.random() * (clampedMaxX - clampedMinX + 1)
    ) + clampedMinX

    const pixelY = Math.floor(
      Math.random() * (clampedMaxY - clampedMinY + 1)
    ) + clampedMinY

    const gridX = Math.round(pixelX / gridData.gridStepWidth)
    const gridY = Math.round(pixelY / gridData.gridStepHeight)

    return { gridX, gridY }
  }

  constructor(bouquet, stepX, stepY, width = 12, height = width) {
    this.bouquet = bouquet
    this.stepX = stepX
    this.stepY = stepY
    this.isSelected = false

    this.width = width
    this.height = height
  }

  setGridPosition(stepX, stepY) {
    this.stepX = stepX
    this.stepY = stepY
  }

  getPixelPosition() {
    return {
      x: this.stepX * this.bouquet.gridStepWidth,
      y: this.stepY * this.bouquet.gridStepHeight
    }
  }

  moveToPixel(x, y) {
    const maxX = this.bouquet.logicalWidth - this.width
    const maxY = this.bouquet.logicalHeight - this.height

    const clampedX = Math.max(0, Math.min(maxX, x))
    const clampedY = Math.max(0, Math.min(maxY, y))

    const newStepX = Math.round(clampedX / this.bouquet.gridStepWidth)
    const newStepY = Math.round(clampedY / this.bouquet.gridStepHeight)

    this.setGridPosition(newStepX, newStepY)
  }

  distanceTo(x, y) {
    const position = this.getPixelPosition()
    return Math.hypot(position.x - x, position.y - y)
  }

  hitTest(x, y) {
    const radius = this.width / 2
    return this.distanceTo(x, y) <= radius
  }
}
