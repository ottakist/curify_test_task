'use client'
import CurrencySelector from '@/components/CurrencySelector'
import ExchangeRateList from '@/components/ExchangeRates'
import { fetchRates } from '@/lib/currencyApi'
import { useEffect, useState } from 'react'

export default function RatesPage() {
  const [base, setBase] = useState('USD')
  const [rates, setRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRates() {
      setLoading(true)
      setError(null)

      try {
        const fetchedRates = await fetchRates(base)
        if (fetchedRates.state === 'success' && fetchedRates.rates) {
          setRates(fetchedRates.rates)
        } else {
          setError('Failed to fetch exchange rates')
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('An error occurred while fetching exchange rates')
      } finally {
        setLoading(false)
      }
    }

    loadRates()
  }, [base])

  return (
    <div>
      <h1>Exchange Rates</h1>

      <>
        <CurrencySelector
          value={base}
          onChange={setBase}
          currencies={Object.keys(rates)}
        />
        {error && <p>{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ExchangeRateList rates={rates} base={base} />
        )}
      </>
    </div>
  )
}
