'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CurrencySelector from '@/components/CurrencySelector'
import { fetchRates, convertCurrencies } from '@/lib/currencyApi'
import Image from 'next/image'

import NavButtons from '@/components/NavButtons'

export default function Index() {
  const [amount, setAmount] = useState<string>('1')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('UAH')
  const [result, setResult] = useState<number | null>(null)
  const [rates, setRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const coefficient = useRef(1)
  const resultMessage = useRef('')
  const currencyKeys = useMemo(() => Object.keys(rates), [rates])
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
      if (res.state === 'success' && res.value !== null && amount) {
        coefficient.current = res.value
        setResult(Number(amount) / res.value)
        resultMessage.current = `${amount} ${from} = ${(
          Number(amount) / res.value
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
  const swapCurrencies = useCallback(() => {
    const [TempFrom, TempTo] = [to, from]
    setFrom(TempFrom)
    setTo(TempTo)
  }, [to, from])
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (from === to) {
      setResult(Number(amount))
      resultMessage.current = `${amount} ${from} = ${amount} ${to}`
      return
    }
    handleConvert()
  }
  return (
    <section className='px-4 md:p-[60px]  w-full'>
      <div className='m-auto flex max-w-[1042px] flex-col'>
        <h1 className='text-center text-[56px] font-semibold tracking-[-1px] xl:text-[68px] mb-2 xl:mb-[60px] '>
          Currency Converter
        </h1>
        <form className='mr-3 mt-4 flex flex-col  gap-6 rounded-[24px] border-[2px] border-[#99A2FF] bg-white p-6 shadow-[12px_-12px_0_0_#99A2FF] xl:mr-0  xl:gap-4 xl:px-[30px] xl:py-5 xl:shadow-[16px_-16px_0_0_#99A2FF]'>
          <NavButtons currentUrl='/convert' />
          <div className='relative grid grid-cols-1 grid-rows-1 gap-2 md:grid-cols-[33%_1fr] md:grid-rows-[none]'>
            <div className='h-[84px] rounded-lg border border-solid border-gray-250 bg-white px-4 py-2 text-2xl font-semibold hover:bg-gray-150 '>
              <label className=' block text-sm font-medium text-gray-400'>
                Amount
              </label>
              <input
                type='text'
                value={amount}
                onChange={(e) => {
                  let value = e.target.value.trim()

                  value = value.replace(',', '.')

                  if (value === '') {
                    setAmount('')
                    return
                  }

                  if (value === '0') {
                    setAmount('.')
                    return
                  }

                  if (/^\d*\.?\d*$/.test(value)) {
                    setAmount(value)
                  }
                }}
                className='w-full h-10 py-2 px-4 mt-[3px] rounded-[10px] placeholder:text-[16px] leading-6 outline-none text-darkBlack'
                placeholder='Enter a number'
              />
            </div>
            <div className='relative flex flex-col justify-evenly gap-2 md:flex-row'>
              <CurrencySelector
                value={from}
                onChange={setFrom}
                currencies={currencyKeys}
              />
              <div
                className='absolute w-8 h-8 self-center cursor-pointer'
                onClick={swapCurrencies}
              >
                <Image
                  src='/swap.svg'
                  alt='Swap currencies'
                  width={32}
                  height={32}
                  priority
                />
              </div>
              <CurrencySelector
                value={to}
                onChange={setTo}
                currencies={currencyKeys}
              />
            </div>
          </div>
          <button
            onClick={handleClick}
            disabled={loading}
            className='flex min-h-11 min-w-16 cursor-pointer items-center justify-center self-end rounded-2xl border border-lightPurple font-medium shadow-[0_4px_16px_0_#1A23721A] w-full gap-0 bg-purpleMain p-4 text-[18px] text-white hover:bg-purpleMain hover:shadow-[0_4px_16px_0_#6776FC4D] xl:w-auto flex-row-reverse hover:opacity-50'
          >
            {loading ? 'Converting...' : 'Convert'}
          </button>
          {error && <p className='text-red-500 mt-2'>{error}</p>}
          {result !== null && (
            <p className='mt-2 text-lg text-[18px] md:text-[32px] leading-6  text-darkBlack'>
              <span className='font-semibold'>Current value:</span>
              {resultMessage.current}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
