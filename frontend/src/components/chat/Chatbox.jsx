import React, { useEffect, useRef, useState } from "react";
import useConversation from "../../zustand/useConversation";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaTelegram } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import extractTime from "../utils/extractTime";
import toast from "react-hot-toast";
import useListenMessages from "../../hooks/useListenMessages";

const Chatbox = () => {
  const [message, setMessage] = useState("");
  const lastMessageRef = useRef()
  useListenMessages()
  const {
    selectedConversation,
    setSelectedConversation,
    messages,
    setMessages,
  } = useConversation();

  // Get all messages
  const { data: allMessages, isLoading } = useQuery({
    queryKey: ["getAllMessages", selectedConversation?._id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/message/${selectedConversation?._id}`
      );
      return response.data;
    },
  });

  // Send new message
  const {mutate: sendMessage, isPending} = useMutation({
    mutationFn: async (message) => {
      const response = await axios.post(
        `/api/message/send/${selectedConversation?._id}`, {message});
      return response.data
    },
    onError: (error)=>{
      console.log(error)
      toast.error("message not sent")
    },
    onSuccess: (data)=>{
      toast.success("sent")
      console.log(data)
      setMessages([...messages, data])
    }
  });

  // Handle send message
  const handleSendMessage = (e) =>{
    e.preventDefault()
    if(!message) return
    sendMessage(message)
    setMessage('')
  }

  // Scroll into view
useEffect(()=>{
  setTimeout(() => {
    lastMessageRef.current?.scrollIntoView()
  });
}, [messages])


useEffect(() => {
    if (!isLoading && allMessages) setMessages(allMessages);
  }, [allMessages, isLoading, selectedConversation?._id]);

  return (
    <div className="flex flex-col w-full h-screen max-w-3xl">
      {/* Chat Header */}
      <div className="flex items-center w-full h-12 px-4 bg-pink-400 bg-opacity-0 border border-gray-100 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md">
        <div className="ml-2 mr-1 text-lg">
          <FaArrowLeft onClick={() => setSelectedConversation(null)} />
        </div>
        <Link
          to={`/profile/${selectedConversation?.username}`}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 overflow-hidden rounded-full">
            <img
              src={
                selectedConversation?.profileImg || "/avatar-placeholder.png"
              }
              className="object-cover w-full h-full"
            />
          </div>
          <div className="overflow-hidden ">
            <p className="font-semibold">{selectedConversation?.fullName}</p>
          </div>
        </Link>
      </div>

{/* Messages */}
      <div className="flex-1 w-full overflow-y-scroll">
        {messages &&
          messages.map((msg, idx) => {
            return <div  key={idx} ref={lastMessageRef}>
            <Message message={msg} />
            </div>;
          })}
      </div>

      {/* Send Message section */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-3 px-2 py-2 mb-auto border-t-2 border-gray-700">
        <input
          type="text"
          name="message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoComplete="off"
          placeholder="Type here"
          className="w-full h-full px-2 mx-auto bg-transparent border-b-2 border-white focus:outline-none backdrop-blur-md"
        />
        <button type="submit" className="mr-4 text-3xl cursor-pointer">
          <FaTelegram/>
        </button>
      </form>
    </div>
  );
};

export default Chatbox;

const Message = ({ message }) => {
  const { data: authUser } = useQuery({ queryKey: ["userAuth"] });
  const sentByMe = message?.senderId == authUser?._id;
  return (
    <div className="px-2">
      <div
        className={`chat ${sentByMe ? "chat-end" : "chat-start"} chat group`}
      >
        <div className={`${sentByMe ? "bg-blue-400" : ""} rounded-sm chat-bubble`}>
          {message?.message}
        </div>
        <div className="invisible opacity-50 chat-footer group-hover:visible">
          {extractTime(message?.createdAt)}
        </div>
      </div>
    </div>
  );
};
