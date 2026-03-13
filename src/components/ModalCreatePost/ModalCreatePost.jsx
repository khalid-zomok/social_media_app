import React, { useEffect, useRef, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { IoIosCloseCircle } from "react-icons/io";
import { FaImage } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

export default function ModalCreatePost({ isOpen, onOpenChange }) {
  const [isUploaded, setIsUploaded] = useState(false);
  const query = useQueryClient();
  const imageInput = useRef(null);
  const textareaInput = useRef(null);

  // Auto-reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsUploaded(false);
      if (imageInput.current) imageInput.current.value = "";
      if (textareaInput.current) textareaInput.current.value = "";
    }
  }, [isOpen]);

  const createPost = (formData) => {
    return axios.post(`https://route-posts.routemisr.com/posts`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
  };

  const { isPending, mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      toast.success("Post created successfully 👍");
    },
  });

  const handleImagePreview = (e) => {
    if (e.target.files[0]) {
      const path = URL.createObjectURL(e.target.files[0]);
      setIsUploaded(path);
    }
  };

  const submitPost = (onClose) => {
    const formData = new FormData();
    const body = textareaInput.current.value;
    const file = imageInput.current.files[0];

    if (!body && !file) {
      return toast.warn("Please add some content first!");
    }

    if (body) formData.append("body", body);
    if (file) formData.append("image", file);

    mutate(formData, {
      onSuccess: () => onClose(), // Close only if successful
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Create Your Post</ModalHeader>
            <ModalBody>
              <textarea
                ref={textareaInput}
                className="w-full rounded-md bg-slate-400 p-2"
                placeholder="What's on your mind..?"
              ></textarea>
              {isUploaded && (
                <div className="relative">
                  <img alt="Preview" className="object-cover rounded-xl" src={isUploaded} />
                  <IoIosCloseCircle
                    onClick={() => { setIsUploaded(false); imageInput.current.value = ""; }}
                    className="text-amber-50 text-4xl absolute top-1 right-1 bg-black rounded-full cursor-pointer"
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <label className="hover:bg-slate-300 p-2 rounded-sm cursor-pointer">
                <FaImage className="text-2xl" />
                <input ref={imageInput} type="file" onChange={handleImagePreview} hidden />
              </label>
              <Button color="danger" variant="light" onPress={onClose}>Close</Button>
              <Button color="primary" isLoading={isPending} onPress={() => submitPost(onClose)}>
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}


// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
// } from "@heroui/react";
// import React, { useEffect, useRef, useState } from "react";
// import { IoIosCloseCircle } from "react-icons/io";
// import { FaImage } from "react-icons/fa";
// import axios from "axios";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";


// export default function ModalCreatePost({ isOpen, onOpen, onOpenChange }) {
//   const [isUploaded, setisUploaded] = useState(false);
//   const query = useQueryClient();
//   const imageInput = useRef(null);
//   const textareaInput = useRef(null);

//   useEffect(() => {
//   if (!isOpen) {
//     // This triggers every time the modal closes
//     setisUploaded(false);
//     if (imageInput.current) imageInput.current.value = "";
//     if (textareaInput.current) textareaInput.current.value = "";
//   }
// }, [isOpen]);
//   const prepareDate = () => {
//     const formDate = new FormData();
//     if (!textareaInput.current.value && !imageInput.current.files[0]) return;
//     if (textareaInput.current.value)
//       formDate.append("body", textareaInput.current.value);
//     if (imageInput.current.files[0])
//       formDate.append("image", imageInput.current.files[0]);
//     return formDate;
//   };
//   const createPost = (formData) => {
//     return axios.post(`https://route-posts.routemisr.com/posts`, formData, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//       },
//     });
//   };

//   const handleImagePreview = (e) => {
//     const path = URL.createObjectURL(e.target.files[0]);
//     setisUploaded(path);
//   };

//   const handleRemoveImage = () => {
//     setisUploaded(false);
//     imageInput.current.value = "";
//     textareaInput.current.value = "";
//   };
  

//   const { isPending, mutate } = useMutation({
//     mutationFn: createPost,
//     onSuccess: () => {
//       // 1. Reset UI first
//       setisUploaded(false);
//       if (imageInput.current) imageInput.current.value = "";
//       if (textareaInput.current) textareaInput.current.value = "";
      
//       // 2. Refresh Data
//       query.invalidateQueries({ queryKey: ["getAllPosts"] });

//       // 3. Show Success
//       toast.success("Post created successfully 👍", {
//         autoClose: 3000,
//       });
//     },
//     // FIX: Use 'err' (the local argument) instead of 'error' (the destructured state)
//     onError: (err) => {
//       console.error("Mutation Error Details:", err);
//       toast.error("🔴 Post couldn't be created now!", {
//         autoClose: 3000,
//       });
//     }
//   });
//   return (
//     <>
//         <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className="flex flex-col gap-1">
//                 Create Your Post
//               </ModalHeader>
//               <ModalBody>
//                 <textarea
//                   ref={textareaInput}
//                   className="w-full rounded-md bg-slate-400 p-2"
//                   placeholder="what's in your mind..?"
//                 ></textarea>
//                 {isUploaded && (
//                   <div className="relative">
//                     <img
//                       alt="Card background"
//                       className="object-cover rounded-xl"
//                       src={isUploaded}
//                     />
//                     <IoIosCloseCircle
//                       onClick={handleRemoveImage}
//                       className=" text-amber-50 text-4xl absolute top-[3px] right-[5px] bg-black"
//                     />
//                   </div>
//                 )}
//               </ModalBody>
//               <ModalFooter className="flex items-center ">
//                 <label className="hover:bg-slate-300  p-2 rounded-sm cursor-pointer">
//                   <FaImage className="text-2xl" />
//                   <input
//                     ref={imageInput}
//                     type="file"
//                     onChange={handleImagePreview}
//                     hidden
//                   />
//                 </label>
//                 <Button color="danger" variant="light" onPress={onClose}>
//                   Close
//                 </Button>
//                 <button isLoading={isPending}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md"
//                   onClick={() => {
//                     const data = prepareDate(); // Prepare it here
//                     if (data) {
//                       mutate(data); // Pass it to the mutation
//                       onClose();
//                     } else {
//                       toast.warn("Please add some content first!");
//                     }
//                   }}
//                 >
//                   Create
//                 </button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </>
//   )
// }
