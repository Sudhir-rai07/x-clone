import React, { useState, useEffect } from "react";
import axios from "axios";

import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import CreatePost from "../../components/common/CreatePost";
import Posts from "../../components/common/Posts";
import useFollow from "../../hooks/useFollow";
import {formatMemberSinceDate} from '../../utils/date/index.js'


import { MdAdd } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { IoMdLink } from "react-icons/io";

const ProfilePage = () => {
  const [feedType, setFeedType] = useState("posts");
  const [viewPostModal, setViewPostModal] = useState(false);
  
  const { username } = useParams();



  const {data: authUser} = useQuery({queryKey: ["userAuth"]})
  const {follow, isPending} = useFollow()
  // userInformation
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch, isRefetching
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      try {
        return axios.get(`/api/users/profile/${username}`);
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const memberSince = formatMemberSinceDate(user?.data?.createdAt)
  console.log(memberSince)

  useEffect(()=>{
    refetch()
  }, [username, refetch])

  // userPostData
const {data: posts} = useQuery({queryKey: ["posts"]})




  const isMyProfile = authUser._id == user?.data?._id
  const isFollowing = user?.data?.followers?.includes(authUser?._id)

// Loading
  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="h-screen w-[40rem] lg:w-[60%] overflow-y-scroll relative">
      <div
      title="Add post"
        className="fixed z-40 w-10 h-10 bg-blue-400 rounded-full cursor-pointer right-5 bottom-10"
        onClick={(e) => {
          setViewPostModal(prev => !prev)
          console.log(viewPostModal)
        }}
      >
        <MdAdd className="w-full h-full text-white" />
      </div>
      <div
        className={`${
          viewPostModal
            ? "fixed h-4/5 px-4 bg-black w-4/5 -translate-x-1/2 z-30 -translate-y-1/2 top-1/2 left-1/2 rounded-md shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]"
            : "hidden"
        }`}
      >
        <CreatePost />
      </div>
      <div className="sticky top-0 z-50 flex items-center px-4 h-14 backdrop-blur-md">
        <div className="mr-8">
          <Link to={"/"}>
            <FaArrowLeft />
          </Link>
        </div>
        <div>
          <div className="text-xl font-bold">{user?.data?.fullName}</div>
          <div className="text-sm text-gray-500">{posts?.data?.length} posts</div>
        </div>
      </div>
      <div className="relative w-full h-52">
        <img
          src={user?.data?.coverImg || "/cover.png"}
          alt=""
          className="object-cover w-full h-full"
        />
      </div>
      <div className="px-4">
        <div className="flex justify-between h-16">
          <div className="relative w-24 h-24 p-1 overflow-hidden bg-black rounded-full -top-12">
            <img
              src={user?.data?.profileImg || "/avatar-placeholder.png"}
              alt=""
              className="object-center w-full h-full bg-cover rounded-full"
            />
          </div>
          <div className="relative">
            {isMyProfile && <button className="relative px-5 py-2 transition-colors duration-200 border border-gray-400 rounded-full cursor-pointer hover:bg-gray-800 top-5">
              <Link to={`/profile/${authUser?.username}/edit`} >Edit profile</Link>
            </button>}
            {!isMyProfile && <button onClick={()=> follow(user?.data?._id)} className={`relative px-5 py-2 transition-colors duration-200 border ${isFollowing ? "border-[#f39200] hover:bg-[#f39200] hover:text-black":"border-gray-400"} border-gray-400 rounded-full cursor-pointer hover:bg-gray-800 top-5`}>
              {isFollowing ? "Following" : "Follow"}
            </button>}
          </div>
        </div>

        {/* username */}
        <div className="flex flex-col justify-start text-xl">
          <div className="font-semibold">{user?.data?.fullName}</div>
          <div className="text-sm text-gray-400">@{user?.data?.username}</div>
        </div>

        {/* bio */}
        <div className="w-full mt-4">
          <p className="w-4/5 text-white">
            {user?.data?.bio || <span className="text-gray-500">add bio</span>}
          </p>
         <div className="flex items-center">
          <div className="mr-2 text-gray-50"><IoMdLink /></div>
          <div> <a href={user?.data?.link} target="_blank" className="text-blue-500">
            {user?.data?.link || (
              <span className="text-gray-500">add link</span>
            )}
          </a></div>
         </div>

          <div className="flex items-center mt-1 text-sm text-gray-500">
<FaCalendarAlt/> <div className="ml-2"> {memberSince}</div>
          </div>
        </div>

        {/* followers and following */}
        <div className="flex mt-5">
          <div className="mr-5">
            <span className="mr-1 font-bold">
              {user?.data?.followers?.length || "0"}
            </span>
            <span className="text-sm text-gray-500">Followers</span>
          </div>
          <div>
            <span className="mr-1 font-bold">
              {user?.data?.following?.length || "0"}
            </span>
            <span className="text-sm text-gray-500">Following</span>
          </div>
        </div>
      </div>

{/* Feed type */}
      <div className="px-4 mt-8">
        <div className="flex mb-2">
          <span
            className={`mr-10 text-xl font-bold ${
              feedType === "posts" ? "text-blue-400" : ""
            } cursor-pointer`}
            onClick={() => setFeedType("posts")}
          >
            Posts
          </span>
          <span
            className={`mr-10 text-xl font-bold ${
              feedType === "likes" ? "text-blue-400" : ""
            } cursor-pointer`}
            onClick={() => setFeedType("likes")}
          >
            Likes
          </span>
        </div>
      </div>
      <hr className="w-full h-[1px] bg-gray-400 border-none mb-2" />

      {isLoading && <LoadingSpinner />}
      {isError && error && (
        <div className="text-center text-red-500">An Error occured</div>
      )}

      <Posts
        feedType={feedType}
        userId={user?.data?._id}
        username={user?.data?.username}
      />
    </section>
  );
};

export default ProfilePage;
