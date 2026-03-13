import axios from "axios";
import React, { useEffect, useState } from "react";
import PostCard from "./../PostCard/PostCard";
import { Vortex } from "react-loader-spinner";
import { useQuery } from "@tanstack/react-query";
import PostCreation from './../PostCreation/PostCreation';

export default function Home() {
  const getAllPosts = () => {
    const userToken = localStorage.getItem("userToken");

    // 1. Safety check: Don't request if the token is missing
    if (!userToken) {
      console.error("No token found in localStorage.");
      return;
    }

    return axios.get(`https://route-posts.routemisr.com/posts`, {
      params: {
        limit: 40,
      },
      headers: {
        // 2. Try sending the token directly without "Bearer "
        Authorization: `Bearer ${userToken}`,
      },
    });
  };
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,
  });
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <Vortex
          visible={true}
          height="300"
          width="300"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={["#ec4899", "#09c", "black", "#ec4899", "#09c"]}
        />
      </div>
    );
  }
  if (isError) {
    return (
      <>
        <h1 className="text-8xl">{error.message}</h1>
      </>
    );
  }
  return (
    <div className="max-w-6xl mx-auto">
      
      <div className="mb-8 max-w-2xl mx-auto">
        <PostCreation />
      </div>

      {/* Professional Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data?.data.data.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
