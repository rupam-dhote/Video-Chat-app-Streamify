import { useState } from "react";
import { LifeBuoy } from "lucide-react";
import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { loginToServer } from "../lib/api.js";
import useRefetch from "../hooks/useRefetch.js";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // next 3:50:43
  const refetchMe = useRefetch();

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginToServer,
    onSuccess: () => {
      toast.success("Login Successfull");
      setLoginData({
        email: "",
        password: "",
      });
      refetchMe("authUser");
    },
    onError: (err) => {
      toast.error("somthing went wrong,Please try again later");
      console.log(err?.response?.data);
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    mutate(loginData);
  };
  return (
    <div
      className="h-screen flex items-center justify-center p-4 md:p-8 sm:p-6"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Login form part left part */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* logo part */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <LifeBuoy className="size-9 text-primary" />
            <span className="text-3xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Streamify
            </span>
          </div>
          {/* error if any occures */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error?.response?.data?.message}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Welcome Back</h2>
                  <p className="text-sm opacity-70">
                    Sign in to your account to continue your language journey!
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {/* email */}
                  <div className="from-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      className="input input-bordered w-full"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="from-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your Password"
                      className="input input-bordered w-full"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <button className="btn btn-primary w-full" type="submit">
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="text-primary hover:underline"
                      >
                        Create one
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Login form part right */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* image div comes */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/signup-img.png"
                alt="Language Connection Illustration"
                className="w-full h-full"
              />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect With language partners world wide
              </h2>
              <p className=" opacity-70">
                Practice conversation, make friends, and improve your language
                skill together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
