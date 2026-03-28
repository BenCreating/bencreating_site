export default class Base64Codec {
  static alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

  // ========================
  // TEXT ENCODING (UTF-8)
  // ========================

  static encodeText(inputText) {
    const utf8Bytes = new TextEncoder().encode(inputText)

    let binaryString = ""
    for (const byte of utf8Bytes) {
      binaryString += String.fromCharCode(byte)
    }

    return btoa(binaryString)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")
  }

  static decodeText(encodedText) {
    let base64 = encodedText
      .replace(/-/g, "+")
      .replace(/_/g, "/")

    while (base64.length % 4 !== 0) {
      base64 += "="
    }

    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)

    for (let index = 0; index < binaryString.length; index++) {
      bytes[index] = binaryString.charCodeAt(index)
    }

    return new TextDecoder().decode(bytes)
  }

  // ========================
  // NUMBER ENCODING (BASE-64)
  // ========================

  static encodeNumber(numberValue, length = 2) {
    let remainingValue = numberValue
    let encodedResult = ""

    for (let i = 0; i < length; i++) {
      const characterIndex = remainingValue % 64
      encodedResult = this.alphabet[characterIndex] + encodedResult
      remainingValue = Math.floor(remainingValue / 64)
    }

    return encodedResult
  }

  static decodeNumber(encodedString) {
    let decodedValue = 0

    for (let i = 0; i < encodedString.length; i++) {
      const character = encodedString[i]
      const characterIndex = this.alphabet.indexOf(character)

      decodedValue = decodedValue * 64 + characterIndex
    }

    return decodedValue
  }
}
