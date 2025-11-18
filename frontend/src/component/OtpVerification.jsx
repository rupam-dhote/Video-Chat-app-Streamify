import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useLocation } from "react-router";
import { sendForgotCode } from "../lib/api";
import toast from "react-hot-toast";

const OtpVerification = ({
  setVerifyData,
  emailPending,
  handleVerifyEmail,
  verifyEmailData,
  length = 4,
}) => {
  const [otpField, setOtpField] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);
  const location = useLocation();
  const isForgotPasswordPage =
    location.pathname?.startsWith("/forgot-password");
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const {
    mutate: otpMutate,
    isPending: otpPending,
    error: otpError,
  } = useMutation({
    mutationFn: sendForgotCode,
    onSuccess: (res) => {
      toast.success(res.message);
      setOtpField(Array.from({ length }, () => ""));
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 0);
      setSeconds(60);
    },
    onError: (err) => {
      toast.error(`${err.response.data.message}. Please try again!`);
      console.error(err?.response?.data);
    },
  });

  const maskEmail = (email) => {
    const [user, domain] = email.split("@");

    if (user.length <= 3) {
      return `${user[0]}***@${domain}`;
    }

    const firstPart = user.slice(0, 2);
    const lastPart = user.slice(-2);
    return `${firstPart}*******${lastPart}@${domain}`;
  };

  //   handling input change feild
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) {
      return;
    }
    const newOtp = [...otpField];
    //     allow only one input
    newOtp[index] = value.substring(value.length - 1);
    setOtpField(newOtp);

    const combineOTP = newOtp.join("");
    if (combineOTP.length === length) {
      setVerifyData({
        ...verifyEmailData,
        otp: combineOTP,
      });
    }

    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otpField[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);

    if (index > 0 && !otpField[index - 1]) {
      inputRefs.current[otpField.indexOf("")].focus();
    }
  };

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [inputRefs]);

  const handleResendOtp = () => {
    const data = {
      email: verifyEmailData.email,
    };
    otpMutate(data);
  };
  return (
    <form onSubmit={handleVerifyEmail}>
      {otpError && (
        <div className="alert alert-error mb-4">
          <span>{otpError?.response?.data?.message}</span>
        </div>
      )}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Verify Your Email</h2>
          <p className="text-sm opacity-70">
            {`OTP has been sent to your Email: ${maskEmail(
              verifyEmailData?.email
            )}`}
          </p>
          <p className="text-sm opacity-70">
            Please enter the OTP below to verify your account.
          </p>
        </div>
        <div className="space-y-3">
          {/* OTP PART */}
          <div className="from-control w-full flex justify-evenly mb-4 mt-5">
            {otpField.map((value, index) => (
              <input
                key={index}
                ref={(input) => (inputRefs.current[index] = input)}
                type="text"
                className="input input-bordered input-ghost rounded-none w-[50px] h-[50px] text-center"
                value={value}
                onChange={(e) => handleChange(e, index)}
                onClick={() => handleClick(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                required
              />
            ))}
          </div>

          <button className="btn btn-primary w-full " type="submit">
            {emailPending ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Verifying...
              </>
            ) : (
              "Verify Otp"
            )}
          </button>

          <div className="text-center mt-4">
            {isForgotPasswordPage ? (
              <div className="flex justify-between px-5">
                <p className=" text-sm md:text-base">
                  Resend OTP in : {seconds === 0 ? "-" : seconds + "s"}
                </p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={(seconds != 0 ? true : false) || otpPending}
                  className="disabled:text-gray-700 disabled:hover:no-underline disabled:bg-transparent bg-transparent text-primary text-sm md:text-base hover:underline cursor-pointer border-none"
                >
                  Resend OTP
                </button>
              </div>
            ) : (
              <p className=" text-sm md:text-base">OTP expires in 5 minutes</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default OtpVerification;
