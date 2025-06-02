// 输入一个日期 返回几秒前 几天前或者几月前

function duration(ms) {
  if (ms < 0) ms = -ms
  const time = {
    month: Math.floor(ms / ((365 / 12) * 24 * 60 * 60 * 1000)),
    day: Math.floor(ms / (24 * 60 * 60 * 1000)),
    hour: Math.floor(ms / (60 * 60 * 1000)) % 24,
    miniute: Math.floor(ms / (60 * 1000)) % 60,
    second: Math.floor(ms / 1000) % 60,
    millisecond: Math.floor(ms) % 1000
  }

  return Object.entries(time).map(([key, val]) => `${val} ${key}`).join(', ')
}

console.log(duration(11111528479));