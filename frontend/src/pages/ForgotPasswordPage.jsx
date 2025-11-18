import { LifeBuoy } from "lucide-react";
import OtpVerification from "../component/OtpVerification";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changePassword, sendForgotCode, verifyForgotCode } from "../lib/api";
import toast from "react-hot-toast";
import ChangePassword from "../component/ChangePassword.jsx";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [forgotData, setForgotData] = useState({
    email: "",
  });

  const [verifyEmailData, setVerifyData] = useState({
    email: "",
    otp: "",
  });

  const [formStep, setFormStep] = useState({ first: false, second: false });

  const {
    mutate: sendCodeMutate,
    isPending: codePending,
    error: codeError,
  } = useMutation({
    mutationFn: sendForgotCode,
    onSuccess: (res) => {
      toast.success(res.message);
      setVerifyData({
        ...verifyEmailData,
        email: forgotData.email,
      });
      setFormStep({
        ...formStep,
        first: true,
      });
    },
    onError: (err) => {
      toast.error(`${err.response.data.message}. Please try again!`);
      console.error(err?.response?.data);
    },
  });

  const {
    mutate: verifyEmailMutate,
    isPending: emailPending,
    error: emailError,
  } = useMutation({
    mutationFn: verifyForgotCode,
    onSuccess: (res) => {
      toast.success(res.message);
      setFormStep({
        first: false,
        second: true,
      });
    },
    onError: (err) => {
      toast.error(`${err.response.data.message}. Please try again!`);
      console.error(err?.response?.data);
    },
  });

  const {
    mutate: changePasswordMutate,
    isPending: changePending,
    error: changeError,
  } = useMutation({
    mutationFn: changePassword,
    onSuccess: (res) => {
      toast.success(res.message);
      setFormStep({
        first: false,
        second: false,
      });
      setForgotData({
        email: "",
      });
      setVerifyData({
        email: "",
        otp: "",
      });
      navigate("/login");
    },

    onError: (err) => {
      toast.error(`${err.response.data.message}. Please try again!`);
      console.error(err?.response?.data);
    },
  });

  const handleSendCode = (e) => {
    e.preventDefault();
    sendCodeMutate(forgotData);
  };

  const handleVerifyEmail = (e) => {
    e.preventDefault();
    verifyEmailMutate(verifyEmailData);
  };
  const handleChangePassword = (playload) => {
    changePasswordMutate(playload);
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
          {formStep.first
            ? emailError && (
                <div className="alert alert-error mb-4">
                  <span>{emailError?.response?.data?.message}</span>
                </div>
              )
            : formStep.second
            ? changeError && (
                <div className="alert alert-error mb-4">
                  <span>{changeError?.response?.data?.message}</span>
                </div>
              )
            : codeError && (
                <div className="alert alert-error mb-4">
                  <span>{codeError?.response?.data?.message}</span>
                </div>
              )}

          <div className="w-full">
            {formStep.first ? (
              <OtpVerification
                handleVerifyEmail={handleVerifyEmail}
                emailPending={emailPending}
                setVerifyData={setVerifyData}
                verifyEmailData={verifyEmailData}
              />
            ) : formStep.second ? (
              <ChangePassword
                handleChangePassword={handleChangePassword}
                userMail={verifyEmailData.email}
                changePending={changePending}
              />
            ) : (
              <form onSubmit={handleSendCode}>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Forgot Password?
                    </h2>
                    <p className="text-sm opacity-70">
                      Enter your registered email address below, and we’ll send
                      you a code to reset your password.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* email */}
                    <div className="from-control w-full space-y-2">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        autoFocus
                        type="email"
                        placeholder="example@gmail.com"
                        className="input input-bordered w-full"
                        value={forgotData.email}
                        onChange={(e) =>
                          setForgotData({
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <p className="text-sm md:text-lg">
                        Remember your password?{" "}
                        <Link
                          to="/login"
                          className="text-primary hover:underline"
                        >
                          Sign in
                        </Link>
                      </p>
                    </div>

                    <button className="btn btn-primary w-full" type="submit">
                      {codePending ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          sending...
                        </>
                      ) : (
                        "Send code"
                      )}
                    </button>

                    <div className="text-center mt-2">
                      <p className="text-sm md:text-lg">
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
            )}
          </div>
        </div>

        {/* Forgot Password form part right */}
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

export default ForgotPasswordPage;
