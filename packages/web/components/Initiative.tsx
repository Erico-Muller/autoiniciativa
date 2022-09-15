import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { Socket } from 'socket.io-client'
import { XCircle } from 'phosphor-react'

interface Props {
   variant: 'default' | 'dm'
   children: string
   initiative: number
   isCritical: boolean
   isTurn: boolean
   socket?: Socket
}

const Initiative = (props: Props) => {
   const [cookies] = useCookies(['jwt'])
   const [isPressed, setIsPressed] = useState(false)

   return (
      <div key={props.children} className={`${props.isTurn?'text-4xl':'text-2xl'} ${props.isCritical?'text-red-400':''} w-full flex justify-between items-center`}>
         <span className={`${props.variant === 'dm' ? '' : 'invisible'} flex items-center`}>
            <button 
               onClick={
                  () => {
                     if (props.socket)
                        props.socket.emit('kill', { token: cookies.jwt, characterName: props.children })
                        setIsPressed(true)
                  }
               }
               disabled={isPressed}
            >
               <XCircle size={25} color="#e5e7eb" weight='fill' className="hover:fill-red-400 transition-colors duration-100 ease-linear" />
            </button>
         </span>
         <span>
            {props.children}
         </span>
         <span className="text-lg">
            {props.initiative}
         </span>
      </div>
   )
}

export default Initiative