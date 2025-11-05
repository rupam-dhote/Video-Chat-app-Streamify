import { axiosInstance } from "./axios.js";

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (err) {
    console.log("ERROR In GetAuthUSER:", err);
    return null;
  }
};

export const signupToServer = async (signupData) => {
  const res = await axiosInstance.post("/auth/signup", signupData);
  return res.data;
};

export const loginToServer = async (loginData) => {
  const res = await axiosInstance.post("/auth/login", loginData);
  return res.data;
};

export const logoutToServer = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

export const updateBio = async (bioData) => {
  const res = await axiosInstance.post("/auth/onboarding", bioData);
  return res.data;
};

export const getUserFriends = async () => {
  const res = await axiosInstance.get("/user/friends");
  return res.data;
};

export const getRecUsers = async () => {
  const res = await axiosInstance.get("/user");
  return res.data;
};

export const getOutGoingReq = async () => {
  const res = await axiosInstance.get("/user/outgoing-friend-requests");
  return res.data;
};

export const sendFriendReq = async (userId) => {
  try {
    const res = await axiosInstance.post(`/user/friend-request/${userId}`);
    return res.data;
  } catch (err) {
    console.log("ERROR SEND REQUEST : ", err);
    throw new Error(err.response?.data?.message || "Something went wrong");
  }
};

export const getFriendReq = async () => {
  const res = await axiosInstance.get("/user/friend-requests");
  return res.data;
};

export const acceptFriendReq = async (friendId) => {
  const res = await axiosInstance.put(
    `/user/friend-request/${friendId}/accept`
  );
  return res.data;
};

export const getStreamToken = async () => {
  const res = await axiosInstance.get("/chat/token");
  return res.data;
};
