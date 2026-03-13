import { Input } from "@heroui/react";
import React from "react";
import { FaCommentAlt } from "react-icons/fa";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FaImage } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
export default function CommentCreation({ postId, queryKey }) {
  const form = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });

  const { register, handleSubmit, reset } = form;

  const formData = new FormData();

  const createComment = () => {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };

  const query = useQueryClient();
  const { data, isPending, mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: queryKey });
      reset();
      toast.success("comment Created Successfully", {
        autoClose: 3000,
      });
    },
    onError: () => {
      toast.error("🔴 Can't Create the comment Right now...!")
    },
    onSettled: () => {},
  });

  const handleCreateComment = (values) => {
    if (!values.body && !values.image[0]) return;
    if (values.body) {
      formData.append("content", values.body);
    }
    if (values.image[0]) {
      formData.append("image", values.image[0]);
    }

    mutate();
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleCreateComment)}>
        <div className="w-[90%] mx-auto cursor-pointer m-2">
          <Input
            {...register("body")}
            labelPlacement="outside"
            placeholder="Enter your comment here....."
            endContent={
              <button
                disabled={isPending}
                type="submit"
                className="bg-blue-500 flex disabled:bg-slate-950 disabled:cursor-not-allowed items-center p-2 justify-center text-white rounded-sm cursor-pointer"
              >
                {isPending ? (
                  <LuLoaderCircle className="animate-spin" />
                ) : (
                  <FaCommentAlt />
                )}
              </button>
            }
            type="text"
          />
          <label
            htmlFor="test"
            className="w-full bg-blue-500  text-white p-2 m-1 cursor-pointer flex justify-center rounded-sm "
          >
            {isPending ? (
              <LuLoaderCircle className="animate-spin" />
            ) : (
              <FaImage />
            )}
          </label>
          <input {...register("image")} id="test" type="file" hidden />
        </div>
      </form>
    </>
  );
}
