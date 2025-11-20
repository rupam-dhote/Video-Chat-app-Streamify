import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser.js";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../component/ChatLoader.jsx";
import CallButton from "../component/CallButton.jsx";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: userID } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthUser();
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initchat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData?.token
        );
        const channelId = [authUser?._id, userID].sort().join("-");
        const currentChannel = client.channel("messaging", channelId, {
          members: [authUser?._id, userID],
        });

        await currentChannel.watch();

        setChatClient(client);
        setChannel(currentChannel);
      } catch (err) {
        console.log("ERROR WHILE CONNECTING TO STREAM USER : ", err);
        toast.error("Could not connect to chat. Please try again later");
      } finally {
        setLoading(false);
      }
    };

    initchat();

    return () => {
      // disconnect client on unmount to avoid leaks
      if (chatClient) {
        chatClient.disconnectUser().catch(() => {});
      }
    };
  }, [tokenData, authUser, userID]);

  useEffect(() => {
    // Handler will open all links in same tab (unless modifier key used)
    const handler = (e) => {
      // respect modifier keys and non-left clicks (allow user to open in new tab/window)
      if (e.defaultPrevented) return;
      if (e.button !== 0) return; // not left click
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = e.target.closest && e.target.closest("a");
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href) return;

      // If you want only call links open in same tab, replace check below with: if (!href.includes("/call/")) return;
      // For now we open ALL links in same tab (as you requested earlier)
      if (!href.includes("/call/")) return;

      e.preventDefault();

      // resolve relative hrefs
      const url = href.startsWith("http")
        ? href
        : `${window.location.origin}${href}`;

      // use assign to preserve history
      window.location.assign(url);
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. join with here : ${callUrl}`,
      });

      toast.success("Video call link sent successfully !");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  // to open call page  in same link tab

  return (
    <div className="h-[90.5vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full  relative ">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
