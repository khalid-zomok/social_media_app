import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/react";
import React from "react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function MyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { userLogin, setuserLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const loggedMenuItems = ["home", "Log Out"];
  const unLoggedMenuItems = ["register", "login"];

  const logout = () => {
    localStorage.removeItem("userToken");
    setuserLogin(null);
    navigate("/login");
  };

  return (
    <Navbar className="bg-[#ec4899] border z-50 border-b-black">
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarBrand>
        <p className="font-bold text-inherit">
          <Link to="/home">Zomok X</Link>
        </p>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        <NavbarContent className="hidden sm:flex gap-4" justify="end">
          {userLogin !== null && (
            <NavbarItem>
              <Link color="foreground" to="">
                Home
              </Link>
            </NavbarItem>
          )}

          {userLogin === null && (
            <>
              <NavbarItem>
                <Link color="foreground" to="register">
                  Register
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link color="foreground" to="login">
                  Login
                </Link>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="settings">
              <Link to="profile" className="block w-full">
                Profile
              </Link>
            </DropdownItem>
            <DropdownItem onClick={logout}  key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarMenu>
        {!userLogin
          ? unLoggedMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className="w-full block"
                  color={
                    index === 2
                      ? "primary"
                      : index === unLoggedMenuItems.length - 1
                        ? "danger"
                        : "foreground"
                  }
                  to={`/${item}`}
                  size="lg"
                >
                  {item}
                </Link>
              </NavbarMenuItem>
            ))
          : loggedMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                onClick={item === "Log Out" && function(){logout()} }
                  className="w-full block"
                  color={
                    index === 2
                      ? "primary"
                      : index === loggedMenuItems.length - 1
                        ? "danger"
                        : "foreground"
                  }
                  to={`/${ item === "Log Out" ? "login" : item}`}
                  size="lg"
                >
                  {item}
                </Link>
              </NavbarMenuItem>
            ))}
      </NavbarMenu>
    </Navbar>
  );
}
