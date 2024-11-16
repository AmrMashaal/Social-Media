/* eslint-disable react/prop-types */
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import UserImage from "../../components/UserImage";
import { Link } from "react-router-dom";
import { Image } from "@mui/icons-material";
import ChatHistorySkeleton from "../skeleton/ChatHistorySkeleton";

const LeftChat = ({
  openChats,
  setOpenChats,
  isNonMobileScreens,
  historyLoad,
  chatHistoryData,
  user,
  mode,
  isMobileMenuToggled,
  fromNav,
  sortedHistory,
  setMessages,
  setShowSroll,
}) => {
  return (
    <Box>
      <Box
        overflow="hidden"
        width={
          !isMobileMenuToggled && openChats
            ? isNonMobileScreens
              ? "550px"
              : "84%"
            : "0px"
        }
        height={!isMobileMenuToggled && openChats ? "100vh" : "0px"}
        position="fixed"
        top={fromNav ? "0" : "40px"}
        left="0"
        zIndex="2"
        whiteSpace="nowrap"
        boxShadow="8px 12px 11px 0 #0000000a"
        sx={{
          transition: ".4s",
          background: mode === "dark" ? "#766c4c" : "#537a85",
        }}
      >
        <Box p="20px" color="white">
          <Typography
            fontSize="27px"
            color="#d7d7d7"
            sx={{ userSelect: "none" }}
          >
            CHATS
          </Typography>
          <Box>
            {sortedHistory?.map((ele, index) => {
              return (
                <Link
                  key={index}
                  to={`/chat/${ele?.userInfo?._id}`}
                  onClick={() => {
                    setOpenChats(false), setMessages([]), setShowSroll(true);
                  }}
                >
                  <Box
                    display="flex"
                    gap="10px"
                    alignItems="center"
                    m="15px 0"
                    // borderBottom={
                    //   usersDataState.indexOf(ele) !==
                    //     usersDataState.length - 1 &&
                    //   "1px solid rgba(255, 255, 255, 0.12)"
                    // }
                    className="opacityBox"
                  >
                    <UserImage image={ele?.userInfo?.picturePath} size="60" />
                    <Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap="3px"
                        maxWidth="160px"
                      >
                        <Typography
                          fontSize="14px"
                          fontWeight="500"
                          textOverflow="ellipsis"
                          overflow="hidden"
                          whiteSpace="nowrap"
                        >
                          {ele?.userInfo?.firstName} {ele?.userInfo?.lastName}
                        </Typography>

                        {/* {ele.userInfo.verified && (
                            <VerifiedOutlined
                              sx={{
                                fontSize: "16px",
                                color: "#00D5FA",
                              }}
                            />
                          )} */}
                      </Box>

                      <Typography
                        color="#d7d7d7"
                        fontSize="12px"
                        fontWeight="400"
                        textOverflow="ellipsis"
                        overflow="hidden"
                        width="160px"
                        whiteSpace="nowrap"
                        display="flex"
                        gap="2px"
                        alignItems="center"
                      >
                        {chatHistoryData[ele?.userInfo?._id]?.senderId ===
                        user._id ? (
                          <Typography>You:</Typography>
                        ) : undefined}{" "}
                        {chatHistoryData[ele?.userInfo?._id]?.text ? (
                          chatHistoryData[ele?.userInfo?._id]?.text
                        ) : (
                          <Box display="flex" gap="4px">
                            <Typography fontWeight="300">Image</Typography>
                            <Image />
                          </Box>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Link>
              );
            })}

            {historyLoad && <ChatHistorySkeleton />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LeftChat;
