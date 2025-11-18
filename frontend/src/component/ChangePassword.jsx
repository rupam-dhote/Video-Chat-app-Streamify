import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation } from "react-router";

const ChangePassword = ({
  handleChangePassword,
  userMail,
  changePending,
  changeError = null,
  openModal,
}) => {
  const location = useLocation();
  const isForgotPasswordPage =
    location.pathname?.startsWith("/forgot-password");

  const [checkData, setCheckData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const currentPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);

  const checkPasswordMatch = async (e) => {
    e.preventDefault();
    if (
      (!isForgotPasswordPage && checkData.currentPassword === "") ||
      checkData.newPassword === "" ||
      checkData.confirmPassword === ""
    ) {
      return toast.error("Please fill all fields");
    }

    if (checkData.newPassword === "" || checkData.confirmPassword === "") {
      return toast.error("Please fill all fields");
    }

    if (checkData.newPassword !== checkData.confirmPassword) {
      return toast.error("Password not matched");
    }

    const payload = isForgotPasswordPage
      ? { newPassword: checkData.newPassword, email: userMail }
      : {
          email: userMail,
          currentPassword: checkData.currentPassword,
          newPassword: checkData.newPassword,
        };

    handleChangePassword(payload);
  };

  useEffect(() => {
    // FOR FORGOT PASSWORD PAGE → focus new password field
    if (isForgotPasswordPage) {
      setTimeout(() => {
        newPasswordRef.current?.focus();
      }, 50); // small delay for DaisyUI animation
      setCheckData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      // NORMAL MODE → focus current password
      setTimeout(() => {
        currentPasswordRef.current?.focus();
      }, 50);
      setCheckData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [openModal, isForgotPasswordPage]);

  return (
    <form onSubmit={checkPasswordMatch}>
      <div className="space-y-4">
        <div>
          {isForgotPasswordPage ? (
            <h2 className="text-xl font-semibold mb-2">Change Your Password</h2>
          ) : (
            <h2 className="text-2xl font-bold mb-2 text-center">
              Change Your Password
            </h2>
          )}
          {isForgotPasswordPage ? (
            <p className="text-sm opacity-70">
              Create a strong new password to keep your account safe. Make sure
              it's something you can remember but hard for others to guess.
            </p>
          ) : (
            <p className="text-sm opacity-70">
              Enter your current password and your new password below to update
              your account securely. Make sure your new password is strong and
              easy for you to remember.
            </p>
          )}
        </div>
        {changeError && (
          <div className="alert alert-error mb-4">
            <span>{changeError?.response?.data?.message}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {/* pasword current*/}
          {!isForgotPasswordPage && (
            <div className="from-control w-full space-y-1">
              <label className="label">
                <span className="label-text">Current Password</span>
              </label>
              <input
                ref={currentPasswordRef}
                type="password"
                placeholder="Enter your curren password"
                className="input input-bordered w-full"
                value={checkData.currentPassword}
                onChange={(e) => {
                  setCheckData({
                    ...checkData,
                    currentPassword: e.target.value,
                  });
                }}
                required
              />
            </div>
          )}
          {/* password new */}
          <div className="from-control w-full space-y-1">
            <label className="label">
              <span className="label-text">New Password</span>
            </label>
            <input
              ref={newPasswordRef}
              type="password"
              placeholder="Enter your new password"
              className="input input-bordered w-full"
              value={checkData.newPassword}
              onChange={(e) => {
                setCheckData({
                  ...checkData,
                  newPassword: e.target.value,
                });
              }}
              required
            />
          </div>
          {/* password confrim */}
          <div className="from-control w-full space-y-1">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="confirm your new password"
              className="input input-bordered w-full"
              value={checkData.confirmPassword}
              onChange={(e) => {
                setCheckData({
                  ...checkData,
                  confirmPassword: e.target.value,
                });
              }}
              required
            />
          </div>
          <p className="text-xs opacity-70 mt-1">
            Password must be at least 6 characters long
          </p>
          {isForgotPasswordPage && (
            <div className="mb-4">
              <p className="text-sm md:text-lg">
                Remember your password?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          )}

          <button className="btn btn-primary w-full" type="submit">
            {changePending ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Changing...
              </>
            ) : (
              "Change Password"
            )}
          </button>

          {isForgotPasswordPage && (
            <div className="text-center mt-2">
              <p className="text-sm md:text-lg">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default ChangePassword;
