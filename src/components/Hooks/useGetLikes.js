import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

export default function useGetLikes(id) {
  const getLikes = () => {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${id}/likes?page=1&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };


 return useQuery({
  queryFn: getLikes,
  queryKey: ["getLikes", id], 
});
}
