import React, { useContext, useState } from "react";
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
  Avatar,
  Button,
} from "@heroui/react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Vortex } from "react-loader-spinner";
import {
  HiEllipsisVertical,
  HiOutlineChatBubbleLeft,
  HiOutlineHeart,
  HiOutlineShare,
  HiHeart,
  HiShare,
} from "react-icons/hi2";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { AuthContext } from "./../../Context/AuthContext";
import PostUpdate from "./../PostUpdate/PostUpdate";
import useDeletePost from "../Hooks/useDeletePost";
import useLikePost from "../Hooks/useLikePost";
import useGetLikes from "../Hooks/useGetLikes";
import Comment from "./../Comment/Comment";
import CommentCreation from "../CommentCreation/CommentCreation";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import useSharePost from "../Hooks/useSharePost";
import useBookMarkPost from "../Hooks/useBookMarkPost";

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
    isShare,
    bookmarked,
    sharesCount
  } = post;
  console.log(post);

  const { name, photo: userImage, _id: postUserId, username } = user;
  const { mutate: sharePost } = useSharePost(id, username);
  const { userId } = useContext(AuthContext);
  const { mutate: deletePost } = useDeletePost(id);
  const isLiked = likes?.includes(userId);
  const { mutate: toggleLike } = useLikePost(isLiked);
  const { mutate: bookmarkPost } = useBookMarkPost(id);
  const [isRightClicked, setisRightClicked] = useState(false);
  // --- LOGIC: useQuery for Comments ---
  const { data, isLoading } = useQuery({
    queryKey: ["getPostComments", id],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }),
    enabled: isPostDetails,
  });

  const { data: likeArray } = useGetLikes(id);

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleRightClick = (e) => {
    e.preventDefault(); // Stop the browser's default menu
    setisRightClicked(true); // Open HeroUI dropdown manually
  };

  const handleLeftClick = (e) => {
    // We stop propagation so HeroUI doesn't try to toggle the menu itself
    e.stopPropagation();
    toggleLike(id);
  };

  if (isPostDetails && isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <Vortex
          visible={true}
          height="100"
          width="100"
          colors={["#ec4899", "#09c", "white", "#ec4899", "#09c"]}
        />
      </div>
    );
  }

  if (!body && !image) return null;

  return (
    <Card className="w-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800 hover:border-zinc-700 transition-all duration-300 shadow-xl overflow-visible mb-6 group">
      {/* 1. Header with Pink Ring Avatar */}
      <CardHeader className="flex justify-between items-start px-4 pt-4 pb-2">
        <div className="flex gap-3">
          <Avatar
            isBordered
            className="shrink-0 ring-offset-zinc-900 ring-pink-500"
            radius="full"
            size="md"
            src={userImage || PLACE_HOLDER_IMAGE}
          />
          <div className="flex flex-col">
            <h4 className="text-zinc-100 font-bold text-sm leading-tight hover:text-pink-400 transition-colors">
              {name}
            </h4>
            <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold">
              {formattedDate}
            </p>
          </div>
        </div>

        {userId === postUserId && (
          <Dropdown className="bg-zinc-950 border border-zinc-800 text-white">
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-zinc-400"
              >
                <HiEllipsisVertical className="text-2xl" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Post Actions">
              <DropdownItem
                key="edit"
                startContent={<CiEdit className="text-xl" />}
                onClick={onOpen}
              >
                Edit Post
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<MdDelete className="text-xl" />}
                onClick={() => deletePost(id)}
              >
                Delete Post
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </CardHeader>

      {/* 2. Body with Image Hover Transition */}
      <CardBody className="px-4 py-2 overflow-visible">
        {body && (
          <p
            className={`text-zinc-200 text-sm leading-relaxed mb-4 whitespace-pre-wrap ${!isPostDetails && "line-clamp-4"}`}
          >
            {body}
          </p>
        )}
        {image && (
          <div className="rounded-2xl overflow-hidden border border-zinc-800/50 bg-black/40">
            <img
              className="w-full object-cover max-h-[200px] transition-transform duration-700 ease-in-out group-hover:scale-105"
              src={image}
              alt="content"
            />
          </div>
        )}
      </CardBody>

      {/* 3. Interaction Footer */}
      <CardFooter className="flex flex-col gap-2 px-4 pb-4">
        <Divider className="bg-zinc-800/60 mb-2" />
        <div className="flex justify-between items-center w-full px-1">
          <Dropdown
            isOpen={isRightClicked}
            onOpenChange={setisRightClicked} // Syncs state when clicking outside to close
            className="bg-zinc-950 border border-zinc-800 text-white"
          >
            <DropdownTrigger>
              {/* Wrap in a div to capture the right-click before it hits the trigger */}
              <div onContextMenu={handleRightClick} className="inline-block">
                <button
                  onClick={handleLeftClick} // HeroUI uses onPress for better mobile support
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
                </button>
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

          <Link
            to={`/postdetails/${id}`}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-sky-400 transition-all"
          >
            <HiOutlineChatBubbleLeft className="text-xl" />
            <span>{commentsCount || 0}</span>
          </Link>

          <button
            onClick={() => {
              sharePost();
            }}
            className={`flex items-center gap-2 text-sm transition-colors ${
              isShare ? "text-green-500" : "text-zinc-400 hover:text-green-500"
            }`}
          >
            {isShare ? (
              <HiShare className="text-xl" />
            ) : (
              <HiOutlineShare className="text-xl" />
            )}
            <span>{sharesCount || 0}</span>
          </button>

          <button
            onClick={() => {
              bookmarkPost();
            }}
            className={`transition-colors ${
              bookmarked
                ? "text-yellow-500"
                : "text-zinc-400 hover:text-yellow-500"
            }`}
          >
            {/* يمكنك استخدام FaBookmark للحالة النشطة و FaRegBookmark للحالة العادية */}
            {bookmarked ? (
              <FaBookmark className="text-xl" />
            ) : (
              <FaRegBookmark className="text-xl" />
            )}
          </button>
        </div>
      </CardFooter>

      {/* 4. Embedded Logic (to keep Card as root while fixing Context error) */}
      <CardBody className="pt-0 pb-4 px-4 flex flex-col gap-4 overflow-visible">
        <Divider className="bg-zinc-800/60 mb-2" />
        <CommentCreation
          postId={id}
          queryKey={isPostDetails ? ["getPostComments", id] : ["getAllPosts"]}
        />

        {!isPostDetails && topComment && (
          <Comment
            topComment={topComment}
            PLACE_HOLDER_IMAGE={PLACE_HOLDER_IMAGE}
          />
        )}

        {isPostDetails &&
          data?.data?.data?.comments.map((c) => (
            <Comment
              key={c._id}
              topComment={c}
              PLACE_HOLDER_IMAGE={PLACE_HOLDER_IMAGE}
            />
          ))}
      </CardBody>

      {isOpen && (
        <PostUpdate post={post} isOpen={isOpen} onOpenChange={onOpenChange} />
      )}
    </Card>
  );
}
