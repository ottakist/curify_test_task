const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export async function fetchRates(baseCurrency: string | null) {
  const url = `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}${
    baseCurrency ? `&base_currency=${baseCurrency}` : ''
  }`

  try {
    const res = await fetch(url)
    const data = await res.json()
    if (!data || !data.data) {
      return {
        state: 'error'
      }
    }

    const rates: Record<string, number> = {}
    Object.keys(data.data).forEach((currency) => {
      rates[currency] = data.data[currency].value
    })

    return { rates, state: 'success' }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return { state: 'error' }
  }
}
export async function convertCurrencies(from: string, to: string) {
  let state = 'loading'
  const url = `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&currencies=${from}&base_currency=${to}`
  const res = await fetch(url)
  const data = await res.json()
  if (!data || !data.data)
    return {
      state: 'error'
    }
  console.log(data)
  const {
    data: {
      [from]: { value }
    }
  } = data
  state = 'success'
  return { value, state }
}
