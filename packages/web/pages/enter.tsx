import { useState, useRef, FormEvent } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import type { NextPage } from 'next'

import { Plus, Minus } from 'phosphor-react'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Enter: NextPage = () => {
   const inputNameRef = useRef<HTMLInputElement>(null)
   const [mod, setMod] = useState(0)
   const [modSelected, setModSelected] = useState(false)

   function handleSubmit(event: FormEvent) {
      event.preventDefault()

      if (!inputNameRef.current?.value)
         return emitError('Insira o nome do seu personagem')
      else if (!mod)
         return emitError('Insira o modificador do seu personagem')

      const player = {
         name: inputNameRef.current.value,
         mod
      }

      console.log(player)
   }

   function handleIncrementMod() {
      if (!modSelected) {
         setModSelected(true)
      } else if (mod < 20) {
         setMod(mod + 1)
      }
   }

   function handleDecrementMod() {
      if (!modSelected) {
         setModSelected(true)
      } else if (mod > -10) {
         setMod(mod - 1)
      }
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
                  Bem-vindo
               </h1>
            </header>

            <form onSubmit={handleSubmit} className="w-full h-64 sm:max-w-min sm:max-h-min m-8 p-8 flex flex-col justify-center items-center gap-8 bg-slate-700 sm:rounded-xl">
               <input
                  className="p-1 text-lg text-center text-gray-800 bg-gray-200 rounded-xl hover:scale-110 focus:outline-none focus:ring-4 focus:ring-violet-500 focus:ring-opacity-50 transition ease-in-out duration-200"
                  type="text"
                  placeholder="Nome"
                  ref={inputNameRef}
                  maxLength={15}
                  minLength={1}
               />

               <div className="flex justify-center items-center gap-3">
                  <button
                     type="button"
                     className="flex justify-center items-center w-7 h-7 bg-gray-200 rounded-full hover:scale-125 transition ease-in-out duration-150"
                     onClick={handleDecrementMod}
                  >
                     <Minus size={14} color='#1f2937' weight="bold" />
                  </button>
                  <input 
                     className="w-14 p-1 text-xl text-center text-gray-800 bg-gray-200 rounded-xl focus:outline-none"
                     type="text"
                     placeholder="Mod"
                     value={modSelected?mod:''}
                     disabled
                  />
                  <button
                     type="button"
                     className="flex justify-center items-center w-7 h-7 bg-gray-200 rounded-full hover:scale-125 transition ease-in-out duration-150"
                     onClick={handleIncrementMod}
                  >
                     <Plus size={14} color='#1f2937' weight="bold" />
                  </button>
               </div>

               <button type="submit" className="px-2 py-1 border-2 border-gray-200 rounded-lg hover:text-slate-700 hover:bg-gray-200 transition ease-linear duration-150">
                  Entrar
               </button>
            </form>

            <Link href="/dm/auth">
               <a className="px-2 py-1 text-gray-800 bg-gray-200 border-2 border-gray-200 rounded-lg hover:text-gray-200 hover:bg-transparent transition ease-linear duration-150">
                  Mestre
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

export default Enter