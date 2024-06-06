import React, { useState } from "react";
import axios from "axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { IoMdSend } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const AddCommentModal = ({ setModalView, post, comment }) => {
  const [text, setText] = useState("");
    const queryClient = useQueryClient()

  const {
    mutate: commentOnPost,
    error,
    isError,
  } = useMutation({
    mutationFn: async () => {
      try {
        return await axios.post(`/api/posts/comment/${post._id}`, { text });
      } catch (error) {
        console.log(error.response);
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Comment posted");
      setText("");
      queryClient.invalidateQueries({queryKey: ["posts"]})
    },
    onError: (error) => {
      toast.error("error");
      console.log(error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!text) return toast.error("A comment must have a text")
    commentOnPost();
  };

  console.log(post.comments);
  return (
    <div className="flex-col items-center justify-center w-full h-full py-4 overflow-y-scroll bg-black">
      {post.comments.length === 0 ? (
        <div className="text-center">No comments yet</div>
      ) : (
        ""
      )}
      {comment &&
        comment.map((comment) => (
          <div
            className="z-50 flex h-12 mb-2 border-b border-gray-500 min-w-32"
            key={comment?._id}
          >
            <div className="flex w-8 h-8 mr-2 overflow-hidden rounded-full">
              <img
                src={comment?.user?.profileImg || "/avatar-placeholder.png"}
                className="object-cover bg-center"
              />
            </div>

            <div>
              <div className="text-[10px] flex">
                <p className="mr-1 font-semibold">{comment.user?.fullName}</p>
                <p className="text-gray-400 ">
                  @{comment.user?.username}
                </p>
              </div>

              <div className="text-sm">
                <p>{comment?.text}</p>
              </div>
            </div>
          </div>
        ))}

      <form className="absolute bottom-2" onSubmit={handleSubmit}>
        <div className="flex items-end w-full h-full">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            type="text"
            placeholder="add a comment"
            className="w-full px-2 py-2 mr-2 bg-transparent border-b-2 border-gray-500 focus:outline-1 focus:outline-white"
          />
          <div className="flex mt-2">
            <button
              type="submit"
              className="px-4 py-2 mr-2 bg-transparent border border-gray-500 rounded-lg"
            >
              <IoMdSend />
            </button>
          </div>
          <span
            onClick={() => setModalView()}
            className="px-2 py-2 ml-4 border border-gray-500 rounded-lg cursor-pointer hover:bg-red-600"
          >
            <RxCross2 />
          </span>
        </div>
      </form>
    </div>
  );
};

export default AddCommentModal;
