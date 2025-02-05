import React from 'react'
// const API_KEY = process.env.NEXT_PUBLIC_API_KEY
type CurrencySelectorProps = {
  value: string
  onChange: (currency: string) => void
  currencies: string[]
}
const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  value,
  onChange,
  currencies
}) => {
  return (
    <div className='mb-4'>
      <label className='block text-sm font-medium text-gray-700'>
        Select Currency
      </label>
      <select
        className='mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CurrencySelector
// export async function getStaticProps() {
//   try {
//     const url = `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}`
//     const response = await fetch(url)
//     if (!response.ok) {
//       throw new Error('Failed to fetch data')
//     }
//     const data = await response.json()
//     return {
//       props: {
//         rates: data.map((currency: { code: string }) => currency.code),
//         error: ''
//       }
//     }
//   } catch (error) {
//     return {
//       props: {
//         rates: [],
//         error: (error as Error).message
//       }
//     }
//   }
// }
