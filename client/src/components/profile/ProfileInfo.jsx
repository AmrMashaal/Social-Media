/* eslint-disable react/prop-types */
import { Box, useMediaQuery } from "@mui/system";
import {
  LocationOnOutlined,
  VerifiedOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Button, Divider, Skeleton, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserImage from "../UserImage";
import ProfileSettings from "./ProfileSettings";
import OpenPhoto from "../OpenPhoto";
import DeleteComponent from "../post/DeleteComponent";
import { setFriends, setFriendsRequest } from "../../../state";
import ChangePassword from "./ChangePassword";

const ProfileInfo = ({ userInfo, userId }) => {
  const [profileSettings, setProfileSettings] = useState(false);
  const [openBio, setOpenBio] = useState(false);
  const [isImgOpen, setIsImagOpen] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [waitingFriendRequest, setWaitingFriendRequest] = useState([]);
  const [friendSettings, setFriendSettings] = useState("");
  const [img, setImg] = useState("");

  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const mode = useSelector((state) => state.mode);

  const isNonMobileScreens = useMediaQuery("(min-width: 1060px)");

  const theme = useTheme();
  const medium = theme.palette.neutral.medium;
  const alt = theme.palette.background.alt;

  const dispatch = useDispatch();

  document.body.style.overflow = isImgOpen ? "hidden" : "unset";

  useEffect(() => {
    setWaitingFriendRequest(userInfo?.friendsRequest);
  }, [userInfo]);

  const bioFunction = (bio) => {
    if (bio.length <= 180) {
      return (
        <Typography
          color={mode === "light" ? "#5c5c5c" : "#c1c1c1"}
          maxWidth="550px"
          px="20px"
        >
          {bio}
        </Typography>
      );
    } else if (bio.length > 180) {
      return (
        <Typography
          color={mode === "light" ? "#5c5c5c" : "#c1c1c1"}
          maxWidth="550px"
          px="20px"
        >
          {openBio ? bio : bio.slice(0, 180)}
          {!openBio && (
            <span
              style={{
                fontWeight: "600",
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => setOpenBio(true)}
            >
              ...more
            </span>
          )}
        </Typography>
      );
    }
  };

  const addremoveFriend = async () => {
    const frineds = user?.friends || [];
    const friendsRequest = user?.friendsRequest || [];

    if (frineds?.some((friend) => friend?._id === userId)) {
      setFriendSettings("my friend");
    } else if (
      !frineds?.some((friend) => friend?._id === userId) &&
      !friendsRequest?.includes(userInfo?._id)
    ) {
      setFriendSettings("add");
    } else if (friendsRequest?.includes(userInfo._id)) {
      setFriendSettings("accept friend");
    } else {
      setFriendSettings("");
    }
  };

  const handleRemoveFriend = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user?._id}/${userId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      dispatch(setFriends({ friends: data }));

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptRequest = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user._id}/${
          userInfo._id
        }/accept`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const friends = await response.json();
      dispatch(setFriends({ friends: friends }));
      dispatch(
        setFriendsRequest({
          friendsRequestState: user.friendsRequest.filter(
            (request) => request !== userInfo._id
          ),
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const addFriend = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user._id}/${userInfo._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWaitingFriendRequest([...waitingFriendRequest, user._id]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTriangle = () => {
    friendSettings === "my friend" && setIsDelete(true),
      friendSettings === "accept friend" && acceptRequest();
    friendSettings === "add" && addFriend();
  };

  document.addEventListener("click", (event) => {
    const buttonId = document.getElementById("addRemoveFriendId");
    if (event.target !== buttonId) {
      setFriendSettings("");
    }
  });

  return (
    <Box position="relative" sx={{ maxHeight: "395px" }}>
      {userInfo?.background ? (
        <img
          onClick={() => {
            setIsImagOpen(true),
              setImg(
                userInfo?._id === user._id
                  ? user.background
                  : userInfo?.background
              );
          }}
          width="100%"
          src={`${import.meta.env.VITE_API_URL}/assets/${
            userInfo?._id === user._id ? user.background : userInfo?.background
          }`}
          style={{
            height: "300px",
            maxWidth: "100%",
            objectFit: "cover",
            cursor: "pointer",
          }}
        />
      ) : (
        <Box
          height="300px"
          sx={{
            background: userInfo?.background ? undefined : "beige",
          }}
        ></Box>
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        className={isNonMobileScreens ? "profileContainer" : ""}
      >
        <Box
          position="relative"
          bottom="111px"
          display={isNonMobileScreens ? "flex" : undefined}
          gap="10px"
          left={isNonMobileScreens ? "22px" : "50%"}
          width={isNonMobileScreens ? undefined : "fit-content"}
          height="0px"
          sx={{
            transform: isNonMobileScreens ? undefined : "translateX(-50%)",
          }}
        >
          {userInfo ? (
            <Box
              width="fit-content"
              margin="auto"
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setIsImagOpen(true),
                  setImg(
                    userInfo?._id === user._id
                      ? user.picturePath
                      : userInfo?.picturePath
                  );
              }}
            >
              <UserImage
                image={
                  userInfo?._id === user._id
                    ? user.picturePath
                    : userInfo?.picturePath
                }
                size="200px"
                isProfile={true}
                isOnline={userInfo?.online}
              />
            </Box>
          ) : (
            <Box
              width="200px"
              height="200px"
              bgcolor="gray"
              borderRadius="50%"
              sx={{
                border: `6px solid ${alt}`,
                boxShadow: "rgba(0, 0, 0, 0.13) 3px 6px 7px 0px",
                margin: isNonMobileScreens ? undefined : "auto",
              }}
            ></Box>
          )}

          <Box
            position="relative"
            top={isNonMobileScreens ? "108px" : "0"}
            height="fit-content"
            textAlign={isNonMobileScreens ? undefined : "center"}
          >
            {userInfo ? (
              <>
                <Box
                  position="relative"
                  width="fit-content"
                  margin={isNonMobileScreens ? undefined : "7px auto 0"}
                >
                  <Typography
                    fontSize={isNonMobileScreens ? "35px" : "28px"}
                    fontWeight="500"
                    maxWidth={isNonMobileScreens ? undefined : "250px"}
                    className={userInfo?.verified && "loopAnimation"}
                    lineHeight={isNonMobileScreens ? "50px" : "30px"}
                  >
                    {userInfo?._id === user._id
                      ? user.firstName
                      : userInfo?.firstName}{" "}
                    {userInfo?._id === user._id
                      ? user.lastName
                      : userInfo?.lastName}
                  </Typography>
                  {userInfo.verified && (
                    <VerifiedOutlined
                      sx={{
                        fontSize: "32px",
                        color: "#00D5FA",
                        position: "absolute",
                        right: isNonMobileScreens ? "-40px" : "-39px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </Box>

                <Typography
                  color={mode === "light" ? "#5c5c5c" : "#c1c1c1"}
                  fontSize="17px"
                  m="5px 0 -6px"
                >
                  <span style={{ userSelect: "none" }}>@</span>
                  {userInfo?._id === user._id
                    ? user.username
                    : userInfo?.username}
                </Typography>

                <Box
                  display="flex"
                  gap={isNonMobileScreens ? "20px" : "4px"}
                  mt="9px"
                  flexDirection={isNonMobileScreens ? "row" : "column"}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap="6px"
                    color={medium}
                    justifyContent={isNonMobileScreens ? undefined : "center"}
                  >
                    <WorkOutlineOutlined />
                    <Typography fontSize="17px">
                      {userInfo?._id === user._id
                        ? user.occupation
                        : userInfo?.occupation}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    gap="4px"
                    fontWeight="500"
                    mt="4px"
                    color={medium}
                    justifyContent={isNonMobileScreens ? undefined : "center"}
                  >
                    <LocationOnOutlined sx={{ ml: "4px", margin: "0" }} />
                    <Typography textTransform="capitalize" fontSize="17px">
                      {userInfo?._id === user._id
                        ? user.location
                        : userInfo?.location}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ m: "10px 0" }} />

                {userInfo?.bio && bioFunction(userInfo?.bio)}

                {user._id === userId ? (
                  <Button
                    sx={{
                      height: "100%",
                      whiteSpace: "nowrap",
                      marginTop: userInfo?.bio.length ? "12px" : "0",
                      padding: "5px 23px",
                      border: "2px solid",
                      fontWeight: "500",
                      textTransform: "capitalize",
                      fontSize: "14px",
                      borderRadius: "20px",
                      color: mode === "light" ? "#5c5c5c" : "#c1c1c1",
                    }}
                    onClick={() => setProfileSettings(true)}
                  >
                    Settings
                  </Button>
                ) : (
                  <Box
                    position="relative"
                    width="fit-content"
                    m={isNonMobileScreens ? undefined : "auto"}
                  >
                    <Button
                      id="addRemoveFriendId"
                      sx={{
                        height: "100%",
                        whiteSpace: "nowrap",
                        mx: "10px",
                        marginTop: userInfo?.bio.length ? "12px" : "0",
                        padding: "5px 23px",
                        border: "2px solid",
                        fontWeight: "600",
                        textTransform: "capitalize",
                        fontSize: "14px",
                        borderRadius: "20px",
                        color: user.friends.some(
                          (friend) => friend._id === userId
                        )
                          ? undefined
                          : mode === "light"
                          ? "#5c5c5c"
                          : "#c1c1c1",
                      }}
                      onClick={addremoveFriend}
                    >
                      {user.friends.some((friend) => friend._id === userId)
                        ? "My Friend"
                        : user.friendsRequest.includes(userInfo._id)
                        ? "Accept Friend"
                        : waitingFriendRequest?.includes(user._id)
                        ? "Friend Request Sent"
                        : "Add"}
                    </Button>

                    {userInfo?._id !== user._id && (
                      <Link to={`/chat/${userInfo._id}`}>
                        <Button
                          sx={{
                            height: "100%",
                            mx: "10px",
                            whiteSpace: "nowrap",
                            marginTop: userInfo?.bio.length ? "12px" : "0",
                            padding: "5px 23px",
                            border: "2px solid",
                            fontWeight: "600",
                            textTransform: "capitalize",
                            fontSize: "14px",
                            borderRadius: "20px",
                            color: mode === "light" ? "black" : "white",
                            width: "113px",
                          }}
                        >
                          Chat
                        </Button>
                      </Link>
                    )}

                    {friendSettings &&
                      !waitingFriendRequest?.includes(user._id) && (
                        <Button
                          sx={{
                            zIndex: "1",
                            borderRadius: "0.75rem",
                            fontSize: "14px",
                            left: "29px",
                            bottom: isNonMobileScreens ? "-53px" : undefined,
                            top: isNonMobileScreens ? undefined : "-60px",
                            p: "10px 20px",
                            position: "absolute",
                            bgcolor: "#44444480",
                            color: "white",
                            cursor: "pointer",
                            userSelect: "none",
                            ":hover": {
                              bgcolor: "#57575780",
                              ":after": {
                                borderBottom: isNonMobileScreens
                                  ? "10px solid #57575780"
                                  : undefined,
                                borderTop: isNonMobileScreens
                                  ? undefined
                                  : "10px solid #57575780",
                              },
                            },
                            ":before": {
                              content: "''",
                              borderTop: `10px solid ${
                                friendSettings === "my friend" ? "red" : "green"
                              }`,
                              borderLeft: "5px solid transparent",
                              borderRight: "5px solid transparent",
                              borderBottom: "none",
                              mr: "3px",
                            },
                            ":after": {
                              content: "''",
                              borderBottom: isNonMobileScreens
                                ? "10px solid #44444480"
                                : "none",
                              borderLeft: "5px solid transparent",
                              borderRight: "5px solid transparent",
                              borderTop: isNonMobileScreens
                                ? "none"
                                : "10px solid #44444480",
                              position: "absolute",
                              top: isNonMobileScreens ? "-9.8px" : "44px",
                              left: "14px",
                              transition: ".3s",
                            },
                          }}
                          onClick={handleTriangle}
                        >
                          {friendSettings === "my friend"
                            ? "Remove"
                            : friendSettings === "add"
                            ? "Add"
                            : "Accept Friend"}
                        </Button>
                      )}
                  </Box>
                )}
              </>
            ) : (
              <>
                <Skeleton width="230px" sx={{ mt: "10px", py: "6px" }} />
                <Skeleton
                  width="200px"
                  sx={{ margin: isNonMobileScreens ? undefined : "auto" }}
                />
                <Skeleton
                  width="150px"
                  sx={{ margin: isNonMobileScreens ? undefined : "auto" }}
                />
              </>
            )}
          </Box>
        </Box>
      </Box>

      {profileSettings && (
        <ProfileSettings
          setProfileSettings={setProfileSettings}
          setChangePassword={setChangePassword}
        />
      )}

      {changePassword && (
        <ChangePassword
          changePassword={changePassword}
          setChangePassword={setChangePassword}
        />
      )}

      {isImgOpen && <OpenPhoto photo={img} setIsImagOpen={setIsImagOpen} />}

      {isDelete && (
        <DeleteComponent
          setIsDelete={setIsDelete}
          type="removeFriend"
          handleRemoveFriend={handleRemoveFriend}
        />
      )}
    </Box>
  );
};

export default ProfileInfo;
