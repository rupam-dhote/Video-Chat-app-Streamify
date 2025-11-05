import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser.js";
import { useMutation } from "@tanstack/react-query";
import { logoutToServer } from "../lib/api";
import toast from "react-hot-toast";
import useRefetch from "../hooks/useRefetch";
import { BellIcon, LifeBuoy, LogOutIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector.jsx";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const refetchMe = useRefetch();

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
  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center ${
            isChatPage ? "justify-between" : "justify-end"
          } w-full`}
        >
          {/* LOGO ONLY IF IN CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <LifeBuoy className="size-9 text-primary" />
                <span className="text-3xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Streamify
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to={"/notification"} className={`btn btn-ghost btn-circle`}>
              <BellIcon className="size-6 text-base-content opacity-70" />
            </Link>

            <ThemeSelector />

            <div className="avatar">
              <div className="w-9 rounded-full">
                <img
                  src={authUser?.profilePic}
                  alt="User Avatar"
                  rel="noreferrer"
                />
              </div>
            </div>

            {/* LOGOUT BUTTON */}
            <button className="btn btn-ghost btn-circle" onClick={mutate}>
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
