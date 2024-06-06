import React, { useState } from "react";

import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { CiHeart } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";

import LoadingSpinner from "./LoadingSpinner";
import AddCommentModal from "./AddCommentModal";
import { formatPostDate } from "../../utils/date";

const Post = ({ post, userId, username }) => {
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["userAuth"] });

  const isMyPost = post?.user?._id === authUser?._id;
  const isLiked = post.likes.includes(userId);

  const formatDate = formatPostDate(post?.createdAt)

  const {
    mutate: likePost,
    data: updatedLikes,
    isPending: isLiking,
  } = useMutation({
    mutationFn: async () => {
      try {
        return await axios.post("/api/posts/like/" + post?._id);
      } catch (error) {
        throw new Error(err);
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.invalidateQueries(["posts"])
      toast.success("post liked");
      // queryClient.setQueryData(["posts"], (oldData) => {cxzeer[]\
      //   return oldData.map((p) => {
      //     if (p._id === post._id) {
      //       return { ...p, likes: updatedLikes };
      //     }
      //     return p;
      //   });
      // });
    },
    onError: () => {},
  });

  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: async () => {
      try {
        return await axios.delete(`/api/posts/delete/${id}`);
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
  
  return (
    <div className="flex w-full px-4 py-2 border-b border-gray-400">
      <div className="w-10 h-10 mr-2 overflow-hidden rounded-full">
        <img
          src="/avatar-placeholder.png"
          alt=""
          className="w-full h-full bg-center bg-cover"
        />
      </div>
      <div className="flex-col items-center w-full">
        <div className="flex items-center w-full">
          <span className="mr-1 font-bold">{post?.user?.fullName}</span>
          <span className="text-gray-500">@{post?.user?.username}</span>
          <span className="ml-3 text-gray-500">{formatDate}</span>
          <span className="mx-auto">
            {isPending && <LoadingSpinner />}
            {!isPending && isMyPost && (
              <FaTrash
                className="text-white transition-colors duration-100 cursor-pointer active:text-red-600"
                onClick={() => deletePost(post._id)}
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

          <div onClick={() => likePost()} className="flex items-center">
            {isLiking && <LoadingSpinner />}
            {!isLiked && !isLiking && (
              <CiHeart className="cursor-pointer hover:text-pink-600" />
            )}
            {isLiked && !isLiking && (
              <FaHeart className="text-pink-800 cursor-pointer" />
            )}
            <span
              className={`ml-1 text-sm ${
                !isLiked ? " text-gray-500" : "text-pink-800"
              }`}
            >
              {post.likes.length}
            </span>
          </div>
        </div>
      </div>
      {/* <hr className="w-full h-[1px] bg-gray-400 border-none mt-2"/> */}
    </div>
  );
};

export default Post;
