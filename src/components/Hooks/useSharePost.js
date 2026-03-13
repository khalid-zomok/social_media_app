import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

export default function useSharePost(postId, mentor_user) {
  const query = useQueryClient();
  const sharePost = () => {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/share`,
      {
        body: `Sharing this great post @${mentor_user}`,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };

  return useMutation({
    mutationFn: sharePost,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      toast.success("Post Shared successfully 👍", {
        autoClose: 3000,
      });
    },
    onError: (err) => {
      console.error("Mutation Error Details:", err);
      toast.error("🔴 Post couldn't be Shared now!", {
        autoClose: 3000,
      });
    },
  });
}
