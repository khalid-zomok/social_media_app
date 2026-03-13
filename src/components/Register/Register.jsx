import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as zod from "zod";
const schema = zod
  .object({
    name: zod
      .string()
      .nonempty("Name is required")
      .min(3, "min length is 3 chars")
      .max(10, "max length is 10 chars"),
    username: zod
      .string()
      .regex(/^[a-z0-9_]{3,30}$/, "invalid UserName")
      .nonempty("userName is required"),
    email: zod.email("invalid Name").nonempty("email is required"),
    password: zod
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "password should contain at least one special chars",
      )
      .nonempty("password required"),
    rePassword: zod.string().nonempty("password is required"),
    gender: zod.enum(["male", "female"]),
    dateOfBirth: zod.coerce
      .date()
      .refine((dateValue) => {
        const userDate = dateValue.getFullYear();
        const currentDate = new Date();
        if (currentDate - userDate >= 20) {
          return true;
        } else {
          return false;
        }
      }, "Invalid Date")
      .transform((date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      }),
  })
  .refine(
    (object) => {
      if (object.password === object.rePassword) {
        return true;
      } else {
        return false;
      }
    },
    { error: "rePassword not matching!", path: ["rePassword"] },
  );

export default function Register() {
  const navigate = useNavigate();
  const [apiError, setapiError] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      gender: "",
      dateOfBirth: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState} = form;
  const handleRegister = (data) => {
    setisLoading(true);
    console.log(data);
    axios
      .post(`https://route-posts.routemisr.com/users/signup`, data)
      .then((res) => {
        console.log(res.data.message);
        if (res.data.message == "account created") {
          navigate("/login")
        }
      })
      .catch((err) => {
        console.log(err.response.data.errors);
        setapiError(err.response.data.errors);
      })
      .finally(()=>{
        setisLoading(false);
      });
  };

  return (
    <>
      <div className="text-center bg-[linear-gradient(180deg,#ec4899_0%,#09c_100%)] w-full py-2">
        <h1 className="font-bold text-5xl">Register Now</h1>
        {apiError && (
          <p className="bg-black text-white m-4 p-2 w-[25%] mx-auto rounded-sm">
            {apiError}
          </p>
        )}
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="max-w-md mx-auto py-7"
        >
          <div className="relative z-0 w-full mb-5 group">
            <input
              {...register("name")}
              type="text"
              name="name"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="name"
              className="absolute start-1.25 top-1.25 text-sm text-body duration-300 
    transform -translate-y-6 scale-75  -z-10 origin-left peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
    peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter Your Name
            </label>
            {formState.errors.name && formState.touchedFields.name && (
              <p className="bg-slate-100 text-red-500 m-2 p-1 rounded-sm font-bold ">
                {formState.errors.name?.message}
              </p>
            )}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              {...register("username")}
              type="text"
              name="username"
              id="username"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="username"
              className="absolute start-1.25 top-1.25 text-sm text-body duration-300 
    transform -translate-y-6 scale-75 -z-10 origin-left peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
    peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter Your Username
            </label>
            {formState.errors.username && formState.touchedFields.username && (
              <p className="bg-slate-100 text-red-500 m-2 p-1 rounded-sm font-bold ">
                {formState.errors.username?.message}
              </p>
            )}
          </div>
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
              {...register("dateOfBirth")}
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="dateOfBirth"
              className="absolute start-1.25 top-1.25 text-sm text-body duration-300 
    transform -translate-y-6 scale-75 -z-10 origin-left peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
    peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter Your Date of Birth
            </label>
            {formState.errors.dateOfBirth &&
              formState.touchedFields.dateOfBirth && (
                <p className="bg-slate-100 text-red-500 m-2 p-1 rounded-sm font-bold ">
                  {formState.errors.dateOfBirth?.message}
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
            {formState.errors.password && formState.touchedFields.password && (
              <p className="bg-slate-100 text-red-500 m-2 p-1 rounded-sm font-bold ">
                {formState.errors.password?.message}
              </p>
            )}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              {...register("rePassword")}
              type="password"
              name="rePassword"
              id="rePassword"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="rePassword"
              className="absolute start-1.25 top-1.25 text-sm text-body duration-300 
    transform -translate-y-6 scale-75 -z-10 origin-left peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
    peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              rePassword
            </label>
            {formState.errors.rePassword &&
              formState.touchedFields.rePassword && (
                <p className="bg-slate-100 text-red-500 m-2 p-1 rounded-sm font-bold ">
                  {formState.errors.rePassword?.message}
                </p>
              )}
          </div>
          <div className="flex gap-3">
            <div className="flex items-center mb-4">
              <input
                {...register("gender")}
                id="male"
                type="radio"
                name="gender"
                defaultValue="male"
                className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
                defaultChecked
              />
              <label
                htmlFor="gender"
                className="select-none ms-2 text-sm font-medium text-heading"
              >
                male
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                {...register("gender")}
                id="female"
                type="radio"
                name="gender"
                defaultValue="female"
                className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
                defaultChecked
              />
              <label
                htmlFor="gender"
                className="select-none ms-2 text-sm font-medium text-heading"
              >
                female
              </label>
            </div>
            {formState.errors.gender && formState.touchedFields.gender && (
              <p className="bg-slate-100 text-red-500 m-2 p-1 rounded-sm font-bold ">
                {formState.errors.gender?.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="text-white disabled:bg-slate-900 disabled:text-slate-200 rounded-4xl w-full  bg-blue-300 box-border border border-transparent hover:bg-blue-600 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
          >
            {isLoading ? "Loading...." : "Register"}
          </button>
        </form>
      </div>
    </>
  );
}
