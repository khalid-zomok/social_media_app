import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as zod from "zod";
import { AuthContext } from './../../Context/AuthContext';
const schema = zod.object({
  email: zod.email("invalid Name").nonempty("email is required"),
  password: zod
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "password should contain at least one special chars",
    )
    .nonempty("password required"),
});

export default function Login() {
  const navigate = useNavigate();
  const [apiError, setapiError] = useState(null);
  const [isLoading, setisLoading] = useState(false);
 const {userLogin, setuserLogin} = useContext(AuthContext)


  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState } = form;
  const handleLogin = (data) => {
    setisLoading(true);


    if (!navigator.onLine) {
    setapiError("No internet connection. Please check your network.");
    setisLoading(false);
    return; // Exit the function early
  }

    axios
      .post(`https://route-posts.routemisr.com/users/signin`, data)
      .then((res) => {
        console.log(res.data.message);
       if (res.data.message === "signed in successfully") {        
        localStorage.setItem("userToken", res.data.data.token); // Adjust based on API structure
        setuserLogin(res.data.data.token);
        navigate("/home");
      }
      })
      .catch((err) => {
      // 2. Catch actual request failures (like DNS or loss of signal)
      if (err.code === "ERR_NETWORK" || !err.response) {
        setapiError("Network error: Server is unreachable or you are offline.");
      } else {
        // Handle server-side validation errors
        setapiError(err.response?.data?.message || "An error occurred");
      }
    })
    .finally(() => {
      setisLoading(false);
    })};

  return (
    <>
      <div className="flex items-center justify-center min-h-screen w-full bg-[linear-gradient(180deg,#ec4899_0%,#09c_100%)]">
        <div className="text-center w-full rounded-2xl py-2">
          <h1 className="font-bold text-5xl">Login Now</h1>
          {apiError && (
            <p className="bg-black text-white m-4 p-2 w-[25%] mx-auto rounded-sm">
              {apiError}
            </p>
          )}
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="max-w-md mx-auto py-7"
          >
            <div className="relative z-0 w-full mb-5 group">
              <input
                {...register("email")}
                type="email"
                name="email"
                id="email"
                className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute start-1.25 top-1.25 text-sm text-body duration-300 
    transform -translate-y-6 scale-75 -z-10 origin-left peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
    peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
              >
                Enter Your Email
              </label>
              {formState.errors.email && formState.touchedFields.email && (
                <p className="bg-slate-100 text-red-500 m-2 p-1 rounded-sm font-bold ">
                  {formState.errors.email?.message}
                </p>
              )}
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                {...register("password")}
                type="password"
                name="password"
                id="password"
                className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute start-1.25 text-sm text-body duration-300 
    transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
    peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
              >
                Enter Your Password
              </label>
              {formState.errors.password &&
                formState.touchedFields.password && (
                  <p className="bg-slate-100 text-red-500 m-2 p-1 rounded-sm font-bold ">
                    {formState.errors.password?.message}
                  </p>
                )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="text-white disabled:bg-slate-900 disabled:text-slate-200 rounded-4xl w-full  bg-blue-300 box-border border border-transparent hover:bg-blue-600 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
            >
              {isLoading ? "Loading...." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
