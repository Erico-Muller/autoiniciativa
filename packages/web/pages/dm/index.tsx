import { useState, useEffect, useMemo, FormEvent } from 'react'

import Head from 'next/head'
import Router from 'next/router'
import type { NextPage } from 'next'

import Initiative from '../../components/Initiative'
import DmRoller from '../../components/DmRoller'

import io, { Socket } from 'socket.io-client'

import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

import { useCookies } from 'react-cookie'

import { ArrowFatLineRight, Eraser } from 'phosphor-react'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Initiative {
   characterName: string
   initiative: number
   is_critical: boolean
   is_turn: boolean
}

const DM: NextPage = () => {
   const socket = useMemo<Socket>(() => io(process.env.NEXT_PUBLIC_API_BASE_URL!), [])
   
   const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
   const [initiatives, setInitiatives] = useState<Initiative[]>([])
   const [currentTurnCharacter, setCurrentTurnCharacter] = useState(0)

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

   function handlePassInitiative() {
      socket.emit(
         'pass',
         {
            token: cookies.jwt,
            characterName: initiatives[currentTurnCharacter].characterName
         }
      )

      const newInitiatives = [...initiatives]
      newInitiatives[newInitiatives[currentTurnCharacter-1] ? currentTurnCharacter-1 : newInitiatives.length-1].is_turn = false
      newInitiatives[currentTurnCharacter].is_turn = true
      setInitiatives(newInitiatives)
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

   useEffect(() => {
      for (let i = 0; i < initiatives.length; i++) {
         if (i === initiatives.length-1) {
            return setCurrentTurnCharacter(0)
         } else if (initiatives[i].is_turn) {
            return setCurrentTurnCharacter(i+1)
         }
      }
   }, [initiatives])

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
            <title>Iniciativa</title>
         </Head>

         <div className="flex flex-col justify-center items-center min-h-screen pt-14 pb-8">
            <button onClick={handleExit}>
               <a className="px-2 py-1 absolute sm:fixed top-2 sm:top-4 right-2 sm:right-4 text-base sm:text-lg border-2 border-gray-200 rounded-lg hover:bg-red-500 hover:border-red-500 transition ease-linear duration-150">
                  Sair
               </a>
            </button>

            <header>
               <h1 className="text-4xl sm:text-5xl text-center">
                  Dungeon Master
               </h1>
            </header>

            <main className="w-full sm:w-96 sm:max-h-min m-8 p-8 flex flex-col justify-center items-center gap-8 bg-slate-700 sm:rounded-xl">
               {
                  initiatives.length === 0 ?
                     <span className="text-lg">Aguardando iniciativas...</span> :

                     initiatives.map(initiative => (
                        <Initiative variant='dm' socket={socket} key={initiative.characterName} initiative={initiative.initiative} isTurn={initiative.is_turn} isCritical={initiative.is_critical}>
                           {initiative.characterName}
                        </Initiative>
                     ))
               }
            </main>

            <div className="fixed w-full h-16 sm:h-[88px] sm:pb-7 flex justify-center items-center bottom-0 bg-slate-600 sm:bg-transparent">
               <div className="h-full w-full sm:max-w-min px-4 flex justify-around items-center gap-5 sm:bg-slate-600 rounded-full sm:shadow-lg">
                  <button onClick={() => socket.emit('clear', { token: cookies.jwt })}>
                     <Eraser size={42} color="#e5e7eb" weight="fill" className="hover:fill-red-400 transition-colors duration-100 ease-linear" />
                  </button>

                  <DmRoller socket={socket} />

                  <button onClick={() => handlePassInitiative()}>
                     <ArrowFatLineRight size={42} color="#e5e7eb" weight="fill" className="hover:fill-blue-400 transition-colors duration-100 ease-linear" />
                  </button>
               </div>
            </div>
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

export default DM