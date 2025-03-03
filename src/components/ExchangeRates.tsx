import React from 'react'

type ExchangeRateListProps = {
  rates: Record<string, number>
  base: string
}

const ExchangeRateList: React.FC<ExchangeRateListProps> = ({ rates, base }) => {
  return (
    <div className='p-4 h-full overflow-y-auto scrollbar bg-white rounded-lg shadow-md '>
      <h2 className='text-xl font-semibold mb-4'>Exchange Rates</h2>
      <ul className='space-y-2 text-md font-medium '>
        {Object.entries(rates).map(([currency, value]) => (
          <li key={currency} className='flex justify-between border-b pb-2'>
            <span className='font-medium'>1 {currency} =</span>
            <span className='text-black font-semibold'>
              {value.toFixed(2)}
              {base}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ExchangeRateList
