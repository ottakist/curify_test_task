import Link from 'next/link'
import React from 'react'

type NavButtonsProps = {
  currentUrl: string
}

const NavButtons: React.FC<NavButtonsProps> = ({ currentUrl }) => {
  const links = [
    { href: '/convert', label: 'Convert' },
    { href: '/list', label: 'List' }
  ]

  return (
    <div className='flex flex-col w-full xl:w-max md:flex-row gap-[10px] max-md:flex-wrap self-end'>
      {links.map(({ href, label }) => {
        const isActive = currentUrl === href

        return isActive ? (
          <span
            key={href}
            className='h-max w-full flex items-center justify-center rounded-[20px] px-[20px] py-[6px] text-[15px] font-semibold bg-[#99a2ffc1] text-black opacity-50 cursor-not-allowed'
            aria-disabled='true'
          >
            {label}
          </span>
        ) : (
          <Link
            key={href}
            href={href}
            className='h-max w-full flex items-center justify-center rounded-[20px] px-[20px] py-[6px] text-[15px] font-semibold bg-[#99a2ffc1] text-black'
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}

export default NavButtons
