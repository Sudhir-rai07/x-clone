import React from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Xsvg from "../../components/svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { FaUser } from "react-icons/fa";

import boy1 from "/avatars/boy1.png";
import axios from "axios";
import toast from "react-hot-toast";
import XSvg from "../svgs/X";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        return axios.post("/api/auth/logout");
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAuth"] });
      toast.success("Logged out");
    },
    onError: () => {
      toast.error("Error");
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["userAuth"] });
  return (
    <section className="w-10 h-screen py-4 pr-4 ml-4 border-r-2 border-gray-500 lg:w-56">
      <div className="flex flex-col h-full mr-2">
        <Xsvg className="w-6 mb-3 cursor-pointer lg:w-20 fill-white" />
        <div className="flex items-center mb-4 text-xl">
          <Link to={"/"} className="flex items-center">
            <span className="mr-2 text-xl">
              <MdHomeFilled />
            </span>
            <span className="hidden lg:block">Home</span>
          </Link>
        </div>

        <div className="flex items-center mb-4 text-xl">
          <Link to={"/notifications"} className="flex items-center">
            <span className="mr-2 text-xl">
              <IoIosNotifications />
            </span>
            <span className="hidden lg:block">Notifications</span>
          </Link>
        </div>

        <div className="flex items-center mb-4 text-xl">
          <Link
            to={`/profile/${authUser?.username}`}
            className="flex items-center"
          >
            <span className="mr-2 text-xl">
              <FaUser />
            </span>
            <span className="hidden lg:block">Profile</span>
          </Link>
        </div>

        {authUser && (
          <div className="flex items-center my-auto mb-4 text-xl">
            <Link to={`/profile/${authUser?.username}`} className="flex">
              <div className="hidden w-8 h-8 rounded-full cursor-pointer lg:block">
                <img
                  src={authUser?.profileImg || "/avatar-placeholder.png"}
                  alt="ProfileImg"
                  className="w-full h-full rounded-full"
                />
              </div>
              <div className="hidden h-full ml-1 text-sm lg:block">
                <span className="font-semibold">{authUser?.fullName}</span>
                <br />
                <span className="text-gray-400">{authUser?.username}</span>
              </div>
            </Link>
            <div
              className="mx-auto cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              <TbLogout2 className="text-2xl" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Sidebar;
