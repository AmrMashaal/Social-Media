/* eslint-disable react/prop-types */
import { Divider, IconButton, Typography } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import { VerifiedOutlined, MoreHoriz, FormatQuote } from "@mui/icons-material";
import { Box, useMediaQuery, useTheme } from "@mui/system";
import { useState } from "react";
import WidgetWrapper from "../../components/WidgetWrapper";
import UserImage from "../../components/UserImage";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setDeletePost } from "../../../state";
import DeleteComponent from "../../components/post/DeleteComponent";
import UserDot from "../../components/post/UserDot";
import LikePost from "../../components/post/LikePost";
import WhoLiked from "../../components/post/WhoLiked";
import PostImg from "../../components/post/PostImg";
import PostEdited from "../../components/post/PostEdited";
import { Link } from "react-router-dom";
import PostSkeleton from "../skeleton/PostSkeleton";

const PostWidget = ({
  posts,
  setPostClickData,
  isPostClicked,
  setIsPostClicked,
  postLoading,
  // socket,
}) => {
  const [showLikes, setShowLikes] = useState(false);
  const [likeList, setLikeList] = useState([]);
  const [likesLoding, setLikesLoding] = useState(false);
  const [postWhoDeleted, setPostWhoDeleted] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [isDots, setIsDots] = useState(false);
  const [postInfo, setPostInfo] = useState({ postId: null, userId: null });
  const [isEdit, setIsEdit] = useState(false);

  const { palette } = useTheme();
  const medium = palette.neutral.medium;

  const token = useSelector((state) => state.token);
  const mode = useSelector((state) => state.mode);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  document.body.style.overflow =
    showLikes || isPostClicked || isDelete || isDots || isEdit
      ? "hidden"
      : "unset";

  // const convertTextLink = (text) => {
  //   const urlPattern = /(https?:\/\/[^\s]+)/g;
  //   return text.replace(urlPattern, (url) => {
  //     return `<a href="${url}" target="_blank" style="color: #2f9cd0; font-weight: 500; text-decoration: underline;">${url}</a>`;
  //   });
  // };

  const howIsText = (text, img) => {
    if (!img && text.length < 30) return "24px";
    else return "15px";
  };

  const isMore = (
    firstName,
    lastName,
    picturePath,
    userPicturePath,
    description,
    _id,
    userId,
    verified
  ) => {
    const handleText =
      description?.length > 180 ? description.slice(0, 180) : description;
    // ----------------------------------------------------
    const regexBold = /^\*.*\*$/;
    const testBold = regexBold?.test(description);
    // ----------------------------------------------------
    const regexUpper = /^@.*@$/;
    const testUpper = regexUpper?.test(description);
    // ----------------------------------------------------
    const regexAll = /^(@\*.*\*@|\*@.*@\*)$/;
    const testAll = regexAll.test(description);
    // ----------------------------------------------------
    const regexPalestine = /#(free_palestine|palestine|فلسطين)\b/i;
    const testPalestine = regexPalestine.test(description);
    // ----------------------------------------------------
    const regexComma = /^".*"$/;
    const testComma = regexComma.test(description);
    // ----------------------------------------------------
    const regexColor =
      /\((olive|red|blue|orange|coffee|green|palestine|زيتوني|احمر|ازرق|برتقالي|قهوة|اخضر|قهوه|فلسطين)\)$/i;
    const testColor = regexColor.test(description);
    // ----------------------------------------------------
    const regexArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    const testArabic = regexArabic.test(description);

    const regexTextFunction = () => {
      if (testBold || testUpper || testComma) {
        return handleText.slice(1, -1);
      } else if (testColor && description?.length < 180) {
        return description?.split(" ").slice(0, -1).join(" ");
      } else if (description?.length > 180 && testColor) {
        return handleText.split(" ").slice(0, -1).join(" ");
      } else {
        return handleText;
      }
    };

    const backgroundFunction = () => {
      if (testPalestine && !testColor && !testComma) {
        return `linear-gradient(${
          mode === "dark"
            ? "to right, #89003054, #007a3342, #00000000"
            : "to right, #8900301c, #007a332b, #00000000"
        })`;
      } else if (
        (testColor && description?.split(" ").includes("(olive)")) ||
        (testColor && description?.split(" ").includes("(زيتوني)"))
      ) {
        return "#a1bb58";
      } else if (
        (testColor && description?.split(" ").includes("(red)")) ||
        (testColor && description?.split(" ").includes("(احمر)"))
      ) {
        return "#bb5858";
      } else if (
        (testColor && description?.split(" ").includes("(blue)")) ||
        (testColor && description?.split(" ").includes("(ازرق)"))
      ) {
        return "#586bbb";
      } else if (
        (testColor && description?.split(" ").includes("(orange)")) ||
        (testColor && description?.split(" ").includes("(برتقالي)"))
      ) {
        return "#bb8558";
      } else if (
        (testColor && description?.split(" ").includes("(coffee)")) ||
        (testColor && description?.split(" ").includes("(قهوة)")) ||
        (testColor && description?.split(" ").includes("(قهوه)"))
      ) {
        return "#906649";
      } else if (
        (testColor && description?.split(" ").includes("(green)")) ||
        (testColor && description?.split(" ").includes("(اخضر)"))
      ) {
        return "#58bb6b";
      } else if (
        (testColor && description?.split(" ").includes("(palestine)")) ||
        (testColor && description?.split(" ").includes("(فلسطين)"))
      ) {
        return `linear-gradient(${
          mode === "dark"
            ? "to right, #89003054, #007a3342, #00000000"
            : "to right, #890000b8, #007a33f2, #000000f0"
        })`;
      }
    };

    const regexPadding = () => {
      if (testPalestine && !testColor) {
        return "8px";
      } else if (testComma) {
        return "10px";
      } else if (
        testColor &&
        description?.length <= 180 &&
        isNonMobileScreens
      ) {
        return "180px 50px";
      } else if (testColor && description?.length <= 180) {
        return "150px 50px";
      } else if (
        testColor &&
        description?.length > 180 &&
        !isNonMobileScreens
      ) {
        return "70px 15px";
      } else if (testColor && description?.length > 180 && isNonMobileScreens) {
        return "180px 20px";
      }
    };

    const regexBorderRadius = () => {
      if (testPalestine && !testColor) {
        return "16px 0 0 0";
      } else if (testColor) {
        return "0.75rem";
      }
    };

    return (
      <Typography
        mt={picturePath ? "10px" : "14px"}
        sx={{
          wordBreak: "break-word",
          fontWeight: testBold || testAll || testComma ? "bold" : undefined,
          textTransform: testUpper || testAll ? "uppercase" : undefined,
          background: backgroundFunction(),
          padding: regexPadding(),
          borderRadius: regexBorderRadius(),
          fontSize:
            (testColor && !picturePath) || (testComma && !picturePath)
              ? "24px"
              : howIsText(description, picturePath),
          textAlign:
            (testComma && !picturePath) || testColor ? "center" : undefined,
          color: testColor ? "white" : undefined,
          lineHeight: testColor ? "33px" : undefined,
          direction: testArabic && !testComma && !testColor ? "rtl" : "ltr",
        }}
        fontSize={howIsText(description, picturePath)}
      >
        {testComma && (
          <FormatQuote sx={{ transform: "rotate(180deg)", mr: "3px" }} />
        )}
        {regexTextFunction()}
        {testComma && description?.length <= 180 && (
          <FormatQuote sx={{ ml: "3px" }} />
        )}
        {description?.length > 180 && (
          <span
            style={{
              fontWeight: "600",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => {
              setIsPostClicked(true),
                setPostClickData({
                  firstName,
                  lastName,
                  picturePath,
                  userPicturePath,
                  description,
                  _id,
                  userId,
                  verified,
                });
            }}
          >
            ...more
          </span>
        )}
        {testComma && (
          <Divider
            sx={{ m: "10px auto 0", width: "300px", maxWidth: "100%" }}
          />
        )}
      </Typography>
    );
  };

  const whoLikes = async (likes) => {
    setLikesLoding(true);
    try {
      const usersWhoLiked = await Promise.all(
        Object.keys(likes).map(async (userId) => {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/users/${userId}`,
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
        `${import.meta.env.VITE_API_URL}/posts/${postId}/like`,
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

      if (!updatedPost.message) {
        dispatch(setPost({ post_id: postId, post: updatedPost }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${postWhoDeleted}/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(setDeletePost({ postId: postWhoDeleted }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditPost = async (e, editText, description) => {
    e.preventDefault();
    if (editText !== description && editText) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/posts/${postInfo.postId}/edit`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ description: editText }),
          }
        );

        const data = await response.json();
        dispatch(setPost({ post_id: postInfo.postId, post: data }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const timeAgo = (postDate) => {
    const timeNow = new Date(); // get the current time
    const postTime = new Date(postDate);
    const seconds = Math.floor((timeNow - postTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return "Just now";
    } else if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (days < 30) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (months < 12) {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (years >= 1) {
      return `${years} year${days > 1 ? "s" : ""} ago`;
    }
  };

  // eslint-disable-next-line react/prop-types
  return (
    <>
      {!postLoading ? (
        <>
          {posts?.map((ele, index) => {
            return (
              <WidgetWrapper mb="10px" key={index}>
                <FlexBetween>
                  <Link to={`/profile/${ele.userId}`}>
                    <FlexBetween gap="10px">
                      <Box sx={{ cursor: "pointer" }}>
                        <UserImage image={ele.userPicturePath} size="40px" />
                      </Box>
                      <Box>
                        <Box
                          sx={{ cursor: "pointer" }}
                          display="flex"
                          alignItems="center"
                          gap="4px"
                        >
                          <Typography fontSize="14px" className="opacityBox">
                            {ele?.firstName} {ele?.lastName}
                          </Typography>
                          {ele?.verified && (
                            <VerifiedOutlined sx={{ color: "#15a1ed" }} />
                          )}
                        </Box>
                        <Typography fontSize="11px" color={medium}>
                          {timeAgo(ele?.createdAt)}
                        </Typography>
                        {ele?.edited && (
                          <Typography fontSize="11px" color={medium}>
                            Edited
                          </Typography>
                        )}
                      </Box>
                    </FlexBetween>
                  </Link>
                  {ele.userId === user._id && (
                    <IconButton
                      onClick={() => {
                        setIsDots(true),
                          setPostInfo({ postId: ele._id, userId: ele.userId });
                      }}
                    >
                      <MoreHoriz />
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
                  <PostImg
                    setIsPostClicked={setIsPostClicked}
                    setPostClickData={setPostClickData}
                    ele={ele}
                  />
                )}

                <LikePost
                  ele={ele}
                  user={user}
                  setShowLikes={setShowLikes}
                  handleLike={handleLike}
                  whoLikes={whoLikes}
                  setIsPostClicked={setIsPostClicked}
                  setPostClickData={setPostClickData}
                />
              </WidgetWrapper>
            );
          })}
          {isDots && (
            <Box
              position="fixed"
              width="100%"
              height="100%"
              top="0"
              left="0"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex="111"
            >
              <Box
                position="absolute"
                width="100%"
                height="100%"
                onClick={() => {
                  setIsDots(false);
                }}
                bgcolor="#00000066"
              ></Box>
              <Box
                bgcolor={palette.neutral.light}
                p="10px 28px"
                width={isNonMobileScreens ? "500px" : "100%"}
                display="flex"
                alignItems="center"
                gap="14px"
                minHeight="100px"
                position="relative"
                sx={{
                  maxWidth: "100%",
                  zIndex: "1",
                  maxHeight: isNonMobileScreens ? "700px" : "312px",
                  overflow: "auto",
                  borderRadius: isNonMobileScreens ? "0.75rem" : "0",
                }}
              >
                <UserDot
                  setPostWhoDeleted={setPostWhoDeleted}
                  postInfo={postInfo}
                  setIsDelete={setIsDelete}
                  setIsDots={setIsDots}
                  setIsEdit={setIsEdit}
                />
              </Box>
            </Box>
          )}
          {isEdit && (
            <PostEdited
              setIsEdit={setIsEdit}
              image={
                posts.filter((post) => post._id === postInfo.postId)[0]
                  ?.picturePath
                  ? `${import.meta.env.VITE_API_URL}/assets/${
                      posts.filter((post) => post._id === postInfo.postId)[0]
                        ?.picturePath
                    }`
                  : null
              }
              description={
                posts.filter((post) => post._id === postInfo.postId)[0]
                  ?.description
              }
              handleEditPost={handleEditPost}
            />
          )}
          {showLikes && (
            <WhoLiked
              likesLoding={likesLoding}
              likeList={likeList}
              setShowLikes={setShowLikes}
              setLikeList={setLikeList}
            />
          )}
          {isDelete && (
            <DeleteComponent
              setIsDelete={setIsDelete}
              handleDeletePost={handleDeletePost}
              type="post"
            />
          )}
        </>
      ) : (
        <PostSkeleton />
      )}
    </>
  );
};

export default PostWidget;
