import { useState, useEffect, useMemo, FormEvent } from 'react'

import Head from 'next/head'
import Router from 'next/router'
import type { NextPage } from 'next'

import Initiative from '../components/Initiative'

import io, { Socket } from 'socket.io-client'

import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

import { useCookies } from 'react-cookie'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Initiative {
   characterName: string
   initiative: number
   is_critical: boolean
   is_turn: boolean
}

const Home: NextPage = () => {
   const socket = useMemo<Socket>(() => io(process.env.NEXT_PUBLIC_API_BASE_URL!), [])

   const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
   const [rolled, setRolled] = useState(false)
   const [initiatives, setInitiatives] = useState<Initiative[]>([])

   const exitMutation = useMutation(async () => {
      try {       
         await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/character`, {
            headers: {
               'Authorization': `Bearer ${cookies.jwt}`
            }
         })
         
         removeCookie('jwt')
         Router.push('/enter')
      } catch (err) {
         emitError('Algum erro ocorreu!')
      }
   })

   function handleExit(event: FormEvent) {
      event.preventDefault()
      exitMutation.mutate()
   }

   function handleRoll() {
      function rollDice() {
         const min = Math.ceil(21)
         const max = Math.floor(1)
   
         return Math.floor(Math.random() * (max - min)) + min
      }

      setRolled(true)
      socket.emit('roll', { token: cookies.jwt, initiative: rollDice() })
   }

   function sortInitiatives(initiatives: Initiative[]) {
      const sortedInitiatives = initiatives.sort((x, y) => y.initiative - x.initiative)

      const normalInitiatives = []
      const criticalInitiatives = []

      for (let i = 0; i < sortedInitiatives.length; i++) {
         if (sortedInitiatives[i].is_critical) {
            criticalInitiatives.push(sortedInitiatives[i])
         } else {
            normalInitiatives.push(sortedInitiatives[i])
         }
      }

      const newInitiatives = criticalInitiatives.concat(normalInitiatives)

      return newInitiatives
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

   useEffect(() => {
      socket.on('connect', () => {
         console.log('connection established')
      })

      socket.on('receive_initiatives', (receivedInitiatives: Initiative[]) => {
         const newInitiatives = sortInitiatives(receivedInitiatives)
         setInitiatives(newInitiatives)
      })
   }, [socket])

   return (
      <>
         <Head>
            <title>Iniciativa</title>
         </Head>

         <div className="flex flex-col justify-center items-center min-h-screen pt-14 pb-8">
            <button onClick={handleExit}>
               <a className="px-2 py-1 absolute sm:fixed top-2 sm:top-4 right-2 sm:right-4 text-base sm:text-lg border-2 border-gray-200 rounded-lg hover:bg-red-500 hover:border-red-500 transition ease-linear duration-150">
                  Sair
               </a>
            </button>

            <header>
               <h1 className="text-5xl text-center">
                  Iniciativas
               </h1>
            </header>

            <div className="w-24 h-24 mt-10 flex justify-center items-center bg-slate-700 rounded-full">
               <button
                  className={`${rolled && 'animate-roll'}`}
                  onClick={() => handleRoll()}
                  disabled={rolled}
               >
                  <img src="/img/dice.png" alt="roll dice" />
               </button>
            </div>

            <main className={`${initiatives.length == 0?'hidden':''} w-full sm:w-96 sm:max-h-min m-8 p-8 flex flex-col justify-center items-center gap-8 bg-slate-700 sm:rounded-xl`}>
               {
                  initiatives.map(initiative => (
                     <Initiative variant='default' key={initiative.characterName} initiative={initiative.initiative} isTurn={initiative.is_turn} isCritical={initiative.is_critical}>
                        {initiative.characterName}
                     </Initiative>
                  ))
               }
            </main>

            <footer className="w-full sm:pt-3 sm:pb-6 sm:fixed sm:bottom-0 text-center sm:bg-gray-800">
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

export default Home