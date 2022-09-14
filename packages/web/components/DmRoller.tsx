import { useState, useRef, FormEvent } from 'react'
import { useCookies } from 'react-cookie'

import * as Dialog from '@radix-ui/react-dialog'
import { Plus, Minus } from 'phosphor-react'

import { toast } from 'react-toastify'

import { Socket } from 'socket.io-client'

interface Props {
   socket: Socket
}

const DmRoller = ({ socket }: Props) => {
   const [cookies] = useCookies(['jwt'])

   const inputNameRef = useRef<HTMLInputElement>(null)
   const [mod, setMod] = useState<number | null>(null)
   const [modSelected, setModSelected] = useState(false)
   const [quantity, setQuantity] = useState<number | null>(null)
   const [quantitySelected, setQuantitySelected] = useState(false)
   const [rolled, setRolled] = useState(false)

   function handleSubmit(event: FormEvent) {
      event.preventDefault()

      if (!inputNameRef.current?.value)
         return emitError('Insira o nome do(s) inimigos(s)')
      else if (mod === null)
         return emitError('Insira o modificador do(s) inimigos(s)')

      const rollData = {
         token: cookies.jwt,
         name: inputNameRef.current.value,
         mod,
         quantity: quantity || 1
      }

      setRolled(true)

      socket.emit('roll-many', rollData)
   }

   function handleIncrementMod() {
      if (!modSelected) {
         setMod(0)
         setModSelected(true)
      } else if (mod! < 20) {
         setMod(mod! + 1)
      }
   }

   function handleDecrementMod() {
      if (!modSelected) {
         setMod(0)
         setModSelected(true)
      } else if (mod! > -10) {
         setMod(mod! - 1)
      }
   }

   function handleIncrementQuantity() {
      if (!quantitySelected) {
         setQuantity(1)
         setQuantitySelected(true)
      } else if (quantity! < 20) {
         setQuantity(quantity! + 1)
      }
   }

   function handleDecrementQuantity() {
      if (!quantitySelected) {
         setQuantity(1)
         setQuantitySelected(true)
      } else if (quantity! > 1) {
         setQuantity(quantity! - 1)
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
      <Dialog.Root>
         <Dialog.Trigger asChild>
            <button className="w-16 sm:w-[82px] h-16 sm:h-[82px] hover:scale-125 hover:-translate-y-6 transition-transform duration-200 ease-in-out">
               <img src="/img/dice.png" alt="roll dice" width={82} height={82} />
            </button>
         </Dialog.Trigger>
         <Dialog.Portal>
            <Dialog.Overlay className="absolute inset-0 bg-black bg-opacity-25" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[400px] p-6 bg-slate-600 rounded-xl flex flex-col items-center animate-emerge">
               <div className="bg-slate-600">
                  <Dialog.Title className="mb-6 text-xl text-center font-bold text-gray-200 bg-slate-600" asChild>
                     <h1>Rolagem de Inimigos</h1>
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-8">
                     <input
                        className="p-1 text-lg text-center text-gray-800 bg-gray-200 rounded-xl hover:scale-110 focus:scale-110 focus:outline-none focus:ring-4 focus:ring-violet-500 focus:ring-opacity-50 transition ease-in-out duration-200"
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
                           value={modSelected?mod!:''}
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

                     <div className="flex justify-center items-center gap-3">
                        <button
                           type="button"
                           className="flex justify-center items-center w-7 h-7 bg-gray-200 rounded-full hover:scale-125 transition ease-in-out duration-150"
                           onClick={handleDecrementQuantity}
                        >
                           <Minus size={14} color='#1f2937' weight="bold" />
                        </button>
                        <input 
                           className="w-14 p-1 text-xl text-center text-gray-800 bg-gray-200 rounded-xl focus:outline-none"
                           type="text"
                           placeholder="Qtd"
                           value={quantitySelected?quantity!:''}
                           disabled
                        />
                        <button
                           type="button"
                           className="flex justify-center items-center w-7 h-7 bg-gray-200 rounded-full hover:scale-125 transition ease-in-out duration-150"
                           onClick={handleIncrementQuantity}
                        >
                           <Plus size={14} color='#1f2937' weight="bold" />
                        </button>
                     </div>

                     <button
                        className={`${rolled && 'animate-roll'} hover:scale-125 transition-transform duration-200 ease-in-out`}
                        onAnimationEnd={() => setRolled(false)}
                     >
                        <img src="/img/dice.png" alt="roll dice" />
                     </button>
                  </form>
               </div>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   )
}

export default DmRoller

