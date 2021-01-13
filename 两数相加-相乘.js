// 两数相加 大数相加

function add(num1, num2) {
  let len = Math.max(num1.length, num2.length)

  num1 = num1.padStart(len, '0')
  num2 = num2.padStart(len, '0')

  let result = []
  let carry = 0

  for (let i = len - 1; i >= 0; i--) {
    let sum = Number(num1[i]) + Number(num2[i]) + carry
    carry = parseInt(sum / 10)
    result.unshift(sum % 10)
  }

  carry !== 0 && result.unshift(carry)

  return result.join('')
}


console.log(add('199', '56'));
