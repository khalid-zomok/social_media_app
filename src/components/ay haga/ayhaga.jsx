import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from "@heroui/react";
import Comment from "./../Comment/Comment";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Vortex } from "react-loader-spinner";
import CommentCreation from "../CommentCreation/CommentCreation";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { useContext, useState } from "react";
import { AuthContext } from "./../../Context/AuthContext";
import PostUpdate from "./../PostUpdate/PostUpdate";
import useDeletePost from "../Hooks/useDeletePost";
import useLikePost from "../Hooks/useLikePost";
import useGetLikes from "../Hooks/useGetLikes";

const PLACE_HOLDER_IMAGE =
  "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";
export default function PostCard({ post, isPostDetails = false }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    body,
    image,
    topComment,
    commentsCount,
    createdAt,
    user,
    id,
    likesCount,
    likes,
  } = post;

  const { name, photo: userImage, _id: postUserId } = user;
  const { isPending, mutate } = useDeletePost(id);
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const isLiked = likes?.includes(userId);

  const getPostComments = () => {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${id}/comments?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["getPostComments"],
    queryFn: getPostComments,
    enabled: isPostDetails,
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
        <h1 className="text-xl rounded-3xl text-center  bg-blue-500 text-red-600 p-2 mx-auto">
          {error.message}
        </h1>
      </>
    );
  }
  if (!body && !image) return;

  const { mutate: mutateLike } = useLikePost(isLiked);
  const {
    data: likeArray,
    isLoading: isLoadingLike,
    isFetched: isFetchedLike,
  } = useGetLikes(id);

  //const getLikesProfiles = () => {};

  return (
    <>
      <Dropdown className="bg-zinc-950 border border-zinc-800 text-white">
        <DropdownTrigger>
          <Button
            onPress={() => toggleLike(id)}
            onContextMenu={handleRightClick}
            className={`flex items-center gap-2 text-sm transition-colors ${isLiked ? "text-pink-500 font-bold" : "text-zinc-400 hover:text-pink-500"}`}
          >
            {isLiked ? (
              <HiHeart className="text-xl" />
            ) : (
              <HiOutlineHeart className="text-xl" />
            )}
            <span>{likesCount || 0}</span>
          </Button>
        </DropdownTrigger>
        {isRightClicked && (
          <DropdownMenu aria-label="Liking Users">
            {(likeArray?.data?.data?.likes || []).map((u) => (
              <DropdownItem key={u._id} textValue={u.name}>
                <div className="flex items-center gap-2">
                  <Avatar size="sm" src={u.photo || PLACE_HOLDER_IMAGE} />
                  <span className="text-xs font-bold">{u.name}</span>
                </div>
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </Dropdown>
      <Dropdown
        isOpen={isOpen}
        onOpenChange={setIsOpen} // Syncs state when clicking outside to close
        className="bg-zinc-950 border border-zinc-800 text-white"
      >
        <DropdownTrigger>
          {/* Wrap in a div to capture the right-click before it hits the trigger */}
          <div onContextMenu={handleRightClick} className="inline-block">
            <Button
              onPress={handleLeftClick} // HeroUI uses onPress for better mobile support
              className={`flex items-center gap-2 text-sm transition-colors min-w-0 bg-transparent ${
                isLiked
                  ? "text-pink-500 font-bold"
                  : "text-zinc-400 hover:text-pink-500"
              }`}
            >
              {isLiked ? (
                <HiHeart className="text-xl" />
              ) : (
                <HiOutlineHeart className="text-xl" />
              )}
              <span>{likesCount || 0}</span>
            </Button>
          </div>
        </DropdownTrigger>

        <DropdownMenu aria-label="Liking Users" emptyContent="No likes yet">
          {(likeArray?.data?.data?.likes || []).map((u) => (
            <DropdownItem key={u._id} textValue={u.name} className="gap-2">
              <div className="flex items-center gap-2">
                <Avatar size="sm" src={u.photo || PLACE_HOLDER_IMAGE} />
                <span className="text-xs font-bold">{u.name}</span>
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>

    // <Card className="xl:w-1/4 lg:w-1/3 md:w-1/2 sm:w-full">
    //   <CardHeader className="flex justify-between gap-3">
    //     <div className="flex gap-1">
    //       <img
    //         alt="heroui logo"
    //         height={40}
    //         radius="sm"
    //         src={userImage}
    //         width={40}
    //         onError={(e) => {
    //           e.target.src = PLACE_HOLDER_IMAGE;
    //         }}
    //       />
    //       <div className="flex flex-col">
    //         <p className="text-md">{name}</p>
    //         <p className="text-small text-default-500">{createdAt}</p>
    //       </div>
    //     </div>
    //     {userId == postUserId && (
    //       <Dropdown>
    //         <DropdownTrigger>
    //           <HiOutlineDotsVertical className="text-2xl cursor-pointer" />
    //         </DropdownTrigger>
    //         <DropdownMenu aria-label="Static Actions">
    //           <DropdownItem key="edit">
    //             <div
    //               className="flex justify-between items-center"
    //               onClick={onOpen}
    //             >
    //               Edit Post <CiEdit className="text-2xl" />
    //             </div>
    //           </DropdownItem>
    //           <DropdownItem key="delete" className="text-danger" color="danger">
    //             <div
    //               className="flex justify-between items-center"
    //               onClick={mutate}
    //             >
    //               Delete Post <MdDelete className="text-2xl" />
    //             </div>
    //           </DropdownItem>
    //         </DropdownMenu>
    //       </Dropdown>
    //     )}

    //     {isOpen ? (
    //       <PostUpdate post={post} isOpen={isOpen} onOpenChange={onOpenChange} />
    //     ) : (
    //       ""
    //     )}
    //   </CardHeader>
    //   <Divider />
    //   <CardBody>
    //     {body && <p className="mb-2 break-all overflow-hidden whitespace-pre-wrap">{body}</p>}
    //     {image && (
    //       <img
    //         className="w-full min-h-25 max-h-50  max-w-full object-cover rounded-lg"
    //         src={image}
    //         alt={body || "postImage"}
    //       />
    //     )}
    //   </CardBody>
    //   <Divider />

    //   <CommentCreation
    //     postId={id}
    //     queryKey={isPostDetails ? ["getPostComments"] : ["getAllPosts"]}
    //   />

    //   <CardFooter>
    //     <div className="w-full flex justify-between">
    //     {/* Change the condition if u want everone to see all users likes */}
    //       {userId === postUserId ? (
    //         <Dropdown>
    //           <DropdownTrigger>
    //             <div
    //               className={`cursor-pointer text-sm flex items-center gap-1 transition-all duration-200 ${
    //                 isLiked ? "text-blue-600 font-bold" : "text-gray-500"
    //               }`}
    //             >
    //               <span>{isLiked ? "💙" : "👍"}</span>
    //               <span>Like {likesCount > 0 ? likesCount : ""}</span>
    //             </div>
    //           </DropdownTrigger>
    //           <DropdownMenu aria-label="Liking Users">
    //             {/* Check if likeArray exists, then access the nested likes array */}
    //             {(likeArray?.data?.data?.likes || []).map((item) => {
    //               return (
    //                 <DropdownItem key={item._id} textValue={item.name}>
    //                   <div className="flex items-center gap-2">
    //                     <img
    //                       alt={item.name}
    //                       height={30}
    //                       width={30}
    //                       className="rounded-full object-cover w-8 h-8"
    //                       // Use item.photo as seen in your Postman response
    //                       src={item.photo || PLACE_HOLDER_IMAGE}
    //                       onError={(e) => {
    //                         e.target.src = PLACE_HOLDER_IMAGE;
    //                       }}
    //                     />
    //                     <div className="flex flex-col">
    //                       <p className="text-sm font-semibold">{item.name}</p>
    //                       {item.username && (
    //                         <p className="text-tiny text-default-400">
    //                           @{item.username}
    //                         </p>
    //                       )}
    //                     </div>
    //                   </div>
    //                 </DropdownItem>
    //               );
    //             })}
    //           </DropdownMenu>
    //         </Dropdown>
    //       ) : (
    //         <div
    //           onClick={() => {
    //            mutateLike(id);
    //           }}
    //           className={`cursor-pointer text-sm flex items-center gap-1 transition-all duration-200 ${
    //             isLiked ? "text-blue-600 font-bold" : "text-gray-500"
    //           }`}
    //         >
    //           <span>{isLiked ? "💙" : "👍"}</span>
    //           <span>Like {likesCount > 0 ? likesCount : ""}</span>
    //         </div>
    //       )}

    //       <div className="cursor-pointer text-sm ">
    //         <Link to={`/postdetails/${id}`}>
    //           💬 Comment {commentsCount ? commentsCount : ""}
    //         </Link>
    //       </div>
    //       <div className="cursor-pointer text-sm ">📩 Share</div>
    //       <div></div>
    //     </div>
    //   </CardFooter>
    //   {!isPostDetails && topComment && (
    //     <Comment
    //       topComment={topComment}
    //       PLACE_HOLDER_IMAGE={PLACE_HOLDER_IMAGE}
    //     />
    //   )}
    //   {isPostDetails &&
    //     (commentsCount ? commentsCount : "") &&
    //     data?.data.data.comments.map((currentComment) => (
    //       <Comment
    //         key={currentComment._id}
    //         topComment={currentComment}
    //         PLACE_HOLDER_IMAGE={PLACE_HOLDER_IMAGE}
    //       />
    //     ))}
    // </Card>
  );

  //===============================
}
