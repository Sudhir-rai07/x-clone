import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import useFollow from "../../hooks/useFollow";

const FollowSuggestion = () => {
const {follow, isPending} = useFollow()

  const {data: suggestedUsers, isLoading, isError, error} = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () =>{
      try {
        return await axios.get("/api/users/suggested")
      } catch (error) {
        console.log(error)
        throw new Error(error)
      }
    }
  })

if(isLoading) return <LoadingSpinner />

  return (
    <section className="hidden w-[30%] h-full px-2 py-1 border-l-2 border-gray-500 lg:flex">
        <div className=" px-4 border border-gray-700 rounded-lg flex-col">
      {suggestedUsers && suggestedUsers.data.map((user)=>(
        <div className="w-full my-2 flex items-center" key={user._id}> 
        <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
          <img src={user?.profileImg || "/avatar-placeholder.png"} alt="" className="object-center object-cover"/>
        </div>
        <div className="text-sm">
          <div>{user?.fullName}</div>
          <div className="text-gray-600">@{user?.username}</div>
        </div>
        <div className="mx-auto">
          <button onClick={()=>follow(user?._id)} className="border border-gray-500 px-4 py-1 rounded-full ml-4 hover:bg-white hover:text-black transition-colors duration-200">
           {isPending ? "...": "Follow"}
          </button>
        </div>
        </div>
      ))}
      </div>
    </section>
  );
};

export default FollowSuggestion;
