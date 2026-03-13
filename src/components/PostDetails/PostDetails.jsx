import axios from 'axios'
import React from 'react'
import { Vortex } from 'react-loader-spinner';
import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import PostCard from './../PostCard/PostCard';

export default function PostDetails() {
const {id} =  useParams();

const getPostDetails = ()=>{


return axios.get(`https://route-posts.routemisr.com/posts/${id}`,{
    headers :{
        Authorization:`Bearer ${localStorage.getItem("userToken")}`
    }
})


}

const {data,isLoading, isError, error ,isFetching} = useQuery({
    queryKey:["getPostDetails" ,id],
    queryFn:getPostDetails,
  })
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
          colors={["#ec4899", "#09c", "black","#ec4899","#09c"]}
        />
      </div>
    );
  }
  if (isError) {
    return (
      <>
        <h1 className="text-xl rounded-3xl text-center  bg-blue-500 text-red-600 p-2 mx-auto">{error.message}</h1>
      </>
    );
  }
  return (
    <>
    <div className='mx-auto flex flex-col justify-center items-center'>
      <h1 className='font-bold text-3xl py-2 '>Post Details</h1>
      <PostCard post={data?.data.data.post} isPostDetails={true} />
      </div>
    </>
  )
}
