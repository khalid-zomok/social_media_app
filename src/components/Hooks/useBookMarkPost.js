import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

export default function useBookMarkPost(postId) {
  const query = useQueryClient();

  const bookmarkPost = () => {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/bookmark`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };
  return useMutation({
    mutationFn: bookmarkPost,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      toast.success("Post Bookmark successfully 👍", {
        autoClose: 3000,
      });
    },
    onError: (err) => {
      console.error("Mutation Error Details:", err);
      toast.error("🔴 Post couldn't be Bookmark now!", {
        autoClose: 3000,
      });
    },
  });
}
