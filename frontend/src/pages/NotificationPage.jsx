import { useMutation, useQuery } from "@tanstack/react-query";
import useRefetch from "../hooks/useRefetch.js";
import { acceptFriendReq, getFriendReq } from "../lib/api.js";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
} from "lucide-react";
import NoNotification from "../component/NoNotification.jsx";
import toast from "react-hot-toast";
const NotificationPage = () => {
  const refetchMe = useRefetch();

  const { data, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendReq,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: acceptFriendReq,

    onSuccess: () => {
      console.log("i am running on success");
      toast.success("Friend request accepted");
      refetchMe("friendRequests");
      refetchMe("friends");
    },

    onError: (err) => {
      toast.error("Unable to accept friend request please try again later");
      console.error("ERROR IN FRIEND REQUEST ACCEPT : ", err);
    },
  });

  const incomingReq = data?.incomingReqs || [];
  const acceptedReq = data?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loadin-lg" />
            </div>
          ) : (
            <>
              {incomingReq.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold flex gap-2 items-center">
                    <UserCheckIcon className="size-5 text-primary" />
                    Friend Requests
                    <span className="badge badge-primary ml-2">
                      {incomingReq.length}
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {incomingReq.map((req) => {
                      return (
                        <div
                          key={req._id}
                          className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="card-body p-4 ">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="avatar size-14 rounded-full bg-base-300">
                                  <img
                                    src={req?.sender?.profilePic}
                                    alt={req?.sender?.fullName}
                                  />
                                </div>
                                <div>
                                  <h3 className="font-semibold">
                                    {req?.sender?.fullName}
                                  </h3>
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    <span className=" badge badge-secondary badge-sm">
                                      Native: {req?.sender?.nativeLanguage}
                                    </span>
                                    <span className=" badge badge-outline badge-sm">
                                      Learning: {req?.sender?.learningLanguage}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => mutate(req?._id)}
                                className="btn btn-primary btn-sm"
                                disabled={isPending}
                              >
                                Accept
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {acceptedReq.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold flex gap-2 items-center">
                    <BellIcon className="size-5 text-success" />
                    New Connections
                  </h2>

                  <div className="space-y-3">
                    {acceptedReq.map((req) => {
                      return (
                        <div
                          key={req._id}
                          className="card bg-base-200 shadow-sm "
                        >
                          <div className="card-body p-4 ">
                            <div className="flex items-start gap-3">
                              <div className="avatar size-10 mt-1 rounded-full">
                                <img
                                  src={req?.recipient?.profilePic}
                                  alt={req?.recipient?.fullName}
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold">
                                  {req?.recipient?.fullName}
                                </h3>
                                <p className="text-sm my-1">
                                  {req?.recipient?.fullName} accepted your
                                  friend request
                                </p>
                                <p className="text-xs flex items-center opacity-70">
                                  <ClockIcon className="size-3 mr-1" />
                                  Recently
                                </p>
                              </div>
                              <div className="badge badge-success">
                                <MessageSquareIcon className="size-3 mr-1" />
                                New Friend
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
              {incomingReq.length === 0 && acceptedReq.length === 0 && (
                <NoNotification />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
