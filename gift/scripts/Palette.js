export default class Palette {
  constructor(el, bouquet, flowerData) {
    this.el = el
    this.bouquet = bouquet

    flowerData.forEach(f => {
      const img = document.createElement("img")
      img.src = f.src

      img.onclick = () => bouquet.addFlower(f)

      el.appendChild(img)
    })
  }
}
