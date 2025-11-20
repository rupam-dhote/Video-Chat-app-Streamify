import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser.js";
import { useMutation } from "@tanstack/react-query";
import { logoutToServer, resetPasswordUser } from "../lib/api";
import toast from "react-hot-toast";
import useRefetch from "../hooks/useRefetch";
import {
  BellIcon,
  Edit,
  KeyRound,
  LifeBuoy,
  LogOutIcon,
  UsersIcon,
  X,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector.jsx";
import { useState } from "react";
import ChangePassword from "./ChangePassword.jsx";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const refetchMe = useRefetch();
  const [openModal, setOpenModal] = useState(false);

  const { mutate } = useMutation({
    mutationFn: logoutToServer,
    onSuccess: () => {
      toast.success("Logout Successfully");
      refetchMe("authUser");
    },
    onError: (err) => {
      console.log("ERROR WHILE LOGUOT : ", err);
    },
  });

  const {
    mutate: changeMutate,
    ispending: changePending,
    error: changeError,
  } = useMutation({
    mutationFn: resetPasswordUser,
    onSuccess: (res) => {
      toast.success(res.message);
      setOpenModal(false);
    },
    onError: (err) => {
      toast.error(`${err.response.data.message}. Please try again!`);
      console.log(err?.response?.data);
    },
  });

  const handleChangePassword = (playload) => {
    changeMutate(playload);
  };
  return (
    <>
      <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between ${
              isChatPage ? "justify-between" : "lg:justify-end"
            } w-full `}
          >
            {/* LOGO ONLY IF IN CHAT PAGE */}

            <div
              className={`pl-2 sm:pl-5 block ${
                isChatPage ? "block" : "lg:hidden"
              }`}
            >
              <Link to="/" className="flex items-center gap-2.5">
                <LifeBuoy className="size-7 sm:size-9 text-primary" />
                <span className="text-2xl sm:text-3xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider ">
                  Streamify
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={"/notification"}
                className={`btn btn-ghost btn-circle hidden sm:flex`}
              >
                <BellIcon className="size-6 text-base-content opacity-70" />
              </Link>
              <div className="hidden sm:flex ">
                <ThemeSelector />
              </div>

              {/* LOGOUT BUTTON */}
              <button
                className="btn btn-ghost btn-circle hidden sm:flex"
                onClick={mutate}
              >
                <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>

              {/* <div className="dropdown dropdown-end dropdown-hover group">
                <div
                  tabIndex={0}
                  role={"button"}
                  className="avatar flex justify-center"
                >
                  <div className="w-10 rounded-full p-1  bg-[conic-gradient(red,orange,yellow,green,cyan,lightblue,purple,red)] transition-all duration-300 group-hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.45),0_0_8px_2px_rgba(0,0,0,0.25)]">
                    <img
                      src={authUser?.profilePic}
                      alt="User Avatar"
                      className="rounded-full bg-base-100 peer"
                    />
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-45  "
                >
                  <li>
                    <label
                      htmlFor="change-password-modal"
                      onClick={() => setOpenModal(true)}
                      className="flex items-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <KeyRound className="size-4 opacity-70" />
                      Reset Password
                    </label>
                  </li>
                  <li>
                    <Link to={"/notification"} className={"flex sm:hidden"}>
                      <BellIcon className="size-4 opacity-70 " />
                      Notification
                    </Link>
                  </li>
                  <li>
                    <button onClick={mutate} className="flex sm:hidden">
                      <LogOutIcon className="size-4 opacity-70" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div> */}

              {/* smooth tailwind */}
              <div className="relative inline-block group">
                {/* Avatar */}
                <button className="avatar flex justify-center focus:outline-none">
                  <div
                    className="
        w-9 rounded-full p-[2px] sm:p-[3px] sm:w-[46px] flex justify-center items-center
        bg-[conic-gradient(red,orange,yellow,green,cyan,lightblue,purple,red)]
        transition-all duration-300
        group-hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.45),0_0_8px_2px_rgba(0,0,0,0.25)]
      "
                  >
                    <img
                      src={authUser?.profilePic}
                      className=" rounded-full bg-base-100"
                    />
                  </div>
                </button>

                {/* Smooth Dropdown */}
                <div className="absolute right-0 top-[85%] p-3 pointer-events-none group-hover:pointer-events-auto hover:pointer-events-auto">
                  <ul
                    className="
       w-48 bg-base-100 shadow-lg rounded-xl p-3 z-50
      opacity-0 scale-95 pointer-events-none
      group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
      hover:opacity-100 hover:scale-100 hover:pointer-events-auto

      transition-all duration-200 ease-out
      delay-100 group-hover:delay-0
    "
                  >
                    <li className="flex hover:bg-base-200 rounded-lg">
                      <label
                        htmlFor="change-password-modal"
                        onClick={() => setOpenModal(true)}
                        className="flex items-center gap-2 cursor-pointer px-2 py-2"
                      >
                        <KeyRound className="size-4 opacity-70" />
                        Reset Password
                      </label>
                    </li>
                    <li className="flex hover:bg-base-200 rounded-lg lg:hidden">
                      <Link
                        to={"/edit-profile"}
                        className="flex items-center gap-2 cursor-pointer px-2 py-2"
                      >
                        <Edit className="size-4 opacity-70" />
                        Edit Profile
                      </Link>
                    </li>

                    <li className="flex hover:bg-base-200 rounded-lg sm:hidden">
                      <Link
                        to={"/notification"}
                        className="flex items-center gap-2 px-2 py-2  "
                      >
                        <BellIcon className="size-4 opacity-70" />
                        Notification
                      </Link>
                    </li>
                    <li className="flex hover:bg-base-200 rounded-lg sm:hidden">
                      <Link
                        to={"/friends"}
                        className="flex items-center gap-2 px-2 py-2  "
                      >
                        <UsersIcon className="size-4  opacity-70" />
                        Friends
                      </Link>
                    </li>

                    <li className="flex hover:bg-base-200 rounded-lg sm:hidden">
                      <ThemeSelector size={4} />
                    </li>
                    <li className="flex hover:bg-base-200 rounded-lg sm:hidden">
                      <button
                        onClick={mutate}
                        className="flex items-center gap-2 w-full text-left px-2 py-2"
                      >
                        <LogOutIcon className="size-4 opacity-70" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* DaisyUI Modal */}
      {/* DaisyUI Modal */}
      <input
        type="checkbox"
        id="change-password-modal"
        className="modal-toggle"
        checked={openModal}
        readOnly
      />

      <div
        className={`modal ${
          openModal ? "modal-open" : ""
        } backdrop-blur-sm bg-black/40 `}
      >
        <div className="modal-box relative">
          <button
            className="btn btn-sm btn-ghost btn-circle absolute right-3 top-3"
            onClick={() => setOpenModal(false)}
          >
            <X />
          </button>

          <ChangePassword
            openModal={openModal}
            handleChangePassword={handleChangePassword}
            changePending={changePending}
            userMail={authUser?.email}
            changeError={changeError}
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
