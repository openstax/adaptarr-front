export default function saveAs(filename: string, data: string, type?: string) {
  const blob = new Blob([data], { type: type ? type : 'text/plain' })
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename)
  } else {
    const elem = window.document.createElement('a')
    elem.href = window.URL.createObjectURL(blob)
    elem.download = filename
    document.body.appendChild(elem)
    elem.click()
    window.URL.revokeObjectURL(elem.href)
    document.body.removeChild(elem)
  }
}
