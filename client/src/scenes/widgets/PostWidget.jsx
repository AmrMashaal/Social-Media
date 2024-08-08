/* eslint-disable react/prop-types */
import { IconButton, Typography, Divider } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  PersonAddOutlined,
  ShareOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import { Box, useMediaQuery, useTheme } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import WidgetWrapper from "../../components/WidgetWrapper";
import UserImage from "../../components/UserImage";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setDeletePost } from "../../../state";

const PostWidget = ({
  posts,
  setPostClickData,
  isPostClicked,
  setIsPostClicked,
}) => {
  const [showLikes, setShowLikes] = useState(false);
  const [likeList, setLikeList] = useState([]);
  const [likesLoding, setLikesLoding] = useState(false);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const medium = palette.neutral.medium;
  document.body.style.overflow =
    showLikes || isPostClicked ? "hidden" : "unset";
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const howIsText = (text, img) => {
    if (!img && text.length < 20) return "24px";
    else return "15px";
  };

  const isMore = (
    firstName,
    lastName,
    picturePath,
    userPicturePath,
    description,
    _id
  ) => {
    if (description.length > 180) {
      return (
        <Typography
          mt={picturePath ? "10px" : "14px"}
          fontSize={howIsText(description, picturePath)}
        >
          {description.slice(0, 180)}
          <span
            style={{ fontWeight: "600", cursor: "pointer", userSelect: "none" }}
            onClick={() => {
              setIsPostClicked(true),
                setPostClickData({
                  firstName,
                  lastName,
                  picturePath,
                  userPicturePath,
                  description,
                  _id,
                });
            }}
          >
            ...more
          </span>
        </Typography>
      );
    } else {
      return (
        <Typography
          mt={picturePath ? "10px" : "14px"}
          fontSize={howIsText(description, picturePath)}
        >
          {description}
        </Typography>
      );
    }
  };

  const whoLikes = async (likes) => {
    setLikesLoding(true);
    try {
      const usersWhoLiked = await Promise.all(
        Object.keys(likes).map(async (userId) => {
          const response = await fetch(
            `http://localhost:3001/users/${userId}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const user = await response.json();
          return user;
        })
      );

      setLikeList(usersWhoLiked);
    } catch (error) {
      console.log(error);
    } finally {
      setLikesLoding(false);
    }
  };

  const handleLike = async (ele) => {
    const postId = ele._id;
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/like`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user._id }),
        }
      );

      const updatedPost = await response.json();

      dispatch(setPost({ post_id: postId, post: updatedPost }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async (ele) => {
    try {
      await fetch(`http://localhost:3001/posts/${ele._id}/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setDeletePost({ postId: ele._id }));
    } catch (error) {
      console.log(error);
    }
  };

  // eslint-disable-next-line react/prop-types
  return posts.length > 0 ? (
    // eslint-disable-next-line react/prop-types
    posts.map((ele, index) => {
      return (
        <WidgetWrapper my="10px" key={index}>
          <FlexBetween>
            <FlexBetween gap="10px">
              <Box
                onClick={() => navigate(`/users/${ele.userId}`)}
                sx={{ cursor: "pointer" }}
              >
                <UserImage image={ele.userPicturePath} size="40px" />
              </Box>
              <Box>
                <Typography
                  sx={{ cursor: "pointer" }}
                  fontSize="14x"
                  onClick={() => navigate(`/users/${ele.userId}`)}
                >
                  {ele.firstName} {ele.lastName}
                </Typography>
                <Typography>
                  <Typography fontSize="14x" color={medium}>
                    {ele.createdAt.split("T")[0]}
                  </Typography>
                </Typography>
              </Box>
            </FlexBetween>
            {user._id === ele.userId ? (
              <IconButton onClick={() => handleDeletePost(ele)}>
                <DeleteOutlined />
              </IconButton>
            ) : (
              <IconButton>
                <PersonAddOutlined />
              </IconButton>
            )}
          </FlexBetween>

          {isMore(
            ele.firstName,
            ele.lastName,
            ele.picturePath,
            ele.userPicturePath,
            ele.description,
            ele._id
          )}

          {ele.picturePath && (
            <img
              src={`http://localhost:3001/assets/${ele.picturePath}`}
              alt="Post Picture"
              style={{
                maxHeight: "600px",
                objectFit: "cover",
                margin: "10px 0 10px 0",
                borderRadius: "0.75rem",
                cursor: "pointer",
              }}
              width="100%"
              onClick={() => {
                setIsPostClicked(true),
                  setPostClickData({
                    firstName: ele.firstName,
                    lastName: ele.lastName,
                    picturePath: ele.picturePath,
                    userPicturePath: ele.userPicturePath,
                    description: ele.description,
                    _id: ele._id,
                  });
              }}
            />
          )}

          <FlexBetween>
            <FlexBetween gap="8px">
              <FlexBetween>
                <IconButton onClick={() => handleLike(ele)}>
                  {Object.keys(ele.likes).includes(user._id) ? (
                    <FavoriteOutlined />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </IconButton>
                <Typography
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowLikes(true);
                    whoLikes(ele.likes);
                  }}
                >
                  {Object.keys(ele.likes).length}
                </Typography>
              </FlexBetween>
              <FlexBetween>
                <IconButton>
                  <ChatBubbleOutlineOutlined />
                </IconButton>
                {ele.comments.length}
              </FlexBetween>
            </FlexBetween>
            <IconButton>
              <ShareOutlined />
            </IconButton>
          </FlexBetween>

          {showLikes && (
            <Box
              position="fixed"
              width="100%"
              height="100%"
              top="0"
              left="0"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                position="absolute"
                width="100%"
                height="100%"
                onClick={() => {
                  setShowLikes(false);
                  setLikeList([]);
                }}
                bgcolor="#00000012"
              ></Box>
              <Box
                bgcolor={palette.neutral.light}
                p="10px 28px"
                width={isNonMobileScreens ? "500px" : "90%"}
                display="flex"
                flexDirection="column"
                gap="14px"
                minHeight="300px"
                position="relative"
                sx={{
                  maxWidth: "100%",
                  zIndex: "1",
                  maxHeight: isNonMobileScreens ? "700px" : "312px",
                  overflow: "auto",
                }}
              >
                {likesLoding ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                    position="absolute"
                    top="50%"
                    left="50%"
                    sx={{ transform: "translate(-50%,-50%)" }}
                  >
                    <Typography fontSize="25px">Loding...</Typography>
                  </Box>
                ) : likeList.length < 1 ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                    position="absolute"
                    top="50%"
                    left="50%"
                    sx={{ transform: "translate(-50%,-50%)" }}
                  >
                    <Typography fontSize="25px">
                      There are no likes yet
                    </Typography>
                  </Box>
                ) : (
                  likeList?.map((user, index) => {
                    return (
                      <>
                        <FlexBetween
                          key={index}
                          sx={{ cursor: "pointer" }}
                          onClick={() => navigate(`/users/${user._id}`)}
                        >
                          <Box display="flex" alignItems="center" gap="10px">
                            <UserImage image={user.picturePath} />
                            <Typography>
                              {user.firstName || "Undefined"} {user.lastName}
                            </Typography>
                          </Box>
                        </FlexBetween>
                        <Divider />
                      </>
                    );
                  })
                )}
              </Box>
            </Box>
          )}
        </WidgetWrapper>
      );
    })
  ) : (
    <Typography>No posts available</Typography>
  );
};

export default PostWidget;
