const updateImgSrcs = (cnxml: string, id: string) => {
  const p = new DOMParser()
  let xmlDoc = p.parseFromString(cnxml, 'application/xml')
  xmlDoc.querySelectorAll('image').forEach(img => {
    img.setAttribute('src', `/api/v1/modules/${id}/files/${img.getAttribute('src')}`)
  })
  return new XMLSerializer().serializeToString(xmlDoc)
}

export default updateImgSrcs
