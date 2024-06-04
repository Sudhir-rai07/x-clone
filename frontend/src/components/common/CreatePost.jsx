import React, { useRef, useState } from "react";

import { FaImage } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { CiFaceSmile } from "react-icons/ci";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const imgRef = useRef(null);

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async () => {
      try {
        return await axios.post("/api/posts/create", { text, img });
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post created");
      setText("");
      setImg(null);
    },
    onError: () => toast.error("error"),
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    createPost();
  };
  return (
    <div className="flex-col w-full py-4">
      <div className="w-full felx">
        <div className="w-[32px] h-[32px] mr-2 overflow-hidden">
          <img
            src="/avatar-placeholder.png"
            alt=""
            className="w-full h-full rounded-full"
          />
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="w-full pb-2 border-b border-b-gray-700"
        >
          <textarea
            className="w-full p-0 text-lg border-gray-800 border-none resize-none textarea focus:outline-none"
            placeholder="What is happening?!"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {img && (
            <div className="relative mx-auto w-72">
              <IoCloseSharp
                onClick={() => {
                  setImg(null);
                  imgRef.current.value = null;
                }}
                className="absolute right-0 text-2xl -top-8 text-end"
              />
              <img
                src={img}
                className="object-contain w-full mx-auto rounded h-72"
              />
            </div>
          )}

          <div className="relative flex w-full my-2 border-t border-t-gray-700">
            <div className="flex mt-2 text-blue-400 cursor-pointer">
              <FaImage
                onClick={() => {
                  imgRef.current.click();
                }}
                className="w-6 h-6 mr-5"
              />
              <CiFaceSmile className="w-6 h-6 text-blue-400" />
            </div>
            <input
              type="file"
              ref={imgRef}
              name="post-img"
              id="post-img"
              hidden
              onChange={handleImgChange}
            />
            <button
              className={`absolute right-0 px-4 py-1 mx-auto mt-2 text-black bg-white disabled:bg-gray-500 disabled:cursor-not-allowed rounded-full`}
              disabled={!text && !img}
            >
              {isPending ? "Posting": "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
