'use client'
import React, { useEffect, useState, useMemo } from 'react'
import CurrencySelector from '@/components/CurrencySelector'
import ExchangeRateList from '@/components/ExchangeRates'
import { fetchRates } from '@/lib/currencyApi'
import NavButtons from '@/components/NavButtons'

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
      } catch {
        setError('An error occurred while fetching exchange rates')
      } finally {
        setLoading(false)
      }
    }

    loadRates()
  }, [base])

  const currencyKeys = useMemo(() => Object.keys(rates), [rates])

  return (
    <section className='px-4 h-full md:p-[60px] w-full'>
      <div className='m-auto h-full flex max-w-[1042px] flex-col'>
        <h1 className='text-center text-[56px] font-semibold tracking-[-1px] xl:text-[68px] mb-2 xl:mb-[60px]'>
          Currency Listing
        </h1>
        <div className='mr-3 mt-4 flex flex-col gap-6 rounded-[24px] border-[2px] border-[#99A2FF] bg-white p-6 shadow-[12px_-12px_0_0_#99A2FF] xl:mr-0 xl:gap-4 xl:px-[30px] xl:py-5 xl:shadow-[16px_-16px_0_0_#99A2FF]'>
          <NavButtons currentUrl='/list' />
          <CurrencySelector
            value={base}
            onChange={setBase}
            currencies={currencyKeys}
          />
        </div>

        {error && <p>{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className='h-full md:overflow-y-hidden'>
            <ExchangeRateList rates={rates} base={base} />
          </div>
        )}
      </div>
    </section>
  )
}
