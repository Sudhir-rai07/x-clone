import React, { useState } from "react";

import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { CiHeart } from "react-icons/ci";
import { FaRegHeart, FaTrash } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";

import LoadingSpinner from "./LoadingSpinner";
import AddCommentModal from "./AddCommentModal";
import { formatPostDate } from "../../utils/date";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["userAuth"] });

  const isMyPost = post?.user?._id === authUser?._id;
  const isLiked = post?.likes.includes(authUser?._id)


  const formatDate = formatPostDate(post?.createdAt)

  // Like Post
  const {mutate: likePost, isPending: isLiking} = useMutation({
    mutationFn: async () =>{
      try {
        return await axios.put(`/api/posts/like/${post._id}`)
      } catch (error) {
        console.log(error)
        throw new Error(error)
      }
    },
    onSuccess: (updatedLikes)=>{
      console.log(updatedLikes)
      queryClient.invalidateQueries({queryKey: ["posts"]})
    }
  })

  // Delete Post
  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: async () => {
      try {
        return await axios.delete(`/api/posts/delete/${post?._id}`);
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("post deleted");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleCommentModalView = () => {
    setOpenCommentModal((prev) => !prev);
  };

  const handleLikePost = () =>{
    if(isLiking) return;
    likePost()
  }
  return (
    <div className="flex w-full px-4 py-2 border-b border-gray-400">
      <div className="w-8 h-8 mr-2 overflow-hidden rounded-full cursor-pointer ">
       <Link to={`/profile/${post?.user?.username}`}>
       <img
          src={post?.user?.profileImg || '/avatar-placeholder.png'}
          alt=""
          className="object-cover w-full h-full rounded-full"
        />
       </Link>
      </div>
      <div className="flex-col items-center w-full">
        <div className="flex items-center w-full">
          <Link className="mr-1 font-bold" to={`/profile/${post?.user?.username}`}>{post?.user?.fullName}</Link>
          <Link className="text-gray-500" to={`/profile/${post?.user?.username}`}>@{post?.user?.username}</Link>
          <span className="ml-3 text-gray-500">{formatDate}</span>
          <span className="mx-auto ">
            {isPending && <LoadingSpinner />}
            {!isPending && isMyPost && (
              <FaTrash
                className="text-white transition-colors duration-100 cursor-pointer active:text-red-600"
                onClick={() => deletePost()}
              />
            )}
          </span>
        </div>

        <div className="w-full">
          <p className="w-4/5">{post?.text}</p>
          {post?.img && (
            <div>
              <img
                src={post.img}
                className="object-contain border border-gray-700 rounded-lg h-80"
                alt=""
              />
            </div>
          )}
        </div>

        <div className="flex items-center mt-2 justify-evenly">
          {/* Comment */}
          <div className="relative flex items-center">
            <FaRegComment
              className="mr-1 cursor-pointer"
              onClick={handleCommentModalView}
            />
            {post.comments.length}
            <div
              className={`${
                openCommentModal
                  ? "fixed h-4/5 border border-gray-500 px-4 bg-black w-[400px] -translate-x-1/2 z-30 -translate-y-1/2 top-1/2 left-1/2 rounded-md"
                  : "hidden"
              }`}
            >
              <AddCommentModal setModalView={handleCommentModalView} post={post} comment={post.comments}/>
            </div>
          </div>

          {/* Like */}
          <div className="flex items-center cursor-pointer" onClick={handleLikePost}>
          {isLiked && !isLiking && <FaRegHeart className='w-4 h-4 text-pink-500 cursor-pointer ' />}
          {!isLiked && !isLiking && <FaRegHeart className='w-4 h-4 text-gray-500 cursor-pointer group-hover:text-pink-500' />}
                <span className={`${isLiked ? "text-pink-500":"text-gray-500"} ml-1`}>{post?.likes.length}</span>
          </div>
        </div>
      </div>
      {/* <hr className="w-full h-[1px] bg-gray-400 border-none mt-2"/> */}
    </div>
  );
};

export default Post;
