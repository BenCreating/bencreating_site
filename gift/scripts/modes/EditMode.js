import FlowerApp from "../FlowerApp.js"

class EditMode {
  constructor() {
    this.app = new FlowerApp({
      canvas: document.getElementById("bouquetCanvas"),
      counter: document.getElementById("counter"),
      textarea: document.getElementById("message"),
      palette: document.getElementById("palette"),
      mode: "edit"
    })

    this.setupUI()
  }

  setupUI() {
    const { bouquet, textarea } = this.app

    textarea.addEventListener("input", () => {
      this.app.autoResizeTextarea()
    })

    document.getElementById("delete").onclick =
      () => bouquet.deleteSelected()

    document.getElementById("preview").onclick = () => {
      const url = this.app.buildUrl()
      url.pathname += "preview.html"
      window.location = url.toString()
    }
  }
}

new EditMode()
