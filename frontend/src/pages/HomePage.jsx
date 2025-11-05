import { useEffect, useState } from "react";
import useRefetch from "../hooks/useRefetch.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getOutGoingReq,
  getRecUsers,
  getUserFriends,
  sendFriendReq,
} from "../lib/api.js";
import toast from "react-hot-toast";
import { UserIcon } from "lucide-react";
import { Link } from "react-router";
import FriendCard from "../component/FriendCard.jsx";
import NoFriends from "../component/NoFriends.jsx";
import NoRecUser from "../component/NoRecUser.jsx";
import RecUserCard from "../component/RecUserCard.jsx";

const HomePage = () => {
  const refetchMe = useRefetch();
  const [outGoingIds, setOutGoingIds] = useState(new Set());

  const { isLoading: friendsLoading, data: friendsData = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });
  const { isLoading: userLoading, data: userData = [] } = useQuery({
    queryKey: ["recUsers"],
    queryFn: getRecUsers,
  });
  const { data: outGoingReq = [] } = useQuery({
    queryKey: ["outGoingReq"],
    queryFn: getOutGoingReq,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: sendFriendReq,
    onSuccess: () => {
      toast.success("Friend Request Send");
      refetchMe("authUser");
      refetchMe("outGoingReq");
      refetchMe("recUsers");
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: () => {
      refetchMe("authUser");
    },
  });

  useEffect(() => {
    const outGoingsId = new Set();

    if (outGoingReq && outGoingReq.length > 0) {
      outGoingReq.forEach((req) => {
        outGoingsId.add(req.recipient._id);
      });
      setOutGoingIds(outGoingsId);
      refetchMe("authUser");
    }
  }, [outGoingReq]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full ">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center  justify-between gap-4 ">
          <h2 className=" text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notification" className="btn btn-outline btn-sm">
            <UserIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>
        {friendsLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friendsData.length === 0 ? (
          <NoFriends />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friendsData.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section className="w-full ">
          <div className=" mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className=" text-2xl sm:text-3xl tracking-tight font-bold">
                  Meet new learners
                </h2>
                <p className=" opacity-70">
                  Discover perfect language exchange partners based on your
                  profile
                </p>
              </div>
            </div>
          </div>

          {userLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : userData.length === 0 ? (
            <NoRecUser />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch h-full w-full">
              {userData.map((user) => {
                const hasRequestSent = outGoingIds.has(user._id);

                return (
                  <RecUserCard
                    key={user._id}
                    user={user}
                    hasRequestSent={hasRequestSent}
                    mutate={mutate}
                    isPending={isPending}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
