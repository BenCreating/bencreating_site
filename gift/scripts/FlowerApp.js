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
    url.pathname = url.pathname.substring(0, url.pathname.lastIndexOf("/") + 1)

    url.searchParams.set("d", this.bouquet.serialize())

    if (includeMessage && this.textarea.value.length > 0) {
      url.searchParams.set("m", Base64Codec.encodeText(this.textarea.value))
    }

    return url
  }

  autoResizeTextarea(maxHeight = 280) {
    const el = this.textarea

    el.style.height = "auto"
    const newHeight = Math.min(el.scrollHeight, maxHeight)
    el.style.height = newHeight + "px"

    el.style.overflowY =
      el.scrollHeight > maxHeight ? "auto" : "hidden"
  }
}
