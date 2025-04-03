export default function generateCode(number = 6): string {
  const random = String(Math.random()).split('.')[1]
  const code = random.slice(0, number)
  return code
}
