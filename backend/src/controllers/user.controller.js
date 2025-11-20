import User from "../Models/User.js";
import FriendRequest from "../Models/FriendRequest.js";
import { upsertStreamUser } from "../lib/stream.js";

//function to show recomendation
export const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // exclude current user for recomendation
        { _id: { $nin: currentUser.friends } },
        { isOnboarded: true }, //exclude current user friends
      ],
    });

    res.status(200).json(recommendedUsers);
  } catch (err) {
    console.error("Error in recommended users : ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// function to get all friends
export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName nativeLanguage learningLanguage profilePic"
      );

    res.status(200).json(user.friends);
  } catch (err) {
    console.log("Error While Finding Friends : ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// send friend request function
export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // prevent sending request to the self
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to yourself" });
    }

    // check recipient exist or not
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if both already friends or not
    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friend with this user" });
    }

    // check if request already exist
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "A Friend Request Already exist between you and this user",
      });
    }

    // all checks pass means create request
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (err) {
    console.error("Error While Sending friend request : ", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// accept friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // verifying the current user is recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not auhtorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // Add each user to friends array
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request Accepted" });
  } catch (err) {
    console.log("Error in accepting friend request : ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// to get all friends requests
export const getFriendRequest = async (req, res) => {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    const acceptedReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "accepted",
    }).populate("recipient sender", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (err) {
    console.log("Error fetching request : ", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// outging request
export const getOutgoingFriendRequest = async (req, res) => {
  try {
    const outgoingReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    res.status(200).json(outgoingReqs);
  } catch (err) {
    console.log("Error finding outgoing requests : ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//changing password with user current password
export const changePasswordUser = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !newPassword || !currentPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are required!" });
    }
    if (newPassword.length < 6 || currentPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existUser = await User.findOne({ email });

    if (!existUser) {
      return res.status(401).json({
        success: false,
        message: "User Not found somthing wents wrong",
      });
    }
    const isCorrectPass = await existUser.matchPassword(currentPassword);
    if (!isCorrectPass) {
      return res.status(401).json({
        success: false,
        message: "Your Current password not matched",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(401).json({
        success: false,
        message: "New password cannot be the same as your current password.",
      });
    }
    existUser.password = newPassword;
    existUser.save();

    res
      .status(200)
      .json({ success: true, message: "Password Change successfully" });
  } catch (err) {
    console.log("Error while Changing password : ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// function to Edit profile
export const editProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All Fields Are Required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    //  stream user update
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `Stream User Updated after Profile Edit : ${updatedUser.fullName}`
      );
    } catch (err) {
      console.error("Error while updating the Stream user : ", err);
    }
    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    console.log("onBoarding Error : ", err);
    res.status(500).json({ message: "Internal server Error" });
  }
};
