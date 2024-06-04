import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { CiHeart } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";

const Post = ({ post, userId, username }) => {
  const queryClient = useQueryClient()
  const {data: authUser} = useQuery({queryKey: ["userAuth"]})

  const isMyPost = post?.user?._id === authUser?._id
  const isLiked = post.likes.includes(userId);

  const { mutate: likePost } = useMutation({
    mutationFn: async (id) => {
      try {
        return await axios.post("/api/posts/like/" + id);
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
			queryClient.setQueryData(["posts"], (oldData) => {
        console.log(oldData)
				return oldData && oldData?.data?.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: updatedLikes };
					}
					return p;
				});
			});
		},
    onError: (error) => {toast.error("error"); console.log(error)},
  });

  const {mutate: deletePost,isPending} = useMutation({
    mutationFn: async(id)=>{
      try {
       return await axios.delete(`/api/posts/delete/${id}`)
      } catch (error) {
        throw new Error(error)
      }
    },
    onSuccess: ()=>{toast.success("post deleted");
      queryClient.invalidateQueries({queryKey: ["posts"]})
    }
  })
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
          <span className="mx-auto">
            {isPending && <LoadingSpinner />}
           {!isPending && isMyPost &&  <FaTrash className="text-white transition-colors duration-100 cursor-pointer active:text-red-600" onClick={()=> deletePost(post._id)}/>}
          </span>
        </div>

        <div className="w-full">
          <p className="w-4/5">{post?.text}</p>
          {post?.img && (
            <div>
            <img
								src={post.img}
								className='object-contain border border-gray-700 rounded-lg h-80'
								alt=''
							/>
            </div>
          )}
        </div>

        <div className="flex items-center mt-2">
          <div onClick={() => likePost(post._id)} className="flex items-center">
            {!isLiked ? (
              <CiHeart className="cursor-pointer hover:text-red-600" />
            ) : (
              <FaHeart className="text-red-500 cursor-pointer" />
            )}
          </div>
            <span className="ml-1 text-sm text-gray-500">
            {post.likes.length}
            </span>
        </div>
      </div>
      {/* <hr className="w-full h-[1px] bg-gray-400 border-none mt-2"/> */}
    </div>
  );
};

export default Post;
