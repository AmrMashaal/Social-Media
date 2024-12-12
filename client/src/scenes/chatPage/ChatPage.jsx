/* eslint-disable react/prop-types */
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, debounce, IconButton, useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import CryptoJS from "crypto-js";
import ChatNavbar from "./ChatNavbar";
import RightChat from "./RightChat";
import LeftChat from "./LeftChat";
import {
  ArrowDownward,
  DeleteOutlined,
  Image,
  Send,
} from "@mui/icons-material";
import ChatSkeleton from "../skeleton/ChatSkeleton";
import Dropzone from "react-dropzone";
import WrongPassword from "../../components/WrongPassword";

// eslint-disable-next-line react/prop-types
const ChatPage = ({ socket, fromNav }) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [count, setCount] = useState(1);
  const [openChats, setOpenChats] = useState(fromNav === true ? true : false);
  const [imageError, setImageError] = useState(false);
  const [chatLoad, setChatLoad] = useState(true);
  const [historyLoad, setHistoryLoad] = useState(true);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [showSroll, setShowSroll] = useState(true);
  const [messages, setMessages] = useState([]);
  const [chatHistoryData, setChatHistoryData] = useState({});

  document.body.style.overflow =
    openChats || isMobileMenuToggled ? "hidden" : "unset";

  const { userId } = useParams();

  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const mode = useSelector((state) => state.mode);

  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const sortedHistory = useMemo(() => {
    const chatHistory = Object.values(chatHistoryData);

    return chatHistory.slice().sort((a, b) => b.time - a.time);
  }, [chatHistoryData]);

  const startNotificationSound = () => {
    const audioId = document.getElementById("messageNotificationSound");

    audioId.play();
  };

  const getMessages = async (reset = false) => {
    setChatLoad(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/messages/${
          user._id
        }/${userId}?page=${pageNumber}&limit=50`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const messages = await response.json();

      const reversedMessages = messages.reverse();

      if (reset) {
        setMessages(reversedMessages);
      } else {
        setMessages((prevMessages) => [...reversedMessages, ...prevMessages]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setChatLoad(false);
    }
  };

  const decryptMessage = (message) => {
    const decryptedMessage = CryptoJS.AES.decrypt(
      message,
      import.meta.env.VITE_MESSAGE_SECRET
    );

    return decryptedMessage.toString(CryptoJS.enc.Utf8);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message.trim().length === 0 && image.length === 0) return;

    const formData = new FormData();

    formData.append("text", message);

    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/messages/${user._id}/${userId}`,
        {
          method: "POST",

          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const messagesResponse = await response.json();

      socket.emit("sendMessage", {
        receivedId: userId,
        message: messagesResponse,
      });

      setMessages((prevMessages) => [...prevMessages, messagesResponse]);
      setCount((prev) => prev + 1);

      console.log(decryptMessage(messagesResponse.picturePath));
    } catch (error) {
      console.log(error);
    } finally {
      setImage("");
      setMessage("");
    }
  };

  const realTime = (time) => {
    const data = new Date(time);

    const dataString = data.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return dataString;
  };

  const handleChatHistory = async () => {
    setHistoryLoad(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user._id}/chatHistory`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const chatHistory = await response.json();

      setChatHistoryData(chatHistory);
    } catch (error) {
      console.log(error);
    } finally {
      setHistoryLoad(false);
    }
  };

  const modifyChatHistory = async (receivedId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${
          user._id
        }/${receivedId}/chatHistory`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: message,
            senderId: user._id,
            time: Date.now(),
          }),
        }
      );

      const chatHistory = await response.json();

      setChatHistoryData(chatHistory);
    } catch (error) {
      console.log(error);
    }
  };

  const getMoreMessages = () => {
    setPageNumber((prevNum) => prevNum + 1);
  };

  useEffect(() => {
    setCount(count + 1);

    const handleScroll = debounce(() => {
      if (window.scrollY <= 3) {
        getMoreMessages();
      }
    }, 500);

    const handleShowScrollButton = () => {
      if (
        window.scrollY + window.innerHeight >= document.body.offsetHeight ===
        false
      ) {
        setShowSroll(true);
      } else {
        setShowSroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleShowScrollButton);
    return () => {
      handleScroll.clear();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleShowScrollButton);
    };
  }, []);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (data?.senderId === userId) {
        setMessages((prevMessages) => [...prevMessages, data]);

        setCount((prev) => prev + 1);
      } else if (data?.senderId !== userId) {
        startNotificationSound();
      }

      setChatHistoryData((prevHistory) => {
        return {
          ...prevHistory,
          [data.senderId]: {
            ...prevHistory[data.senderId],
            senderId: data.senderId,
            text: decryptMessage(data.text),
          },
        };
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [count]);

  useEffect(() => {
    setCount(count + 1);
    setPageNumber(1);
    handleChatHistory();
  }, [userId]);

  useEffect(() => {
    if (userId && chatHistoryData[userId]?.userInfo?.firstName) {
      document.title = `Chat - ${chatHistoryData[userId]?.userInfo?.firstName} ${chatHistoryData[userId]?.userInfo?.lastName}`;
    }
  }, [chatHistoryData]);

  useEffect(() => {
    if (pageNumber === 1) {
      getMessages(true);
    } else {
      getMessages();
    }
  }, [userId, pageNumber]);

  const checkCorrectPassword = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${
          user._id
        }/checkCorrectPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ passwordChangedAt: user.passwordChangedAt }),
        }
      );

      const result = await response.json();

      if (result.message === "Password is not correct") {
        setWrongPassword(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkCorrectPassword();
  }, []);

  const handleFormSubmit = async (e) => {
    handleSubmit(e);
    modifyChatHistory(userId);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/notifications/${user._id}/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "message",
          description: `${user.firstName} sent you a message`,
          linkId: user._id,
          receiverId: userId,
          senderId: user._id,
        }),
      }
    );

    const notification = await response.json();

    socket.emit("notifications", {
      receiverId: userId,
      notification: notification,
    });
  };

  return (
    <Box
      width={isNonMobileScreens ? "60%" : "90%"}
      margin="auto"
      id="chatBox"
      mb="75px"
      mt="40px"
    >
      <Box
        position="fixed"
        width="800px"
        height="800px"
        borderRadius="50%"
        boxShadow="0 0 20px 20px rgb(27 102 176 / 19%)"
        top="-200px"
        left="-172px"
        zIndex="100"
        sx={{
          opacity: mode === "light" ? "0.1" : "0.07",
          background:
            "radial-gradient(circle, rgb(30 144 255), rgb(17 17 17 / 0%))",
          pointerEvents: "none",
        }}
      ></Box>

      <Box
        position="fixed"
        width="800px"
        height="800px"
        borderRadius="50%"
        boxShadow="0 0 20px 20px rgb(255 31 198 / 13%)"
        bottom="-200px"
        right="-172px"
        zIndex="100"
        sx={{
          opacity: mode === "light" ? "0.1" : "0.1",
          background:
            "radial-gradient(circle, rgb(255 31 223 / 63%), rgb(17 17 17 / 0%))",
          pointerEvents: "none",
        }}
      ></Box>

      {mode === "dark" && (
        <Box
          position="fixed"
          width="100%"
          height="100%"
          zIndex="-2"
          bgcolor="#a09265"
          top="0"
          left="0"
        ></Box>
      )}

      <audio
        id="messageNotificationSound"
        src="\assets\sound_effect_4 (mp3cut.net).mp3"
        preload="auto"
      ></audio>

      <ChatNavbar
        setOpenChats={setOpenChats}
        isMobileMenuToggled={isMobileMenuToggled}
        setIsMobileMenuToggled={setIsMobileMenuToggled}
        chatHistoryData={chatHistoryData}
        userParam={userId}
      />

      <Box position="relative">
        <LeftChat
          openChats={openChats}
          setOpenChats={setOpenChats}
          isNonMobileScreens={isNonMobileScreens}
          historyLoad={historyLoad}
          chatHistoryData={chatHistoryData}
          user={user}
          mode={mode}
          isMobileMenuToggled={isMobileMenuToggled}
          fromNav={fromNav}
          sortedHistory={sortedHistory}
          setMessages={setMessages}
          setShowSroll={setShowSroll}
        />

        {chatLoad && userId && pageNumber === 1 && <ChatSkeleton />}

        <RightChat
          messages={messages}
          user={user}
          mode={mode}
          decryptMessage={decryptMessage}
          realTime={realTime}
          chatHistoryData={chatHistoryData}
          historyLoad={historyLoad}
        />

        {!isMobileMenuToggled && !fromNav && openChats && (
          <Box
            position="fixed"
            width="100%"
            height="100%"
            top="40px"
            left="0"
            zIndex="1"
            onClick={() => setOpenChats(false)}
          ></Box>
        )}

        {!fromNav && (
          <form
            style={{
              width: "100%",
              position: "fixed",
              bottom: "-1px",
              height: "75px",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              backgroundColor: mode === "dark" ? "#a09265" : "#F6F6F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 8px 0",
            }}
            onSubmit={handleFormSubmit}
          >
            <Box sx={{ cursor: "pointer" }}>
              <Dropzone
                accept=".jpg,.jpeg,.png,.webp"
                multiple={false}
                onDrop={(acceptedFiles) => {
                  const file = acceptedFiles[0];
                  const fileExtension = file.name
                    .split(".")
                    .pop()
                    .toLowerCase();
                  if (["jpg", "jpeg", "png", "webp"].includes(fileExtension)) {
                    setImage(file);
                    setImageError(null);
                  } else if (
                    !["jpg", "jpeg", "png", "webp"].includes(fileExtension)
                  ) {
                    setImageError("This file is not supported");
                  }
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <Box {...getRootProps()} position="relative">
                    <input {...getInputProps()} />

                    <IconButton style={{ marginRight: "5px" }}>
                      <Image
                        className={imageError && "wrongImage"}
                        sx={{ color: "rgba(0, 0, 0, 0.54)" }}
                      />
                    </IconButton>

                    {image && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageError(null);
                          setImage(null);
                        }}
                        sx={{
                          position: "absolute",
                          top: "-15px",
                          right: "-7px",
                        }}
                      >
                        <DeleteOutlined
                          sx={{
                            fontSize: "23px",
                            color: "white",
                            background: "#dc3c3c75",
                            borderRadius: "50%",
                            padding: "2px",
                          }}
                        />
                      </IconButton>
                    )}
                  </Box>
                )}
              </Dropzone>
            </Box>

            <input
              type="text"
              style={{
                width: isNonMobileScreens ? "60%" : "90%",
                padding: "10px",
                outline: "none",
                border: "none",
                fontFamily: "Rubik,sans-serif",
                zIndex: "1",
              }}
              placeholder="write a message..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />

            <IconButton type="submit">
              <Send style={{ color: "rgba(0, 0, 0, 0.54)" }} />
            </IconButton>
          </form>
        )}

        <Box
          position="fixed"
          bottom="100px"
          bgcolor={mode === "dark" ? "#857853" : "white"}
          right={isNonMobileScreens ? "180px" : "15px"}
          p="5px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="50%"
          sx={{
            cursor: "pointer",
            opacity: showSroll ? ".6" : "0",
            visibility: showSroll ? "unset" : "hidden",
            transition: ".3s",
            ":hover": {
              opacity: "1",
            },
          }}
          onClick={() =>
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            })
          }
        >
          {userId && <ArrowDownward />}
        </Box>
      </Box>
      {wrongPassword && <WrongPassword />}
    </Box>
  );
};

export default ChatPage;
