import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Feedback = () => {
  const [text, setText] = useState();

  const {mutate: postFeedback, isPending} = useMutation({
    mutationFn: async () =>{
        try {
            return await axios.post("/api/feedback", {text})
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    },
    onSuccess: ()=>{
        toast.success("Feedback posted")
        setText("")
    },
    onError: ()=>{
        toast.error("error")
    }
  })

  const handleFormSubmit = (e) => {
    e.preventDefault();
    postFeedback()
  };
  return (
    <section className="flex-col lg:w-[60%] w-[40rem] h-screen">
      <form
        className="relative flex flex-col w-4/5 mx-auto mb-4"
        onSubmit={handleFormSubmit}
      >
        <div className="mt-8 text-xl text-center lg:text-3xl">
          Your every feedback is important!
        </div>

        <div className="flex flex-col px-2 py-4 mt-8 border border-gray-500 rounded-md flex-start">
          <h2 className="text-xl">Write your feedback here :</h2>
          <textarea
            rows={5}
            className="p-2 mt-2 transition-colors duration-200 border-2 border-white rounded-md outline-none focus:border-blue-500"
            placeholder="Here..."
            name="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex mx-auto mt-4 mr-1">
            <button disabled={!text} type="submit" className="px-4 py-2 transition-colors duration-200 bg-blue-500 border-none rounded-full disabled:text-black disabled:bg-gray-500 disabled:cursor-not-allowed">{isPending ? "Posting":"Submit"}</button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Feedback;
