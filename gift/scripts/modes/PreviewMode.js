import FlowerApp from "../FlowerApp.js"

class PreviewMode {
  constructor() {
    this.app = new FlowerApp({
      canvas: document.getElementById("bouquetCanvas"),
      counter: document.getElementById("counter"),
      textarea: document.getElementById("message"),
      palette: null,
      mode: "preview",
      readOnly: true
    })

    this.setupUI()
  }

  setupUI() {
    const { textarea } = this.app
    textarea.readOnly = true

    document.getElementById("edit").onclick = () => {
      const url = this.app.buildUrl()
      url.pathname = "/edit.html"
      window.location = url.toString()
    }

    document.getElementById("share").onclick = async () => {
      const url = this.app.buildUrl()
      url.pathname = "/view.html"

      try {
        await navigator.clipboard.writeText(url.toString())

        const button = document.getElementById("share")
        const originalText = button.textContent

        button.textContent = "Copied!"
        setTimeout(() => {
          button.textContent = originalText
        }, 1500)

      } catch (error) {
        // Fallback if clipboard API fails
        prompt("Copy this link:", url.toString())
      }
    }
  }
}

new PreviewMode()
