import FlowerApp from "../FlowerApp.js"

class ShareMode {
  constructor() {
    this.app = new FlowerApp({
      canvas: document.getElementById("bouquetCanvas"),
      counter: null,
      textarea: document.getElementById("message"),
      palette: null,
      mode: "share",
      readOnly: true
    })

    this.setupUI()
  }

  setupUI() {
    document.getElementById("download").addEventListener("click", () => {
      this.app.downloadImage()
    })
  }
}

new ShareMode()
