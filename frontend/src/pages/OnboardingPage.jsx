import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import { useMutation } from "@tanstack/react-query";
import { editBio, updateBio } from "../lib/api.js";
import toast from "react-hot-toast";
import {
  CameraIcon,
  GlobeIcon,
  Loader,
  MapPinIcon,
  ShuffleIcon,
  Upload,
} from "lucide-react";
import { LANGUAGES } from "../constants/index.js";
import useRefetch from "../hooks/useRefetch.js";
import { useNavigate } from "react-router";

const OnboardingPage = ({ edit = false }) => {
  const { authUser } = useAuthUser();
  const refetchMe = useRefetch();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    profilePic: authUser?.profilePic || "",
    location: authUser?.location || "",
    learningLanguage: authUser?.learningLanguage || "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: edit ? editBio : updateBio,
    onSuccess: (res) => {
      toast.success(res.message);
      edit ? navigate("/") : refetchMe("authUser");
    },
    onError: (err) => {
      toast.error(`${err.response.data.message}. Please try again!`);
      console.log(err?.response?.data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formState);
  };

  const handleRandomAvatar = () => {
    const index = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `/avatars/AV${index}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random Profile Pic generated!", { duration: 800 });
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl lg:max-w-4xl shadow-xl">
        <div className="card-body p-6 sm:p-7">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            {edit ? "Edit your profile" : "Complete your profile"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* profile pic container */}
            <div className="flex flex-col space-y-4 items-center justify-center">
              {/* IMAGE PREVIEW */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* GENERATE AVATAR BUTTON */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            {/* full name */}
            <div className="from-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                className="input input-bordered w-full"
                placeholder="Your full name"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    fullName: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* bio */}
            <div className="from-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                autoFocus
                name="bio"
                className="input input-bordered rounded-2xl w-full h-24 "
                placeholder="Tell others about yourself and your language learning goals"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    bio: e.target.value,
                  })
                }
              />
            </div>
            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    });
                  }}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Your Native Language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              {/*LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    });
                  }}
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className=" absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  name="location"
                  type="text"
                  value={formState.location}
                  onChange={(e) => {
                    setFormState({ ...formState, location: e.target.value });
                  }}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Submit BUTTON */}
            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  {edit ? (
                    <Upload className="size-5 mr-2" />
                  ) : (
                    <GlobeIcon className="size-5 mr-2" />
                  )}
                  {edit ? "Update profile" : "Complete Onboarding"}
                </>
              ) : (
                <>
                  <Loader className=" animate-spin size-5 mr-2" />
                  {edit ? "Updating..." : "Onboarding..."}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
