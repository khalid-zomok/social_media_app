import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useRef, useState } from 'react';
import { FaImage } from 'react-icons/fa';
import { IoIosCloseCircle } from 'react-icons/io';
import { toast } from 'react-toastify';

export default function PostUpdate({ isOpen, onOpenChange, post }) {
  // Use camelCase naming for consistency
  const [isUploaded, setIsUploaded] = useState(null);
  const [content, setContent] = useState("");
  const imageInput = useRef(null);
  const query = useQueryClient();

  useEffect(() => {
    if (post && isOpen) {
      setContent(post.body || "");
      setIsUploaded(post.image || null);
    }
  }, [post, isOpen]);

  const updatePost = (formData)=>{
    return axios.put(`https://route-posts.routemisr.com/posts/${post.id}`,formData,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("userToken")}`
      }
    })
  }
  const {isPending, mutate} = useMutation({
    mutationFn:updatePost,
    onSuccess:()=>{
      console.log("post updated successfully");
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      toast.success("Post Updated successfully 👍", {
        autoClose: 3000,
      });
    },
    onError: (err) => {
      console.error("Mutation Error Details:", err);
      toast.error("🔴 Post couldn't be updated now!", {
        autoClose: 3000,
      });
    }
  });


  //============================== handle if image is empty =================///////////
  const prepareDate = () => {
    const formData = new FormData();
    const hasNewFile = imageInput.current?.files[0];

    // If no text and no image (new or existing), don't submit
    if (!content.trim() && !isUploaded && !hasNewFile) return null;

    formData.append("body", content);
    if (hasNewFile) {
      formData.append("image", hasNewFile);
    }
    return formData;
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Memory management: clean up old preview URLs
      if (isUploaded && isUploaded.startsWith('blob:')) {
        URL.revokeObjectURL(isUploaded);
      }
      setIsUploaded(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setIsUploaded(null);
    if (imageInput.current) imageInput.current.value = "";
    // Note: Usually, you don't want to clear the text just because 
    // an image was removed, so we only reset isUploaded.
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Your Post
            </ModalHeader>
            <ModalBody>
              <textarea
                onChange={(e) => setContent(e.target.value)}
                value={content}
                className="w-full rounded-md bg-slate-200 dark:bg-slate-700 p-2 min-h-25"
                placeholder="What's on your mind..?"
              ></textarea>
              
              {isUploaded && (
                <div className="relative mt-2">
                  <img
                    alt="Preview"
                    className="object-cover rounded-xl w-full max-h-75"
                    src={isUploaded}
                  />
                  <IoIosCloseCircle
                    onClick={handleRemoveImage}
                    className="text-red-500 text-3xl absolute top-2 right-2 cursor-pointer bg-white rounded-full"
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter className="flex items-center">
              <label className="hover:bg-slate-100 p-2 rounded-full cursor-pointer transition-colors">
                <FaImage className="text-2xl text-blue-500" />
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
                onPress={() => {
                  const data = prepareDate();
                  if (data) {
                    mutate(data);
                    onClose();
                  } else {
                    toast.warn("Your post cannot be empty!");
                  }
                }}
              >
                Update Post
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}