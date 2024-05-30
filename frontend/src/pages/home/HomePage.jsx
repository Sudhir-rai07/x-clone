import React, { useState } from 'react'
import Sidebar from '../../components/common/Sidebar'

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou")
  return (
    <section className='w-full h-screen'>
    <div className='flex items-center justify-between w-full h-12 px-8 font-semibold bg-black border-b border-white'>
      <div className={`${feedType === "forYou" ? "underline":""} cursor-pointer underline-offset-4 decoration-blue-400 decoration-2`} onClick={()=> setFeedType("forYou")}>For you</div>
      <div className={`${feedType === "following" ? "underline":""} cursor-pointer underline-offset-4 decoration-blue-400 decoration-2`} onClick={()=> setFeedType("following")}>Following</div>
    </div>
    </section>
  )
}

export default HomePage