import React from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import Notification from "./Notification";

import { IoCloudDone } from "react-icons/io5";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";

const NotificationPage = () => {
  const queryClient = useQueryClient();

  const {
    isError,
    isPending,
    data: notifications,
    error,
  } = useQuery({
    queryKey: ["getNotifications"],
    queryFn: async () => {
      return axios.get("/api/notifications/all");
    },
  });

  const { mutate: deleteNotification } = useMutation({
    mutationFn: async () => {
      try {
        return await axios.post("/api/notifications/delete");
      } catch (error) {
        throw new Error(error);
      }
    },
    onError: () => {
      toast.error("Operation failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getNotifications"],
      });
      toast.success("Deleted");
    },
  });

  if (isPending) return <LoadingSpinner />;

  if (notifications.data.length === 0) {
    return (
      <div className="flex-col items-center justify-center w-full h-screen ">
        <div className="flex items-center justify-center w-full h-full">
          <IoCloudDone className="mr-4 text-4xl" />
          <p>No new notifications</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative lg:w-[40rem] sm:w-[60%] h-screen px-2 py-2 overflow-y-scroll border-r-2 border-gray-500 no-scrollbar">
      <div className="flex-col w-full h-full">
        <div className="flex justify-end ">
          <button
          title="delete all"
            className="sticky top-0 right-0 rounded-full btn btn-error btn-sm"
            onClick={() => deleteNotification()}
          >
          <MdDelete  className="text-xl text-white"/>
          </button>
        </div>
        {notifications &&
          notifications?.data?.map((notification) => (
            <div key={notification?._id}>
              <Notification
                notification={notification}
              />
            </div>
          ))}
      </div>
    </section>
  );
};

export default NotificationPage;
