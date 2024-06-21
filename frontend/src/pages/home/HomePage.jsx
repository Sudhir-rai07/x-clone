import React, { useState } from 'react'
import CreatePost from '../../components/common/CreatePost'
import Posts from '../../components/common/Posts'

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou")
  return (
    <section className='w-[40rem] lg:w-[50%] h-screen border-r border-gray-500 px-2 overflow-y-scroll no-scrollbar'>
    <div className='sticky top-0 flex items-center justify-between w-full h-12 px-0 font-semibold border-b border-white backdrop-blur '>
      <div className={`${feedType === "forYou" ? "underline":""} w-1/2 text-center cursor-pointer underline-offset-4 decoration-blue-400 decoration-2`} onClick={()=> setFeedType("forYou")}>For you</div>
      <div className={`${feedType === "following" ? "underline":""} w-1/2 text-center cursor-pointer underline-offset-4 decoration-blue-400 decoration-2`} onClick={()=> setFeedType("following")}>Following</div>
    </div>

    <CreatePost />
    
    <div>
    <Posts feedType={feedType}/>
    </div>
   
    </section>
  )
}

export default HomePage