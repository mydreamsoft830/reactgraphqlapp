class CSV {
  static decodeCSV (payload) {
    let lineOffset = 0

    const lines = payload.toString().split('\n')
    const additionalData = {}

    if (lines[0].startsWith('filename')) {
      lineOffset++

      const [key, value] = lines[0].split('=')
      additionalData[key.trim()] = value.trim()
    }

    const headers = lines[lineOffset].split(',').map((h) => h.trim())
    const data = []

    for (let i = lineOffset + 1; i < lines.length; i++) {
      const line = lines[i]
      const values = line.split(',').map((h) => h.trim())
      const row = {}

      for (let j = 0; j < headers.length; j++) {
        const value = values[j]
        row[headers[j]] = value
      }
      data.push(Object.assign(row, additionalData))
    }

    return data
  }
}

export default CSV
