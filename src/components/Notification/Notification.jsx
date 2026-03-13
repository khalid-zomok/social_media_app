import React from "react";
import { Avatar, Tabs, Tab, Button, Skeleton, Divider } from "@heroui/react";
import {
  HiHeart,
  HiUserAdd,
  HiChatAlt2,
  HiDotsHorizontal,
  HiShare,
  HiRefresh,
  HiAtSymbol,
} from "react-icons/hi";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns"; // Standard for professional apps
import { useNavigate } from "react-router-dom";
import { CiRead } from "react-icons/ci";
import { toast } from "react-toastify";

// 1. Move configuration OUTSIDE the component to prevent re-renders
const NOTIFICATION_CONFIG = {
  like_post: {
    icon: <HiHeart className="text-pink-500 text-xl" />,
    label: "liked your post",
  },
  follow_user: {
    icon: <HiUserAdd className="text-sky-500 text-xl" />,
    label: "started following you",
  },
  comment_post: {
    icon: <HiChatAlt2 className="text-green-500 text-xl" />,
    label: "commented on your post",
  },
  share_post: {
    icon: <HiShare className="text-purple-500 text-xl" />,
    label: "shared your post",
  },
  mention_user: {
    icon: <HiAtSymbol className="text-orange-500 text-xl" />,
    label: "mentioned you in a post",
  },
};

export default function Notification() {
  const navigate = useNavigate();
  const query = useQueryClient();
  const getAllNotifications = () => {
    return axios.get(
      `https://route-posts.routemisr.com/notifications?unread=false&page=1&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getAllNotifications,
    refetchInterval: 30000,
  });
  const notifications = data?.data?.data?.notifications;

  const markNotificationAsRead = (notificationId) => {
    return axios.patch(
      `https://route-posts.routemisr.com/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };
  const { isPending, mutate } = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      console.log("Notification mark as read ");
      query.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification mark as read", {
        autoClose: 3000,
      });
    },
    onError: (err) => {
      console.error("Mutation Error Details:", err);
      toast.error("🔴Can't mark Notification  as read now!", {
        autoClose: 3000,
      });
    },
  });
  // read all notification
   const markALLNotificationAsRead = () => {
    return axios.patch(
      `https://route-posts.routemisr.com/notifications/read-all`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };
  const { isPending:isPendingAllNotificationAsRead, mutate:mutateAllNotificationAsRead } = useMutation({
    mutationFn: markALLNotificationAsRead,
    onSuccess: () => {
      console.log("All Notification mark as read ");
      toast.success("All Notification mark as read", {
        autoClose: 3000,
      });
    },
    onError: (err) => {
      console.error("Mutation Error Details:", err);
      toast.error("🔴Can't mark Notification  as read now!", {
        autoClose: 3000,
      });
    },
  });
  // 2. Render Skeleton Screen for better UX
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="rounded-lg h-20 w-full bg-zinc-800" />
        ))}
      </div>
    );
  }

  const getReactionPost = (id) => {
    navigate(`/postdetails/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-black text-white border-x border-zinc-800">
      <header className="sticky top-0 bg-black/80 backdrop-blur-md z-10 px-4 py-4 border-b border-zinc-800">
        <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
      </header>
      <div className="flex justify-center w-full py-2">
        <Button
          onPress={() => {mutateAllNotificationAsRead()}}
          variant="light"
          size="sm"
          className="text-black bold bg-blue-500 py-2 center"
        >
          Remove All <CiRead className="text-4xl text-black bold" />
        </Button>
      </div>
      <Divider className="bg-white"></Divider>
      <div className="flex flex-col">
        {notifications?.map((notif) => {
          const config = NOTIFICATION_CONFIG[notif.type] || {};

          return (
            <div
              onClick={() => {
                if (notif.type !== "follow_user") {
                  getReactionPost(notif.entityId);
                }
              }}
              key={notif._id}
              className={`flex gap-4 p-4 border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-all cursor-pointer ${
                !notif.isRead ? "bg-blue-500/5" : ""
              }`}
            >
              <div className="flex flex-col items-center min-w-[40px]">
                {config.icon}
              </div>

              <div className="flex-grow flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <Avatar
                    src={notif.actor.photo}
                    size="md"
                    isBordered
                    className="border-zinc-700"
                  />
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Button
                      onPress={(e) => {
                        mutate(notif._id);
                      }}
                      variant="light"
                      size="sm"
                      className="text-zinc-500"
                    >
                      <CiRead className="text-4xl text-blue-500" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm leading-relaxed">
                  <span className="font-bold hover:underline cursor-pointer">
                    {notif.actor.name}
                  </span>{" "}
                  <span className="text-zinc-400">{config.label}</span>
                  {notif.entity?.body && (
                    <p className="text-zinc-500 mt-1 italic line-clamp-2">
                      "{notif.entity.body}"
                    </p>
                  )}
                  <div className="text-xs text-zinc-500 mt-1">
                    {formatDistanceToNow(new Date(notif.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
