/* eslint-disable react/prop-types */
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import UserImage from "../../components/UserImage";
import OpenPhoto from "../../components/OpenPhoto";

const RightChat = ({
  messages,
  user,
  mode,
  decryptMessage,
  realTime,
  chatHistoryData,
  historyLoad,
}) => {
  const [showImage, setShowImage] = useState(false);
  const [imageName, setImageName] = useState("");

  document.body.style.overflow = showImage ? "hidden" : "unset";

  // ----------------------------------------------------------
  return (
    <Box position="relative">
      {messages?.map((msg) => {
        return (
          <Box
            key={msg._id}
            width="100%"
            display="flex"
            justifyContent={msg.senderId === user._id ? "end" : "start"}
            alignItems="center"
          >
            {msg.senderId !== user._id && (
              <>
                {!historyLoad &&
                  !Object.values(chatHistoryData).find(
                    (ele) => ele.userInfo?._id === msg.senderId
                  )?.userInfo?.picturePath && (
                    <Box
                      width="45px"
                      height="45px"
                      bgcolor="gray"
                      borderRadius="50%"
                    ></Box>
                  )}

                {Object.values(chatHistoryData).find(
                  (ele) => ele?.userInfo?._id === msg?.senderId
                )?.userInfo?.picturePath && (
                  <UserImage
                    size="45"
                    image={
                      Object.values(chatHistoryData).find(
                        (ele) => ele.userInfo?._id === msg.senderId
                      )?.userInfo?.picturePath
                    }
                  />
                )}
              </>
            )}

            <Typography
              padding="13px"
              m="15px 10px"
              borderRadius="5px"
              maxWidth="65%"
              position="relative"
              bgcolor={
                msg.senderId === user._id && mode === "light"
                  ? "#537a85"
                  : msg.senderId === user._id && mode === "dark"
                  ? "#857853"
                  : "white"
              }
              color={
                msg.senderId === user._id && mode === "light"
                  ? "white"
                  : msg.senderId === user._id && mode === "dark"
                  ? "white"
                  : "black"
              }
              sx={{
                wordBreak: "break-word",
                ":before": {
                  content: "''",
                  position: "absolute",
                  borderTop: `9px solid ${
                    msg.senderId === user._id && mode === "light"
                      ? "#537a85"
                      : msg.senderId === user._id && mode === "dark"
                      ? "#857853"
                      : "white"
                  } `,
                  borderRight: "7px solid transparent",
                  borderLeft: "7px solid transparent",
                  borderBottom: "7px solid transparent",
                  transform:
                    msg.senderId === user._id
                      ? "rotate(-47deg)"
                      : "rotate(40deg)",
                  bottom: msg.senderId === user._id ? "-8.1px" : "-9.1px",
                  left: msg.senderId === user._id ? undefined : "-6.4px",
                  right: msg.senderId === user._id ? "-7px" : undefined,
                },
              }}
            >
              {msg?.text.length && (
                <Typography>{decryptMessage(msg?.text)}</Typography>
              )}
              {msg.picturePath && decryptMessage(msg?.picturePath) && (
                <img
                  src={`${import.meta.env.VITE_API_URL}/assets/${decryptMessage(
                    msg?.picturePath
                  )}`}
                  style={{
                    maxWidth: "100%",
                    width: "350px",
                    borderRadius: "5px",
                    marginTop: "6px",
                    maxHeight: "400px",
                    objectFit: "cover",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  alt=""
                  onClick={() => {
                    setShowImage(true),
                      setImageName(decryptMessage(msg.picturePath));
                  }}
                />
              )}

              <Typography
                color={msg.senderId === user._id ? "#c4c4c4" : "#939393"}
                textAlign="right"
                fontSize="11px"
                sx={{ userSelect: "none" }}
              >
                {realTime(msg.createdAt)}
              </Typography>
            </Typography>

            {msg.senderId === user._id && (
              <UserImage size="45" image={user.picturePath} />
            )}
          </Box>
        );
      })}

      {showImage && (
        <OpenPhoto photo={imageName} setIsImagOpen={setShowImage} />
      )}
    </Box>
  );
};

export default RightChat;
