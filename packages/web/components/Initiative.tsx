interface Props {
   variant: 'default' | 'dm'
   children: string
   initiative: number
   isCritical: boolean
   isTurn: boolean
}

const Initiative = (props: Props) => {
   return (
      <div key={props.children} className={`${props.isTurn?'text-4xl':'text-2xl'} ${props.isCritical?'text-red-400':''} w-full flex justify-between items-center`}>
         <span className="invisible">
            {props.initiative}
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