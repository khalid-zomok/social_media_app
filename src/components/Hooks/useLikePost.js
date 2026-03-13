import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

export default function useLikePost(isLiked) {
      const query = useQueryClient();

  const likePost = (id) => {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };

return useMutation({
    mutationFn:likePost,
    onSuccess:()=>{
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      !isLiked ? toast.success("Post liked successfully 👍", {
        autoClose: 3000,
      }): toast.info("Post Unliked successfully 👍", {
        autoClose: 3000,
      })
    },
    onError: (err) => {
      console.error("Mutation Error Details:", err);
      toast.error("🔴 Post couldn't be Liked now!", {
        autoClose: 3000,
      });
    }
})


}



// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { toast } from "react-toastify";

// export default function useLikePost() {
//   const queryClient = useQueryClient();
//   // Ensure you have saved the user ID in localStorage during login
//   const userId = localStorage.getItem("userId"); 
//   const token = localStorage.getItem("userToken");

//   return useMutation({
//     // 1. The Actual API Call
//     mutationFn: async (postId) => {
//       return axios.put(
//         `https://route-posts.routemisr.com/posts/${postId}/like`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//     },

//     // 2. The "Magic" (Optimistic Update)
//     onMutate: async (postId) => {
//       // Stop any active fetches so they don't overwrite our "fake" change
//       await queryClient.cancelQueries({ queryKey: ["getAllPosts"] });

//       // Save the current state (Snapshot) in case the API fails
//       const previousPosts = queryClient.getQueryData(["getAllPosts"]);

//       // Manually edit the cache IMMEDIATELY
//       queryClient.setQueryData(["getAllPosts"], (oldData) => {
//         if (!oldData) return oldData;

//         // Determine if we are liking or unliking based on current cache
//         // Note: Check if your API data is in oldData.posts or oldData.data.posts
//         const postsArray = oldData.posts || oldData.data?.posts || [];

//         const updatedPosts = postsArray.map((post) => {
//           // Match the post by ID (check both id and _id)
//           if (post._id === postId || post.id === postId) {
//             const isAlreadyLiked = post.likes.includes(userId);
            
//             return {
//               ...post,
//               likesCount: isAlreadyLiked ? post.likesCount - 1 : post.likesCount + 1,
//               likes: isAlreadyLiked
//                 ? post.likes.filter((id) => id !== userId) // Remove ID (Unlike)
//                 : [...post.likes, userId], // Add ID (Like)
//             };
//           }
//           return post;
//         });

//         // Reconstruct the data object to match your original Query structure
//         if (oldData.posts) return { ...oldData, posts: updatedPosts };
//         return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
//       });

//       // ⚠️ THIS RETURN IS CRITICAL! It passes the snapshot to onError
//       return { previousPosts };
//     },

//     // 3. The "Safety Net" (Rollback)
//     onError: (err, postId, context) => {
//       console.error("Like failed, rolling back...", err);
//       // If the API fails, put the old data back
//       if (context?.previousPosts) {
//         queryClient.setQueryData(["getAllPosts"], context.previousPosts);
//       }
//       toast.error("Network error: Like couldn't be saved.");
//     },

//     // 4. The "Final Sync"
//     onSettled: () => {
//       // Always refetch after success or error to stay 100% in sync with the database
//       queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
//     },
//   });
// }