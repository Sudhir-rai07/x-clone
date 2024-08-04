import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Post from "../../components/common/Post";
import { MdArrowLeft } from "react-icons/md";
import {
  FaComment,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaStopwatch,
  FaTelegram,
} from "react-icons/fa6";
import { formatPostDate } from "../../utils/date";
import { FaRegComment } from "react-icons/fa";
import toast from "react-hot-toast";
import useLikePost from "../../hooks/useLikePost";
import sharePost from "../../utils/share/sharePost";
import useComment from "../../hooks/useComment";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const PostPage = ({ authUser }) => {
  const [comment, setComment] = useState("");

  const { postid } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const {
    data: postData,
    isError,
    error,
    isSuccess,
    isFetching,
  } = useQuery({
    queryKey: ["singlePost"],
    queryFn: async () => {
      const response = await axios.get(`/api/posts/id/${postid}`);
      return response.data;
    },
  });
  const isLiked = postData?.likes?.includes(authUser?._id);
  const createdAt = formatPostDate(postData?.createdAt);
  const commentCreatedAt = formatPostDate(postData?.comments?.createdAt)

  // Like Post
  const {likePost, isPending:isLiking} = useLikePost()
  const {commentOnPost, isPending:isCommenting} = useComment()
  const handleLikePost = () => {
    if (isLiking) return;
    likePost(postData?._id);
    setComment("")
  };

  const postLink = window.location.href

  if(isError) return (<div className="flex flex-col items-center justify-center w-full mt-10">
    <h2 className="text-2xl">Post not found ☹️</h2>
    <img src="https://media4.giphy.com/media/eIsBUaOERJ3MrkkBL3/200w.webp?cid=ecf05e473vcuv6o1dlaivq6p028q6lf47zk5nx7p9j6psres&ep=v1_gifs_related&rid=200w.webp&ct=g" className="rounded-full" />
  </div>)
  return (
    <div className="h-screen w-[40rem] lg:w-[60%] overflow-y-scroll relative overflow-x-hidden px-4">
      <nav className="sticky top-0 flex items-center w-full h-10 pb-2 border-gray-500 backdrop-blur-lg">
        <MdArrowLeft
          className="text-4xl cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <div>
          {postData?.user?.fullName}{" "}
          <span className="text-[12px] text-gray-500">
            @{postData?.user?.username}
          </span>
        </div>
      </nav>

      <div className="flex flex-col mt-2">
        <div className="flex">
          <div className="w-8 h-8 overflow-hidden rounded-full">
            <img
              src={postData?.user?.profileImg || "/avatar-placeholder.png"}
              alt={`${postData?.user?.username || "user"}'s profile-image`}
              className="object-cover object-center w-full h-full"
            />
          </div>
          <div className="ml-2 text-[12px]">
            <p className="font-semibold">{postData?.user?.fullName}</p>
            <p className="text-gray-400">@{postData?.user?.username}</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-start px-2 py-2 overflow-hidden rounded-lg h-">
          {postData?.text && (
            <p className="w-2/3 pb-4 mr-auto border-gray-500 ">
              {postData?.text}
            </p>
          )}
          {postData?.img && (
            <img src={postData?.img} className="rounded-lg w-72" />
          )}
          <p className="flex items-center w-full mt-2 mr-auto text-sm text-gray-400 border-gray-500">
            <FaStopwatch className="mr-2" /> {createdAt}{" "}
          </p>

          {!authUser ? (
            <>
              <p className="mt-10 text-red-500">
                Sign-in first to perform actions on this post.
              </p>
              <Link
                to={"/sign-in"}
                className="text-xl text-blue-500 hover:underline"
              >
                Sign-in
              </Link>
            </>
          ) : (
            <div className="flex flex-col w-full mt-4 mr-auto border-gray-500">
              <div className="flex items-center border-gray-500">
                {/* Like */}
                <div
                  className="flex items-center cursor-pointer"
                  onClick={handleLikePost}
                >
                  {isLiked && !isLiking && (
                    <FaRegHeart className="w-4 h-4 text-pink-500 cursor-pointer " />
                  )}
                  {!isLiked && !isLiking && (
                    <FaRegHeart className="w-4 h-4 text-gray-500 cursor-pointer group-hover:text-pink-500" />
                  )}
                  <span
                    className={`${
                      isLiked ? "text-pink-500" : "text-gray-500"
                    } ml-1`}
                  >
                    {postData?.likes?.length}
                  </span>
                </div>

                {/* Comment */}
                <div className="flex items-center ml-4 cursor-pointer">
                  <FaRegComment className="mr-1 " /> {postData?.comments.length}
                </div>
                {/* Share */}
                <div className="ml-4">
                  <FaShare
                    className="cursor-pointer"
                    onClick={()=> sharePost(postLink)}
                  />
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-3 px-2 py-2 my-4 border border-gray-500 rounded-lg">
                  <input
                    type="text"
                    placeholder="add a comment"
                    className="w-full h-10 py-1 bg-transparent outline-none"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <FaTelegram className="text-2xl cursor-pointer"  onClick={()=> commentOnPost({postId: postData?._id, text:comment})}/>
                </div>
                {!postData?.comments.length && "No comments yet"}
                {postData?.comments &&
                  postData?.comments.map((comment) => (
                    <div
                      className="z-50 flex h-12 mb-2 border-gray-500 min-w-32"
                      key={comment?._id}
                    >
                      <div className="flex w-8 h-8 mr-2 overflow-hidden rounded-full">
                        <img
                          src={
                            comment?.user?.profileImg ||
                            "/avatar-placeholder.png"
                          }
                          className="object-cover bg-center"
                        />
                      </div>

                      <div>
                        <Link
                          className="text-[10px] flex"
                          to={`/profile/${comment.user?.username}`}
                        >
                          <p className="mr-1 font-semibold">
                            {comment.user?.fullName}
                          </p>
                          <p className="text-gray-400 ">
                            @{comment.user?.username} .
                          </p>
                          <p className="text-gray-400 ">
                            &nbsp;{commentCreatedAt}
                          </p>
                        </Link>

                        <div className="text-sm">
                          <p>{comment?.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
