import React, { useRef, useState } from "react";
import { FaArrowLeft, FaCross } from "react-icons/fa6";
import { Link } from "react-router-dom";

import { TbCameraPlus, TbHorse } from "react-icons/tb";
import { MdOutlineCancel } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const EditProfilePageModal = ({ authUser }) => {
  const [coverImg, setCoverImg] = useState(authUser?.coverImg || null);
  const [profileImg, setProfileImg] = useState(authUser?.profileImg || null);
  const [fullName, setFullName] = useState(authUser?.fullName);
  const [bio, setBio] = useState(authUser?.bio);
  const [link, setLink] = useState(authUser?.link);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
  const {mutate: updateProfile, isPending:isUpdating} = useMutation({
    mutationFn: async () => {
      try {
        return await axios.put(`/api/users/update`, {
          coverImg,
          profileImg,
          fullName,
          bio,
          link,
          currentPassword,
          newPassword,
        });
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Profile updated");
      Promise.all([]);
      queryClinet.invalidateQueries({ queryKey: ["user"] }),
        queryClinet.invalidateQueries({ queryKey: ["userAuth"] });
        navigate(`/profile/${authUser?.username}`)
    },
    onError: ()=>{
      toast.error("Error")
    }
  });

  console.log(authUser);
  return (
    <section className="h-screen w-full flex justify-center overflow-y-scroll">
      <form className="h-full w-4/5 flex flex-col  relative mb-4" onSubmit={updateProfile}>
        <div className="h-12 w-full flex justify-between px-4 items-center">
          <Link to={`/profile/${authUser?.username}`}>
            <FaArrowLeft />
          </Link>
          <div>
            <button
              type="submit"
              className="border border-gray-500 px-3 py-1 rounded-full hover:bg-blue-500 hover:text-black transition-colors duration-200 hover:border-blue-500"
            >
              {isUpdating? "Updating...": "Save"}
            </button>
          </div>
        </div>
        <div className="lg:w-full w-350px h-52 relative">
          <img
            src={coverImg || "/cover.png"}
            alt=""
            className="h-full w-full rounded-lg object-cover"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-2xl flex text-black">
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

        <div className="h-24 w-24 relative">
          <div className="absolute h-24 w-24 -top-10 overflow-hidden rounded-full border-2 border-black">
            <img
              src={profileImg || "/avatar-placeholder.png"}
              alt=""
              className="h-full rounded-lg object-cover object-center"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-2xl flex text-black">
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

        {/* FullName */}
        <div className="border mb-4 border-gray-400 w-full py-2 px-2 bg-black rounded-md flex flex-col-reverse">
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full outline-none bg-black peer"
          />
          <label
            htmlFor="fullName"
            className="text-sm text-gray-500 peer-focus:text-blue-500"
          >
            Full name
          </label>
        </div>

        {/* Bio */}
        <div className="border mb-4 border-gray-400 w-full py-2 px-2 bg-black rounded-md flex flex-col-reverse">
          <input
            type="text"
            id="bio"
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full outline-none bg-black peer"
          />
          <label
            htmlFor="bio"
            className="text-sm text-gray-500 peer-focus:text-blue-500"
          >
            Bio
          </label>
        </div>

        {/* Link */}
        <div className="border mb-4 border-gray-400 w-full py-2 px-2 bg-black rounded-md flex flex-col-reverse">
          <input
            type="text"
            id="link"
            name="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full outline-none bg-black peer placeholder-gray-500"
            placeholder="add a website"
          />
          <label
            htmlFor="bio"
            className="text-sm text-gray-500 peer-focus:text-blue-500"
          >
            Link
          </label>
        </div>

        {/* Passoword */}
        <div className="border border-gray-400 w-full py-2 px-2 bg-black flex rounded-md gap-2">
          <input
            type="password"
            className="bg-black w-1/2 border py-2 px-2 rounded-md outline-none focus:border focus:border-blue-500"
            name="currentPassword"
            placeholder="current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            className="bg-black w-1/2 border py-2 px-2 rounded-md outline-none focus:border focus:border-blue-500"
            name="newPassword"
            placeholder="new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
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
