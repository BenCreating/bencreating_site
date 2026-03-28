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
    document.getElementById("create").onclick = () => {
      window.location = "/edit.html"
    }
  }
}

new ShareMode()
