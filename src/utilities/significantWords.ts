function significantWords(number: number): string {
  if (number < 0) {
    return `Negative ${significantWords(-number)}`
  }
  else if (number < 100) {
    return number.toFixed(number < 10 ? 1 : 0).replace('.0', '')
  }
  else if (number < 1e3 - 1e2 / 2) {
    return `${significantWords(number / 1e2)} Hundred`
  }
  else if (number < 1e5 - 1e3 / 2) {
    return `${significantWords(number / 1e3)} Thousand`
  }
  else if (number < 1e7 - 1e5 / 2) {
    return `${significantWords(number / 1e5)} Lakh`
  }
  else {
    return `${significantWords(number / 1e7)} Crore`
  }
}

export default significantWords
