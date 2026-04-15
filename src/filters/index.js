const filters = {
  formatDate(date, format) {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')
    
    if (format === 'YYYY-MM-DD') {
      return `${year}-${month}-${day}`
    } else if (format === 'YYYY-MM-DD HH:mm:ss') {
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
}

export default filters
