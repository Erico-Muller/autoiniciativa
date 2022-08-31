import { NextResponse, NextRequest } from 'next/server'

import axios from 'axios'
import fetchAdapter from '@vespaiach/axios-fetch-adapter'

const middleware = async (req: NextRequest) => {
   const token = req.cookies.get('jwt')
   const type = req.url.split('/')[3].startsWith('dm') ? 'DM' : 'CHARACTER'

   let isAuthorized: boolean
   try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/validate_token?type=${type}`, null, {
         headers: { Authorization: `Bearer ${token}` },
         adapter: fetchAdapter
      })
   
      isAuthorized = await res.data
   } catch {
      isAuthorized = false
   }

   if (isAuthorized) return NextResponse.next()
   else return NextResponse.redirect(new URL('/enter', req.url))
}

export default middleware

export const config = {
   matcher: ['/', '/dm'],
}