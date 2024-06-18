import React, { useRef, useState } from "react";
import { FaArrowLeft, FaCross } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

import { TbCameraPlus, TbHorse } from "react-icons/tb";
import { MdOutlineCancel } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import toast from "react-hot-toast";

const EditProfilePageModal = ({ authUser }) => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [fullName, setFullName] = useState(authUser?.fullName);
  const [email, setEamil] = useState(authUser?.email);
  const [bio, setBio] = useState(authUser?.bio);
  const [link, setLink] = useState(authUser?.link);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();
  const handleCoverImgChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const queryClinet = useQueryClient();
  const handleUpdateProfile = async () => {
    try {
      return axios.put(`/api/users/update`, {
        coverImg,
        profileImg,
        fullName,
        email,
        bio,
        link,
        currentPassword,
        newPassword,
      });
    } catch (error) {
      console.log(error.response);
      throw new Error(error);
    }
  };
  const {
    mutate: updateProfile,
    isPending: isUpdating,
    error,
    isError,
  } = useMutation({
    mutationFn: handleUpdateProfile,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      toast.success("Profile updated");
      Promise.all([]);
      queryClinet.invalidateQueries({ queryKey: ["user"] }),
        queryClinet.invalidateQueries({ queryKey: ["userAuth"] });
      navigate(`/profile/${authUser?.username}`);
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    updateProfile();
  };

  return (
    <section className="flex justify-center w-full h-screen overflow-y-scroll">
      <form
        className="relative flex flex-col w-4/5 h-full mb-4"
        onSubmit={handleFormSubmit}
      >
        <div className="flex items-center justify-between w-full h-12 px-4">
          <Link to={`/profile/${authUser?.username}`}>
            <FaArrowLeft />
          </Link>
          <div>
            <button
              type="submit"
              className="px-3 py-1 transition-colors duration-200 border border-gray-500 rounded-full hover:bg-blue-500 hover:text-black hover:border-blue-500"
            >
              {isUpdating ? "Updating..." : "Save"}
            </button>
          </div>
        </div>
        <div className="relative lg:w-full w-350px h-52">
          <img
            src={coverImg || authUser?.coverImg || "/cover.png"}
            alt=""
            className="object-cover w-full h-full rounded-lg"
          />
          <div className="absolute flex text-2xl text-black -translate-x-1/2 -translate-y-1/2 cursor-pointer top-1/2 left-1/2">
            <div>
              <TbCameraPlus
                onClick={() => coverImgRef.current.click()}
                className="mr-2 text-white hover:text-blue-500"
              />
            </div>
            <div>
              <MdOutlineCancel
                onClick={() => {
                  setCoverImg(null);
                  coverImgRef.current.value = null;
                }}
                className="text-white hover:text-blue-500"
              />
            </div>{" "}
          </div>
        </div>

        <div className="relative w-24 h-24">
          <div className="absolute w-24 h-24 overflow-hidden border-2 border-black rounded-full -top-10">
            <img
              src={
                profileImg || authUser?.profileImg || "/avatar-placeholder.png"
              }
              alt=""
              className="object-cover object-center h-full rounded-lg"
            />
            <div className="absolute flex text-2xl text-black -translate-x-1/2 -translate-y-1/2 cursor-pointer top-1/2 left-1/2">
              <div>
                <TbCameraPlus
                  onClick={() => profileImgRef.current.click()}
                  className="mr-2 text-white hover:text-blue-500"
                />
              </div>
              <div>
                <MdOutlineCancel
                  onClick={() => {
                    setProfileImg(null);
                    profileImgRef.current.value = null;
                  }}
                  className="text-white hover:text-blue-500"
                />
              </div>{" "}
            </div>
          </div>
        </div>


        <div className="overflow-y-scroll no-scrollbar ">
          {/* FullName */}
          <div className="flex flex-col-reverse w-full px-2 py-2 mb-4 bg-black border border-gray-400 rounded-md">
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-black outline-none peer"
            />
            <label
              htmlFor="fullName"
              className="text-sm text-gray-500 peer-focus:text-blue-500"
            >
              Full name
            </label>
          </div>

          {/* Email */}
          <div className="flex flex-col-reverse w-full px-2 py-2 mb-4 bg-black border border-gray-400 rounded-md">
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEamil(e.target.value)}
              className="w-full bg-black outline-none peer"
            />
            <label
              htmlFor="email"
              className="flex justify-between text-sm text-gray-500 peer-focus:text-blue-500"
            >
              <span>Email</span>
              <span className={`${authUser?.isVerified ? "text-green-500":""}`}>Verified</span>
            </label>
          </div>

          {/* Bio */}
          <div className="flex flex-col-reverse w-full px-2 py-2 mb-4 bg-black border border-gray-400 rounded-md">
            <input
              type="text"
              id="bio"
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-black outline-none peer"
            />
            <label
              htmlFor="bio"
              className="text-sm text-gray-500 peer-focus:text-blue-500"
            >
              Bio
            </label>
          </div>

          {/* Link */}
          <div className="flex flex-col-reverse w-full px-2 py-2 mb-4 bg-black border border-gray-400 rounded-md">
            <input
              type="text"
              id="link"
              name="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full placeholder-gray-500 bg-black outline-none peer"
              placeholder="add a website"
            />
            <label
              htmlFor="bio"
              className="text-sm text-gray-500 peer-focus:text-blue-500"
            >
              Link
            </label>
          </div>

          {isError && (
            <div className="text-red-500">{error.response.data.error}</div>
          )}
          {/* Passoword */}
          <div className="flex w-full gap-2 px-2 py-2 bg-black border border-gray-400 rounded-md">
            <input
              type="password"
              className="w-1/2 px-2 py-2 bg-black border rounded-md outline-none focus:border focus:border-blue-500"
              name="currentPassword"
              placeholder="current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              className="w-1/2 px-2 py-2 bg-black border rounded-md outline-none focus:border focus:border-blue-500"
              name="newPassword"
              placeholder="new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>


        <input
          type="file"
          onChange={handleCoverImgChange}
          ref={coverImgRef}
          hidden
          name="coverImg"
          id="coverImg"
        />
        <input
          type="file"
          onChange={handleProfileImgChange}
          ref={profileImgRef}
          hidden
          name="profileImg"
          id="profileImg"
        />
      </form>
    </section>
  );
};

export default EditProfilePageModal;
