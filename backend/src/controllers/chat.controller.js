import { generatestreamToken } from "../lib/stream.js";

export const getStreamToken = async (req, res) => {
  try {
    const token = await generatestreamToken(req.user.id);
    res.status(200).json({ token });
  } catch (err) {
    console.log("Error in getStreamToken controller : ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
