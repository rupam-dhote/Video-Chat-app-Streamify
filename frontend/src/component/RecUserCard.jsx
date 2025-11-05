import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";
import { getLanFlag } from "./FriendCard.jsx";

const RecUserCard = ({ user, hasRequestSent, mutate, isPending }) => {
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <div className="card bg-base-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ">
      <div className="card-body p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="avatar size-16 rounded-full">
            <img src={user.profilePic} alt={user.fullName} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{user.fullName}</h3>
            {user.location && (
              <div className=" flex items-center opacity-70 mt-1 text-xs">
                <MapPinIcon className="size-3 mr-1" />
                {user.location}
              </div>
            )}
          </div>
        </div>

        {/* Language With Flag */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanFlag(user.nativeLanguage)}
            Native: {capitalize(user.nativeLanguage)}
          </span>
          <span className="badge badge-secondary text-xs">
            {getLanFlag(user.learningLanguage)}
            Learning: {capitalize(user.learningLanguage)}
          </span>
        </div>
        {user.bio && (
          <p className=" text-sm opacity-70 line-clamp-2">{user.bio}</p>
        )}
        {/* Action Button */}
        <button
          className={`btn w-full mt-2 ${
            hasRequestSent ? "btn-disabled" : "btn-primary"
          }`}
          onClick={() => mutate(user._id)}
          disabled={hasRequestSent || isPending}
        >
          {hasRequestSent ? (
            <>
              <CheckCircleIcon className="size-4 mr-2" />
              Request Sent
            </>
          ) : (
            <>
              <UserPlusIcon className=" size-4 mr-2" />
              Send Friend Request
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RecUserCard;
