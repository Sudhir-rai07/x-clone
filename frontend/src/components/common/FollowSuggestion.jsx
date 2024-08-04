import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import useFollow from "../../hooks/useFollow";
import { Link, useLocation } from "react-router-dom";
import FollowSuggestionSkeleton from "../skeletons/FollowSuggestionSkeleton";

const FollowSuggestion = () => {
  const {pathname} = useLocation()
  const { follow, isPending, } = useFollow();
  const {
    data: suggestedUsers,
    isLoading,
    isError,
    error,
    isRefetching
  } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        return await axios.get("/api/users/suggested");
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
  });
  if (isLoading || isRefetching) return <FollowSuggestionSkeleton />

  return (
    <section className={`${pathname === "/message" ? "hidden":" hidden lg:w-[30%] h-full px-2 py-1 lg:flex"}`}>
      <div className="flex-col px-4 border border-gray-700 rounded-lg ">
        {suggestedUsers &&
          suggestedUsers.data.map((user) => (
            <div className="flex items-center w-full my-2" key={user._id}>
              <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                <Link to={`/profile/${user?.username}`}>
                  <img
                    src={user?.profileImg || "/avatar-placeholder.png"}
                    alt=""
                    className="object-cover object-center w-full h-full"
                  />
                </Link>
              </div>
              <div className="text-sm">
                <div>
                  <Link to={`/profile/${user?.username}`}>
                    {user?.fullName}
                  </Link>
                </div>
                <div className="text-gray-600">
                  <Link to={`/profile/${user?.username}`}>
                    @{user?.username}
                  </Link>
                </div>
              </div>
              <div className="flex ml-auto">
                <button
                  onClick={() => {
                    follow(user?._id);
                    setText("Following")
                  }}
                  className="px-4 py-1 ml-4 transition-colors duration-200 border border-gray-500 rounded-full hover:bg-white hover:text-black"
                >
                  {"Follow"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default FollowSuggestion;
