import React from "react";
import { Avatar, useDisclosure } from "@heroui/react";
import ModalCreatePost from "../ModalCreatePost/ModalCreatePost";

export default function PostCreation() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex w-[60%] mx-auto bg-slate-300 rounded-sm p-2 mb-2">
      <div className="flex flex-1 gap-2">
        <Avatar
          isBordered
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
        <input
          onClick={onOpen}
          className="w-full rounded-md bg-slate-400 cursor-pointer px-4"
          type="text"
          placeholder="What's in your mind?"
          readOnly
        />
      </div>

      {/* Render the Modal component here */}
      <ModalCreatePost isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}

// import {
//   Avatar,
//   useDisclosure,
// } from "@heroui/react";
// import ModalCreatePost from './../ModalCreatePost/ModalCreatePost';

// export default function PostCreation() {
//   const { isOpen, onOpen, onOpenChange } = useDisclosure();
//   return (
//     <div className="flex  w-[60%]  mx-auto bg-slate-300 rounded-sm  p-2 mb-2">
//       <div className="flex flex-1 gap-2">
//         <Avatar
//           isBordered
//           src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
//         />
//         <input
//           onClick={onOpen}
//           className="w-full rounded-md bg-slate-400"
//           type="text"
//           placeholder="What's in your mind?"
//           readOnly
//         />
//       </div>

//     <ModalCreatePost isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange}  />
//     </div>
//   );
// }
