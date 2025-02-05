/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useEffect, useRef, useState } from 'react'
import CurrencySelector from '@/components/CurrencySelector'
import { fetchRates, convertCurrencies } from '@/lib/currencyApi'

export default function index() {
  const [amount, setAmount] = useState(1)
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('UAH')
  const [result, setResult] = useState<number | null>(null)
  const [rates, setRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const coefficient = useRef(1)
  const resultMessage = useRef('')

  useEffect(() => {
    async function loadRates() {
      const fetchedRates = await fetchRates(null)
      if (fetchedRates.state === 'success' && fetchedRates.rates) {
        setRates(fetchedRates.rates)
      } else {
        setError('Failed to load exchange rates.')
      }
    }
    loadRates()
  }, [])
  const handleConvert = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    resultMessage.current = ''
    try {
      const res = await convertCurrencies(from, to)
      if (res.state === 'success' && res.value !== null) {
        coefficient.current = res.value
        setResult(amount / res.value)
        resultMessage.current = `${amount} ${from} = ${(
          amount / res.value
        ).toFixed(2)} ${to}`
      } else {
        setError('No exchange rate found.')
      }
    } catch (err) {
      setError('Something went wrong')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Currency Converter</h1>

      <div className='mb-4'>
        <input
          type='number'
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className='p-2 border rounded w-full'
        />
      </div>

      <CurrencySelector
        value={from}
        onChange={setFrom}
        currencies={Object.keys(rates)}
      />
      <CurrencySelector
        value={to}
        onChange={setTo}
        currencies={Object.keys(rates)}
      />

      <button
        onClick={handleConvert}
        disabled={loading}
        className='bg-blue-500 text-white px-4 py-2 rounded mt-4'
      >
        {loading ? 'Converting...' : 'Convert'}
      </button>

      {error && <p className='text-red-500 mt-2'>{error}</p>}
      {result !== null && (
        <p className='mt-4 text-lg'>{resultMessage.current}</p>
      )}
    </div>
  )
}
