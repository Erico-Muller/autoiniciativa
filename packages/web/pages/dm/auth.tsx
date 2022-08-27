import { useRef, FormEvent } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import type { NextPage } from 'next'

import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const DMAuth: NextPage = () => {
   const inputPassRef = useRef<HTMLInputElement>(null)

   const mutation = useMutation(async () => {
      const password = inputPassRef.current?.value

      if (!password)
         return emitError('Insira a senha do mestre')

      try { 
         await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/character/login_dm`, { password }, {
            withCredentials: true
         })
         Router.push('/dm')
      } catch (err) {
         emitError('Senha incorreta!')
      }
   })

   function handleSubmit(event: FormEvent) {
      event.preventDefault()
      mutation.mutate()
   }

   function emitError(message: string) {
      toast.error(message, {
         position: 'bottom-right',
         autoClose: 2000,
         hideProgressBar: true,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true
      })
   }

   return (
      <>
         <Head>
            <title>Enter</title>
         </Head>

         <div className="flex flex-col justify-center items-center min-h-screen py-8">
            <header>
               <h1 className="text-5xl text-center">
                  Mestre
               </h1>
            </header>

            <form onSubmit={handleSubmit} className="w-full h-48 sm:max-w-min sm:max-h-min m-8 p-8 flex flex-col justify-center items-center gap-8 bg-slate-700 sm:rounded-xl">
               <input
                  className="p-1 text-lg text-center text-gray-800 bg-gray-200 rounded-xl hover:scale-110 focus:outline-none focus:ring-4 focus:ring-violet-500 focus:ring-opacity-50 transition ease-in-out duration-200"
                  type="password"
                  placeholder="Senha"
                  ref={inputPassRef}
                  maxLength={15}
                  minLength={1}
               />

               <button type="submit" className="px-2 py-1 border-2 border-gray-200 rounded-lg hover:text-slate-700 hover:bg-gray-200 transition ease-linear duration-150">
                  Entrar
               </button>
            </form>

            <Link href="/enter">
               <a className="px-2 py-1 text-gray-800 bg-gray-200 border-2 border-gray-200 rounded-lg hover:text-gray-200 hover:bg-transparent transition ease-linear duration-150">
                  Jogador
               </a>
            </Link>

            <footer className="w-full pt-3 pb-6 fixed bottom-0 text-center bg-gray-800">
               <p className="text-xs">
                  Created by Erikinho
               </p>
            </footer>
         </div>

         <ToastContainer
            position='bottom-right'
            autoClose={2000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
         />
      </>
   )
}

export default DMAuth