import React, { useEffect } from "react";

import { useQuery  } from "@tanstack/react-query";
import axios from "axios";

import LoadingSpinner from '../common/LoadingSpinner'
import Post from "./Post";

const Posts = ({ feedType, userId, username }) => {
  const getPostEndPoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
        break;
      case "following":
        return "/api/posts/following";
        break;
      case "posts":
        return `/api/posts/user/${username}`;
        break;
      case "likes":
        return `/api/posts/liked`;
        break;
      default:
        return "/api/posts/all";
    }
  };

 const API_URL =  getPostEndPoint()
 console.log(API_URL)


 const {data: posts, isLoading, isError, refetch, isRefetching} = useQuery({
  queryKey: ["posts"],
  queryFn: async ()=>{
    try {
      return await axios.get(API_URL)
    } catch (error) {
      throw new Error(error)
    }
  },
  staleTime: 0
 })

 useEffect(()=>{
refetch()
 }, [feedType, refetch])
 console.log(posts)
 if(isLoading) return <LoadingSpinner />
  return <>
          {posts && posts?.data?.map((post,idx)=>(
            <Post post={post} userId={post.user?._id} key={idx}/>
          ))}
  </>;
};

export default Posts;
