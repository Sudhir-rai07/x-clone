import React from 'react'

const FollowingSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-52">
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 rounded-full skeleton shrink-0"></div>
    <div className="flex flex-col gap-4">
      <div className="w-20 h-4 skeleton"></div>
      <div className="h-4 skeleton w-28"></div>
    </div>
  </div>
</div>
  )
}

export default FollowingSkeleton