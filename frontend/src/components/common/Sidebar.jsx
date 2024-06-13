import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Xsvg from "../../components/svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import { MdFeedback } from "react-icons/md";

import axios from "axios";
import toast from "react-hot-toast";

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  console.log(location.pathname.split("/"))

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
      navigate("/sign-in")
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
        <Link to={"/"} className="hidden lg:flex">
        <Xsvg height={100} width={100} className="w-6 mb-3 cursor-pointer lg:w-20 fill-white" />
        </Link>

        <div className={`flex items-center mb-4 text-xl ${location.pathname === "/" ? "text-[#f39200]":""}`} title="home">
          <Link to={"/"} className="flex items-center">
            <span className="mr-2 text-xl">
              <MdHomeFilled />
            </span>
            <span className="hidden lg:block">Home</span>
          </Link>
        </div>

        <div className={`flex items-center mb-4 text-xl ${location.pathname === "/notifications" ? "text-[#f39200]":""}`}  title="notifications">
          <Link to={"/notifications"} className="flex items-center">
            <span className="mr-2 text-xl">
              <IoIosNotifications />
            </span>
            <span className="hidden lg:block">Notifications</span>
          </Link>
        </div>

        <div className={`flex items-center mb-4 text-xl ${location.pathname.split("/")[1] == `profile` ? "text-[#f39200]":""}`}  title={authUser?.username}>
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

        <div className={`flex items-center mb-4 text-xl ${location.pathname === "/feedback" ? "text-[#f39200]":""}`}  title="feedback">
          <Link
            to={`/feedback`}
            className="flex items-center"
          >
            <span className="mr-2 text-xl">
              <MdFeedback />
            </span>
            <span className="hidden lg:block">Feedback</span>
          </Link>
        </div>

        {authUser && (
          <div className="flex items-center my-auto mb-4 text-xl">
            <Link to={`/profile/${authUser?.username}`} className="flex">
              <div className="hidden w-8 h-8 rounded-full cursor-pointer lg:block">
                <img
                  src={authUser?.profileImg || "/avatar-placeholder.png"}
                  alt="ProfileImg"
                  className="w-[32px] h-[32px] rounded-full"
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
