import html2canvas from 'html2canvas'
import { Bouquet } from "./Bouquet.js"
import flowerList from "./flowerList.js"
import Palette from "./Palette.js"
import Base64Codec from "./Base64Codec.js"

export default class FlowerApp {
  constructor({ canvas, counter, textarea, palette, mode, readOnly }) {
    this.canvas = canvas
    this.counter = counter
    this.textarea = textarea
    this.paletteElement = palette
    this.mode = mode

    this.setupCanvasResolution()

    this.bouquet = new Bouquet(canvas, counter, textarea, { readOnly })

    if (palette) {
      this.palette = new Palette(palette, this.bouquet, flowerList)
    }

    this.loadFromUrl()
  }

  loadFromUrl() {
    const params = new URLSearchParams(window.location.search)

    if (params.has("d")) {
      this.bouquet.load(params.get("d"))
    }

    if (params.has("m")) {
      this.textarea.value = Base64Codec.decodeText(params.get("m"))
      this.autoResizeTextarea()
    }
  }

  buildUrl(includeMessage = true) {
    const url = new URL(window.location.href)
    url.pathname = import.meta.env.BASE_URL + 'gift/'

    url.searchParams.set("d", this.bouquet.serialize())

    if (includeMessage && this.textarea.value.length > 0) {
      url.searchParams.set("m", Base64Codec.encodeText(this.textarea.value))
    }

    return url
  }

  autoResizeTextarea() {
    const el = this.textarea

    el.style.height = "auto"
    el.style.height = el.scrollHeight + "px"
  }

  async downloadImage() {
    const giftElement = document.getElementById("gift")

    // Hide textarea and insert mirror
    const mirror = this.createTextareaMirror()
    this.textarea.style.display = "none"
    this.textarea.parentNode.insertBefore(mirror, this.textarea)

    try {
      const canvas = await html2canvas(giftElement, {
        scale: window.devicePixelRatio
      })

      canvas.toBlob(blob => {
        if (!blob) return

        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "bouquet.png"

        document.body.appendChild(link)
        link.click()

        // Cleanup
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, "image/png")

    } catch (error) {
      console.error("Failed to generate image:", error)
    } finally {
      mirror.remove()
      this.textarea.style.display = ""
    }
  }

  // The textarea element doesn't render well with html2canvas, so we create a div that looks like it instead.
  createTextareaMirror() {
    const mirror = document.createElement("div")
    mirror.className = this.textarea.className
    mirror.textContent = this.textarea.value

    mirror.style.whiteSpace = "pre-wrap"
    mirror.style.wordBreak = "break-word"
    mirror.style.width = this.textarea.offsetWidth + "px"
    mirror.style.minHeight = this.textarea.offsetHeight + "px"

    return mirror
  }

  setupCanvasResolution() {
    const ratio = window.devicePixelRatio || 1
    const rect = this.canvas.getBoundingClientRect()

    this.canvas.width = rect.width * ratio
    this.canvas.height = rect.height * ratio

    this.canvas.style.width = rect.width + "px"
    this.canvas.style.height = rect.height + "px"

    const context = this.canvas.getContext("2d")
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
  }
}
