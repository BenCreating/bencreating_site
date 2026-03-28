import Base64Codec from './Base64Codec.js'
import { Flower } from "./Flower.js"
import flowerList from './flowerList.js'

const maxFlowers = 10
const maxPositions = 64 * 64

export class Bouquet {
  constructor(canvas, counter, messageBox, options = {}){
    this.canvas = canvas
    this.context = canvas.getContext("2d")
    this.counter = counter
    this.messageBox = messageBox
    this.readOnly = options.readOnly ?? false

    this.canvasWidth = canvas.width
    this.canvasHeight = canvas.height

    this.flowers = []

    this.selectedObject = null
    this.draggedObject = null

    this.calculateGrid()
    this.setupEvents()
    this.draw()
  }

  calculateGrid(){
    const aspectRatio = this.canvasWidth / this.canvasHeight

    this.gridWidthSteps = Math.ceil(Math.sqrt(maxPositions * aspectRatio))
    this.gridHeightSteps = Math.ceil(maxPositions / this.gridWidthSteps)

    this.gridStepWidth = this.canvasWidth / this.gridWidthSteps
    this.gridStepHeight = this.canvasHeight / this.gridHeightSteps
  }

  addFlower(flowerData){
    if(this.flowers.length >= maxFlowers) return

    const flowerGridData = {
      canvasWidth: this.canvasWidth,
      canvasHeight:this.canvasHeight,
      gridStepWidth: this.gridStepWidth,
      gridStepHeight: this.gridStepHeight,
      minX: Math.floor(this.canvasWidth / 5),
      maxX: Math.floor(this.canvasWidth / 5) * 4,
      maxY: Math.floor(this.canvasHeight / 2)
    }
    const stemGridData = {
      canvasWidth: this.canvasWidth,
      canvasHeight:this.canvasHeight,
      gridStepWidth: this.gridStepWidth,
      gridStepHeight: this.gridStepHeight,
      minX: Math.floor(this.canvasWidth / 2) - 20,
      maxX: Math.floor(this.canvasWidth / 2) + 20,
      minY: (Math.floor(this.canvasHeight / 6) * 5) - 10,
      maxY: (Math.floor(this.canvasHeight / 6) * 5) + 10
    }
    const { gridX: flowerGridX, gridY: flowerGridY } = Flower.randomGridPosition(flowerGridData, 80)
    const { gridX: stemGridX, gridY: stemGridY } = Flower.randomGridPosition(stemGridData)

    const flower = new Flower(this, flowerData, flowerGridX, flowerGridY, stemGridX, stemGridY)
    this.flowers.push(flower)
    this.selectedObject = flower

    this.updateCounter()
  }

  setupEvents(){
    if (this.readOnly) return

    this.canvas.onpointerdown = this.mouseDown.bind(this)
    this.canvas.onpointermove = this.mouseMove.bind(this)
    this.canvas.onpointerup = this.mouseUp.bind(this)
  }

  mouseDown(event) {
    const rect = this.canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    this.selectedObject = null
    this.flowers.forEach(flower => flower.isSelected = false)

    for(const flower of this.flowers.toReversed()) {
      const flowerBase = flower.basePoint

      const hitFlower = flower.hitTest(x, y)
      const hitBase = flowerBase.hitTest(x, y)
      if (!hitFlower && !hitBase) continue

      this.draggedObject = hitFlower ? flower : flowerBase
      this.selectedObject = flower
      flower.isSelected = true

      this.dragOffset = {
        x: this.draggedObject.getPixelPosition().x - x,
        y: this.draggedObject.getPixelPosition().y - y
      }
      break
    }

    if (this.selectedObject) {
      this.flowers = this.flowers.filter(flower => !flower.isSelected)
      this.flowers.push(this.selectedObject)
    }

    this.draw()
  }

  mouseMove(event) {
    if(!this.draggedObject) return

    const rect = this.canvas.getBoundingClientRect()
    const x = event.clientX - rect.left + this.dragOffset.x
    const y = event.clientY - rect.top + this.dragOffset.y

    this.draggedObject.moveToPixel(x, y)
    this.draw()
  }

  mouseUp(_event) {
    this.draggedObject = null
  }

  draw(){
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

    this.flowers.forEach(flower => {
      flower.draw(this.context)
    })
  }

  serialize(){
    let result = ""

    for(const flower of this.flowers){
      const flowerIndex = flowerList.findIndex(f => f.id === flower.data.id)

      const encodePoint = point => {
        const combined = point.stepY * this.gridWidthSteps + point.stepX
        return Base64Codec.encodeNumber(combined, 2)
      }

      result += flowerIndex.toString(36)
      result += encodePoint(flower)
      result += encodePoint(flower.basePoint)
    }

    return result
  }

  load(string){
    for(let i = 0; i < string.length; i += 5){
      const flowerIndex = parseInt(string[i], 36)

      const decodePoint = str => {
        const combined = Base64Codec.decodeNumber(str)
        return {
          stepY: Math.floor(combined / this.gridWidthSteps),
          stepX: combined % this.gridWidthSteps
        }
      }

      const flowerPos = decodePoint(string.slice(i+1, i+3))
      const basePos = decodePoint(string.slice(i+3, i+5))

      const flower = new Flower(this, flowerList[flowerIndex], flowerPos.stepX, flowerPos.stepY)

      flower.basePoint.setGridPosition(basePos.stepX, basePos.stepY)

      this.flowers.push(flower)
    }

    this.draw()
  }

  deleteSelected(){
    this.flowers = this.flowers.filter(f => f !== this.selectedObject)
    this.selectedObject = null

    this.updateCounter()
    this.draw()
  }

  updateCounter() {
    const flowerCount = this.flowers.length
    this.counter.textContent = `${flowerCount} / ${maxFlowers}`
  }
}
