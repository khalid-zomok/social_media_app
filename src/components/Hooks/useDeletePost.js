import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";

export default function useDeletePost(id) {
  const query = useQueryClient();
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);

  const deleteMyPost = () => {
    return axios.delete(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  };

  return useMutation({
    mutationFn: deleteMyPost,
    onSuccess: () => {
      toast.success("Post Deleted Successfully ");
      query.invalidateQueries({
        queryKey: ["getAllPosts"],
      });
      navigate("/");
    },
    onError: () => {
      toast.error("Can't Delete this Post Right now ...! ");
    },
    onSettled: () => {},
  });
}
