import React, { useContext } from "react";
import {
  Listbox,
  ListboxItem,
  Avatar,
  Button,
  useDisclosure,
  Badge,
} from "@heroui/react";
import { HiHome, HiSearch, HiBell, HiMail, HiUser } from "react-icons/hi";
import { FaFeatherAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import ModalCreatePost from "../ModalCreatePost/ModalCreatePost";
import { CounterContext } from "../../Context/CounterContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export default function RightSidebar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const { userUserData } = useContext(CounterContext);

  const getNotificationsCount = () => {
    return axios.get(
      `https://route-posts.routemisr.com/notifications/unread-count`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };

  const { data, isLoading } = useQuery({
    queryKey: ["getNotificationsCount"],
    queryFn: getNotificationsCount,
    refetchInterval: 30000, // Polls every 30 seconds
  });
  const notificationCount = data?.data?.data?.unreadCount || 0;

  const navItems = [
    { key: "home", icon: <HiHome />, label: "Home", path: "/home" },
    { key: "search", icon: <HiSearch />, label: "Explore", path: "/search" },
    {
      key: "notifications",
      icon: <HiBell />,
      label: "Notifications",
      path: "/notifications",
      hasBadge: true,
    },
    { key: "messages", icon: <HiMail />, label: "Messages", path: "/messages" },
    { key: "profile", icon: <HiUser />, label: "Profile", path: "/profile" },
  ];

  return (
    <aside className="group fixed right-0 top-0 h-screen z-50 bg-black border-l border-zinc-800 flex flex-col py-6 px-3 w-20 lg:w-24 lg:hover:w-64 transition-all duration-500 ease-in-out shadow-2xl">
      {/* Brand Logo */}
      <div className="mb-10 px-3 flex items-center justify-center lg:group-hover:justify-start text-white font-black text-2xl h-10 shrink-0">
        <span className="lg:group-hover:hidden transition-all duration-300 text-pink-500">
          Z
        </span>
        <span className="hidden lg:group-hover:block transition-all duration-500 whitespace-nowrap">
          Zomok X
        </span>
      </div>

      {/* Navigation */}
      <div className="w-full flex-grow overflow-y-auto scrollbar-hide">
        <Listbox
          aria-label="Navigation"
          variant="flat"
          className="gap-2 p-0 w-full"
          itemClasses={{
            base: "flex items-center justify-center lg:group-hover:justify-start gap-4 rounded-2xl h-14 px-3 transition-all duration-200 hover:bg-zinc-900",
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <ListboxItem
                onClick={() => navigate(item.path)}
                key={item.key}
                textValue={item.label}
                className={isActive ? "bg-zinc-800 text-sky-500" : ""}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`text-2xl transition-colors ${isActive ? "text-sky-500" : "text-zinc-400 group-hover:text-white"}`}
                  >
                    {item.hasBadge && notificationCount > 0 ? (
                      <Badge
                        content={notificationCount}
                        color="danger"
                        size="sm"
                        shape="circle"
                        // Use classNames to bypass the boolean prop error
                        classNames={{
                          badge: "border-none shadow-none",
                        }}
                      >
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </div>
                  <span
                    className={`text-lg font-medium hidden lg:group-hover:block transition-opacity duration-500 opacity-0 lg:group-hover:opacity-100 ${isActive ? "text-white font-bold" : "text-white"}`}
                  >
                    {item.label}
                  </span>
                </div>
              </ListboxItem>
            );
          })}
        </Listbox>
      </div>

      {/* Action Button */}
      <div className="mt-4 w-full flex justify-center lg:group-hover:px-2">
        <Button
          onPress={onOpen}
          isIconOnly
          className="bg-sky-500 text-white w-12 h-12 lg:group-hover:hidden rounded-full shadow-lg"
        >
          <FaFeatherAlt />
        </Button>
        <Button
          onPress={onOpen}
          className="hidden lg:group-hover:flex bg-sky-500 text-white w-full h-12 rounded-full font-bold text-lg"
        >
          Post
        </Button>
      </div>

      <ModalCreatePost isOpen={isOpen} onOpenChange={onOpenChange} />

      {/* Profile Section */}
      <div className="mt-auto pt-4 border-t border-zinc-800 w-full flex items-center justify-center lg:group-hover:justify-start gap-3 cursor-pointer hover:bg-zinc-900 p-2 rounded-xl transition-all">
        <Avatar
          src={userUserData?.photo}
          className="w-10 h-10 shrink-0 border-2 border-pink-500"
        />
        <div className="hidden lg:group-hover:flex flex-col overflow-hidden">
          <span className="text-white font-bold text-sm truncate">
            {userUserData?.name}
          </span>
          <span className="text-zinc-500 text-xs truncate">
            @{userUserData?.username}
          </span>
        </div>
      </div>
    </aside>
  );
}
