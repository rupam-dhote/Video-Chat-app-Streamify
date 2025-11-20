import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, LifeBuoy, Pencil, UsersIcon } from "lucide-react";

const SideBar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentpath = location.pathname;
  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-[0.860rem] border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <LifeBuoy className="size-9 text-primary" />
          <span className="text-3xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Streamify
          </span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <Link
          to={"/"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentpath === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>
        <Link
          to={"/friends"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentpath === "/friends" ? "btn-active" : ""
          }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>Friends</span>
        </Link>
        <Link
          to={"/notification"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentpath === "/notification" ? "btn-active" : ""
          }`}
        >
          <BellIcon className="size-5 text-base-content opacity-70" />
          <span>Notification</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <Link to={"/edit-profile"}>
            <div className="avatar group cursor-pointer">
              <div className="w-10 rounded-full overflow-hidden relative">
                <img
                  src={authUser?.profilePic}
                  alt="User Avatar"
                  className="w-full h-full object-cover "
                />
                <div className=" absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Pencil className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </Link>

          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
