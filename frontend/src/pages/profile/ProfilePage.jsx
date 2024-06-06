import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import CreatePost from "../../components/common/CreatePost";
import { MdAdd } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import Posts from "../../components/common/Posts";
import { CiGlass } from "react-icons/ci";

const ProfilePage = () => {
  const [feedType, setFeedType] = useState("posts");
  const { username } = useParams();

  const [viewPostModal, setViewPostModal] = useState(false);

  // userInformation
  const {
    data: user,
    isLoading,
    isError,
    error,
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

  // userPostData
const {data: posts} = useQuery({queryKey: ["posts"]})

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
      <div className="sticky top-0 flex items-center px-4 h-14 backdrop-blur-md">
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
      <div className="w-full">
        <img
          src={user?.data?.coverImg || "/cover.png"}
          alt=""
          className="w-full"
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
            <button className="relative px-5 py-2 transition-colors duration-200 border border-gray-400 rounded-full cursor-pointer hover:bg-gray-800 top-5">
              Edit profile
            </button>
          </div>
        </div>

        {/* username */}
        <div className="flex flex-col justify-start text-xl">
          <div className="font-semibold">{user?.data?.fullName}</div>
          <div className="text-sm text-gray-400">@{user?.data?.username}</div>
        </div>

        {/* bio */}
        <div className="w-full mt-5">
          <p className="w-4/5">
            {user?.data?.bio || <span className="text-gray-500">add bio</span>}
          </p>
          <p>
            {user?.data?.link || (
              <span className="text-gray-500">add link</span>
            )}
          </p>
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
