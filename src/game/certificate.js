// Draws a certificate on a canvas and downloads it as a PNG. No external libs.
export function downloadCertificate({ name, rank }) {
  const W = 1200
  const H = 850
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Background + decorative borders
  ctx.fillStyle = '#fff7ed'
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = '#7c3aed'
  ctx.lineWidth = 18
  ctx.strokeRect(28, 28, W - 56, H - 56)
  ctx.strokeStyle = '#facc15'
  ctx.lineWidth = 5
  ctx.strokeRect(52, 52, W - 104, H - 104)

  ctx.textAlign = 'center'

  ctx.fillStyle = '#7c3aed'
  ctx.font = 'bold 62px Georgia, serif'
  ctx.fillText('Certificate of Achievement', W / 2, 175)

  ctx.font = '40px Georgia, serif'
  ctx.fillStyle = '#475569'
  ctx.fillText('This certifies that', W / 2, 290)

  ctx.font = 'bold 74px Georgia, serif'
  ctx.fillStyle = '#fb7185'
  ctx.fillText(name && name.trim() ? name.trim() : 'GK Champion', W / 2, 385)

  ctx.font = '34px Georgia, serif'
  ctx.fillStyle = '#475569'
  ctx.fillText('has completed the 90-Day GK Champion Challenge', W / 2, 470)
  ctx.fillText(`and earned the rank of ${rank || 'GK Grandmaster'}!`, W / 2, 520)

  ctx.font = '90px serif'
  ctx.fillText('🏆', W / 2, 645)

  ctx.font = '26px Georgia, serif'
  ctx.fillStyle = '#64748b'
  ctx.fillText(`Awarded on ${new Date().toLocaleDateString()}`, W / 2, 730)
  ctx.font = 'italic 24px Georgia, serif'
  ctx.fillText('GK Quest — 90-Day GK Champion Challenge', W / 2, 770)

  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gk-quest-certificate.png'
    a.click()
    URL.revokeObjectURL(url)
  })
}
