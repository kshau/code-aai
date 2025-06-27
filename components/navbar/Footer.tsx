"use client"
import Link from "next/link"
import { links } from "./Navbar"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-50 pt-8 md:pt-16 dark:bg-gray-900">
      <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 w-full p-4 py-6 lg:py-8">
        <div className="flex flex-col justify-center md:flex-row md:justify-between">
          <div className="mb-8 md:mb-0">
            <Link href="/" className="flex items-center justify-center">
              <Image src="/logo.svg" width={32} height={32} className="h-8 w-8 me-3" alt="CodeAAI Logo" />
              <span className="self-center text-xl sm:text-2xl font-semibold whitespace-nowrap dark:text-white">
                CodeAAI
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-16">
            <div>
              <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">Links</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                {links.map((link) => (
                  <li key={link.href} className="mb-2">
                    <Link href={link.href} className="hover:underline">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-2">
                  <Link href="/privacy-policy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/terms" className="hover:underline">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">Reach out</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-2">
                  <Link href="mailto:contact.codeaai@gmail.com" className="hover:underline flex items-center gap-2">
                    Email
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    href="https://www.instagram.com/aai.codingclub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-2"
                  >
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="text-center sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">© 2025 CodeAAI</span>
        </div>
      </div>
    </footer>
  )
}
