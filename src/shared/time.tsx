export const time = (date = new Date()) => {
  const api = {
    format: (pattern = 'YYYY-MM-DD') => {
      // 目前支持的格式有 YYYY MM DD mm ss SSS
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      const millisecond = date.getMilliseconds()
      return pattern.replace(/YYYY/g, year.toString())
        .replace(/MM/g, month.toString().padStart(2, '0'))
        .replace(/DD/g, day.toString().padStart(2, '0'))
        .replace(/hh/g, hour.toString().padStart(2, '0'))
        .replace(/mm/g, minute.toString().padStart(2, '0'))
        .replace(/ss/g, second.toString().padStart(2, '0'))
        .replace(/SSS/g, millisecond.toString().padStart(3, '0'))
    }
  }
  return api
}