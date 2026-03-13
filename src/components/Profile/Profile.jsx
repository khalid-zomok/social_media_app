import React, { useContext, useEffect, useRef, useState } from "react";
import {
  HiArrowLeft,
  HiOutlineCalendar,
  HiOutlineLink,
  HiOutlineLockClosed,
  HiOutlineMapPin,
} from "react-icons/hi2";

import { IoIosCloseCircle } from "react-icons/io";
import { FaImage } from "react-icons/fa";
import * as zod from "zod";

import {
  Button,
  Avatar,
  Tabs,
  Tab,
  Card,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CounterContext } from "../../Context/CounterContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = zod.object({
  password: zod
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "password should contain at least one special chars",
    )
    .nonempty("password required"),
  newPassword: zod
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "password should contain at least one special chars",
    )
    .nonempty("password required"),
});

export default function Profile() {
  const [isFollowed, setIsFollowed] = React.useState(false);
  const [isLiked, setisLiked] = React.useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isChangePasswordOpen,
    onOpen: onChangePasswordOpen,
    onOpenChange: onChangePasswordChange,
  } = useDisclosure();
  const [isUploaded, setIsUploaded] = useState(false);
  const imageInput = useRef(null);
  const { userUserData, setuserUserData } = useContext(CounterContext);
  const query = useQueryClient();
  const navigate = useNavigate();
  const [apiError, setapiError] = useState(null);
  const [isLoadingForm, setisLoadingForm] = useState(false);
const handleLogin = (data, onClose) => { 
  setisLoadingForm(true);
  setapiError(null);

  axios
    .patch(`https://route-posts.routemisr.com/users/change-password`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    })
    .then((res) => {
      // Use a more flexible check or check for res.status === 200
      if (res.data.message.includes("password changed successfully")) {
        toast.success("Password updated successfully!");
        if (onClose) onClose(); // Now it won't crash
        
        // Log out the user
        localStorage.removeItem("userToken");
        navigate("/login");
      }
    })
    .catch((err) => {
      // Logic for "unauthorized" / Force Logout on failure
      toast.error("Security Alert: Session invalidated due to failed update.");
      
      localStorage.removeItem("userToken");
      navigate("/login");
      // Optional: Set the error message if you want it to show briefly
      setapiError(err.response?.data?.message || "Unauthorized access attempt.");
    })
    .finally(() => {
      setisLoadingForm(false);
    });
};

  const form = useForm({
    defaultValues: {
      newPassword: "",
      password: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const { register, handleSubmit, formState } = form;

  useEffect(() => {
    if (!isOpen) {
      setIsUploaded(false);
      if (imageInput.current) imageInput.current.value = "";
    }
  }, [isOpen]);

  const handleImagePreview = (e) => {
    if (e.target.files[0]) {
      const path = URL.createObjectURL(e.target.files[0]);
      setIsUploaded(path);
    }
  };

  const submitPost = (onClose) => {
    const formData = new FormData();
    const file = imageInput.current.files[0];
    if (!file) {
      return toast.warn("Please add some content first!");
    }

    if (file) formData.append("photo", file);

    mutate(formData, {
      onSuccess: () => onClose(), // Close only if successful
    });
  };

  const changeProfileImage = (formData) => {
    return axios.put(
      `https://route-posts.routemisr.com/users/upload-photo`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };

  const { isPending, mutate } = useMutation({
    mutationFn: changeProfileImage,
    onSuccess: () => {
      toast.success("Image uploaded successfully 👍");
      query.invalidateQueries({ queryKey: ["getProfile"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const getProfile = () => {
    return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  };
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryFn: getProfile,
    queryKey: ["getProfile"],
  });
  const {
    name,
    username,
    photo,
    cover,
    createdAt,
    newPassword,
    followingCount,
    followersCount,
  } = data?.data?.data?.user || {};

  const backToHome = () => {
    navigate("/home");
  };

  useEffect(() => {
    if (data?.data?.data?.user) {
      const { photo, name, username } = data.data.data.user;

      // Only update if the data is different to avoid unnecessary renders
      setuserUserData({
        photo: photo,
        name: name,
        username: username,
      });
    }
  }, [data, setuserUserData]);

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  console.log(data?.data.data);

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      {/* --- Mobile Header Navigation --- */}
      <div className="sticky top-0 z-50 flex items-center gap-6 bg-black/80 backdrop-blur-md px-4 py-2 border-b border-zinc-900">
        <button
          onClick={backToHome}
          className="p-2 hover:bg-zinc-900 rounded-full transition-colors"
        >
          <HiArrowLeft className="text-xl" />
        </button>
        <div>
          <h2 className="text-lg font-bold leading-tight">{name}</h2>
          {
            //<p className="text-xs text-zinc-500">34 Posts</p>
          }
        </div>
      </div>

      {/* --- Hero / Cover Image --- */}
      <div className="h-32 sm:h-48 bg-zinc-800 w-full relative">
        <img
          src={
            cover ||
            "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000"
          }
          className="w-full h-full object-cover"
          alt="Cover"
        />
      </div>

      {/* --- Profile Essentials --- */}
      <div className="px-4">
        <div className="relative flex justify-between items-end -mt-12 mb-4">
          {/* Avatar with thick border for overlap effect */}
          <Avatar
            src={photo}
            className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-black ring-0"
          />

          {/* Action Button */}
          <div className="flex gap-1">
            <Button
              onPress={onOpen}
              className="rounded-full text-white font-bold border-zinc-700 hover:bg-zinc-900 min-w-0"
              variant="bordered"
            >
              <FaImage className="sm:mr-2" /> {/* Icon always visible */}
              <span className="hidden sm:inline">
                Change Profile Image
              </span>{" "}
              {/* Text hidden on mobile */}
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Choose Profile Image
                    </ModalHeader>
                    <ModalBody>
                      {isUploaded && (
                        <div className="relative">
                          <img
                            alt="Preview"
                            className="object-cover w-64 h-64 rounded-full overflow-hidden mx-auto"
                            src={isUploaded}
                          />
                          <IoIosCloseCircle
                            onClick={() => {
                              setIsUploaded(false);
                              imageInput.current.value = "";
                            }}
                            className="text-amber-50 text-4xl absolute top-1 right-1 bg-black rounded-full cursor-pointer"
                          />
                        </div>
                      )}
                    </ModalBody>
                    <ModalFooter>
                      <label className="hover:bg-slate-300 p-2 rounded-sm cursor-pointer">
                        <FaImage className="text-2xl" />
                        <input
                          ref={imageInput}
                          type="file"
                          onChange={handleImagePreview}
                          hidden
                        />
                      </label>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button
                        color="primary"
                        isLoading={isPending}
                        onPress={() => submitPost(onClose)}
                      >
                        Change
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>

            <Button
              onPress={onChangePasswordOpen}
              className="rounded-full text-white font-bold border-zinc-700 hover:bg-zinc-900 min-w-0"
              variant="bordered"
            >
              <HiOutlineLockClosed className="sm:mr-1" />{" "}
              {/* Icon shows on all screens */}
              <span className="hidden sm:inline">Change Password</span>{" "}
              {/* Text hides on mobile */}
            </Button>
            <Modal
              isOpen={isChangePasswordOpen}
              onOpenChange={onChangePasswordChange}
              backdrop="blur"
              classNames={{
                base: "bg-zinc-950 border border-zinc-800 text-white",
              }}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1 text-xl font-bold">
                      Change Password
                    </ModalHeader>

                    <ModalBody>
                      <p className="text-zinc-500 text-sm mb-4">
                        Ensure your new password is secure and contains special
                        characters.
                      </p>

                      <form
                        onSubmit={handleSubmit(handleLogin)}
                        className="flex flex-col gap-6 py-4"
                      >
                        {/* Current Password Field */}
                        <div className="relative z-0 w-full group">
                          <input
                            {...register("password")}
                            type="password"
                            id="password"
                            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-zinc-700 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                            placeholder=" "
                          />
                          <label
                            htmlFor="password"
                            className="absolute text-sm text-zinc-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >
                            Current Password
                          </label>
                          {formState.errors.password && (
                            <p className="text-red-500 text-xs mt-1 font-medium">
                              {formState.errors.password?.message}
                            </p>
                          )}
                        </div>

                        {/* New Password Field */}
                        <div className="relative z-0 w-full group">
                          <input
                            {...register("newPassword")}
                            type="password"
                            id="newPassword"
                            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-zinc-700 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                            placeholder=" "
                          />
                          <label
                            htmlFor="newPassword"
                            className="absolute text-sm text-zinc-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >
                            New Password
                          </label>
                          {formState.errors.newPassword && (
                            <p className="text-red-500 text-xs mt-1 font-medium">
                              {formState.errors.newPassword?.message}
                            </p>
                          )}
                        </div>

                        {/* API Error Notification */}
                        {apiError && (
                          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <p className="text-red-500 text-xs text-center font-bold">
                              {apiError}
                            </p>
                          </div>
                        )}
                      </form>
                    </ModalBody>

                    <ModalFooter className="border-t border-zinc-900">
                      <Button
                        variant="light"
                        onPress={onClose}
                        className="text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </Button>

                      <Button
                        color="primary"
                        className="bg-blue-600 font-bold px-8"
                        isLoading={isLoadingForm}
                        onPress={handleSubmit((data) => handleLogin(data, onClose))} // This triggers the form logic from outside the <form>
                      >
                        Update Password
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>

        {/* User Handle & Bio */}
        <div className="mt-2">
          <h1 className="text-xl font-black">{name}</h1>
          <p className="text-zinc-500 text-sm">@{username}</p>
        </div>

        <p className="mt-3 text-[15px] leading-relaxed">
          UI/UX Enthusiast, Creative Coder | Building the future, one pixel at a
          time.
        </p>

        {/* Metadata (Location, Link, Joined) */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-zinc-500">
          <div className="flex items-center gap-1">
            <HiOutlineMapPin /> <span>Cairo, Egypt</span>
          </div>
          <div className="flex items-center gap-1 text-blue-500">
            <HiOutlineLink />{" "}
            <span className="hover:underline cursor-pointer">
              {newPassword}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineCalendar /> <span>Joined {formattedDate}</span>
          </div>
        </div>

        {/* Following/Followers Stats */}
        <div className="flex gap-4 mt-3 text-sm">
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-white">{followingCount}</span>{" "}
            <span className="text-zinc-500">Following</span>
          </div>
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-white">{followersCount}</span>{" "}
            <span className="text-zinc-500">Followers</span>
          </div>
        </div>
      </div>

      {/* --- Twitter Style Navigation Tabs --- */}
      <div className="mt-4 border-b border-zinc-900">
        <Tabs
          variant="underlined"
          aria-label="Profile Tabs"
          classNames={{
            tabList:
              "gap-0 w-full relative rounded-none p-0 border-b border-white/10",
            cursor: "w-full bg-blue-500",
            tab: "max-w-fit px-6 h-12",
            tabContent:
              "group-data-[selected=true]:text-white text-zinc-500 font-bold",
          }}
        >
          <Tab key="posts" title="Posts" />
          <Tab key="replies" title="Replies" />
          <Tab key="highlights" title="Highlights" />
          <Tab key="media" title="Media" />
        </Tabs>
      </div>

      {/* --- Placeholder Feed --- */}
      <div className="divide-y divide-zinc-900">
        {[1, 2, 3].map((post) => (
          <div
            key={post}
            className="p-4 hover:bg-zinc-950 transition-colors cursor-pointer"
          >
            <div className="flex gap-3">
              <Avatar src="https://i.pravatar.cc/150?u=zomokx" size="sm" />
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm">Zomok X</span>
                  <span className="text-zinc-500 text-sm">@zomok_x · 2h</span>
                </div>
                <p className="text-sm mt-1">
                  This is how the mobile-first Twitter profile looks. Simple,
                  clean, and functional. 🚀
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
