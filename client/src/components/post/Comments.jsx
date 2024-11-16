/* eslint-disable react/prop-types */
import { Divider, IconButton, InputBase, Typography } from "@mui/material";
import { Box, useMediaQuery } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UserImage from "../UserImage";
import {
  VerifiedOutlined,
  MoreHoriz,
  EditOutlined,
  DeleteOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ImageOutlined,
  Send,
} from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import DOMPurify from "dompurify";
import CommentEdit from "./CommentEdit";
import DeleteComponent from "./DeleteComponent";
import TasksComponent from "../TasksComponent";
import FlexBetween from "../FlexBetween";
import OpenPhoto from "../OpenPhoto";
import Dropzone from "react-dropzone";
import { debounce } from "lodash";

const Comments = ({ _id, userId }) => {
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const mode = useSelector((state) => state.mode);

  const [commentInfo, setCommentInfo] = useState("");
  const [commentText, setCommentText] = useState("");
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState("");
  const [openPhotoImage, setOpenPhotoImage] = useState("");
  const [likeList, setLikeList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [commentsState, setCommentsState] = useState([]);
  const [CommentUserId, setCommentUserId] = useState(null);
  const [commentId, setCommentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentEditOpen, setCommentEditOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [isDeleteComment, setIsDeleteComment] = useState(false);
  const [likesLoading, setLikesLoading] = useState(true);
  const [showLikes, setShowLikes] = useState(false);
  const [isOpenPhoto, setIsOpenPhoto] = useState(false);

  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { palette } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (commentInfo.trim().length !== 0 || image.length !== 0) {
      const formData = new FormData();

      formData.append("text", commentInfo);
      formData.append("verified", user.verified);
      formData.append("firstName", user.firstName);
      formData.append("lastName", user.lastName);
      formData.append("userPicture", user.picturePath);

      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/comments/${user._id}/${_id}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        const data = await response.json();

        setCommentsState((prev) => [data, ...prev]);
        setIsImage(false);
        setCommentInfo("");
        setImage("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleComments = async (first = true) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/comments/${_id}?page=${pageNumber}&limit=5`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const comments = await response.json();

      if (first) {
        setCommentsState(comments);
      } else {
        setCommentsState((prev) => [...prev, ...comments]);
      }

      // dispatch(setPost({ post_id: post._id, post: post }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const whoLikes = async (comLiks) => {
    setLikesLoading(true);

    try {
      const usersWhoLiked = await Promise.all(
        comLiks?.map(async (userId) => {
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
      setLikesLoading(false);
    }
  };

  useEffect(() => {
    if (pageNumber === 1) {
      handleComments();
    } else {
      handleComments(false);
    }
  }, [pageNumber]);

  const convertTextLink = (text) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text?.replace(urlPattern, (url) => {
      return `<a href="${url}" target="_blank" style="color: #2f9cd0; font-weight: 500; text-decoration: underline;">${url}</a>`;
    });
  };

  const handleDeleteComment = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const comment = await response.json();

      setCommentsState(
        commentsState.filter((newCom) => newCom._id !== comment._id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/comments/${commentId}/${
          user._id
        }/like`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const comment = await response.json();

      setCommentsState(
        commentsState.map((newCom) =>
          newCom._id === comment._id ? comment : newCom
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const regexArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  const testArabic = (description) => {
    return regexArabic.test(description);
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

  const getMoreComments = () => {
    setPageNumber((prev) => prev + 1);
  };

  useEffect(() => {
    const commentsParent = document.getElementById("commentsParent");

    const scrollFunction = debounce(() => {
      if (
        commentsParent.scrollTop + commentsParent.clientHeight + 80 >=
        commentsParent.scrollHeight
      ) {
        getMoreComments();
      }
    }, 300);

    commentsParent.addEventListener("scroll", scrollFunction);

    return () => {
      commentsParent.removeEventListener("scroll", scrollFunction);
    };
  }, []);

  return (
    <Box position="relative">
      <form
        action=""
        onSubmit={(e) => handleSubmit(e)}
        style={{ position: "relative" }}
      >
        <InputBase
          type="text"
          fullWidth
          placeholder={
            !loading
              ? commentsState?.length > 0
                ? "What is on your mind?"
                : "Write the first comment"
              : "Loading..."
          }
          value={commentInfo}
          onChange={(e) => setCommentInfo(e.target.value)}
          sx={{
            border: "1px solid #7a7a7a",
            borderRadius: "50px",
            p: "7px 36px 7px 18px",
          }}
        />

        <IconButton
          sx={{
            position: "absolute",
            right: "0",
            top: "50%",
            transform: "translateY(-50%)",
          }}
          type="submit"
        >
          <Send />
        </IconButton>
      </form>

      {isImage && (
        <Box
          border={`2px solid ${palette.neutral.medium}`}
          padding="1rem"
          mt="15px"
          sx={{
            gridColumn: "span 4",
            borderRadius: "4px",
            userSelect: "none",
          }}
        >
          <Dropzone
            accept=".jpg,.jpeg,.png,.webp"
            multiple={false}
            onDrop={(acceptedFiles) => {
              const file = acceptedFiles[0];
              const fileExtension = file.name.split(".").pop().toLowerCase();
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
              <Box
                {...getRootProps()}
                border={`2px dashed ${palette.primary.main}`}
                padding="1rem"
                sx={{ cursor: "pointer" }}
              >
                <input {...getInputProps()} />
                {!image ? (
                  <FlexBetween>
                    <p>Add Picture Here</p>
                    <IconButton>
                      <EditOutlined />
                    </IconButton>
                  </FlexBetween>
                ) : (
                  <FlexBetween>
                    <Typography>
                      {image.name.length > 20
                        ? `${image.name.slice(0, 20) + "..."}`
                        : image.name}
                    </Typography>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageError(null);
                        setImage(null);
                      }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </FlexBetween>
                )}
              </Box>
            )}
          </Dropzone>
        </Box>
      )}

      {imageError && isImage && (
        <Box color="red" mt="8px">
          {imageError}
        </Box>
      )}

      <FlexBetween
        gap="5px"
        width="fit-content"
        p="3px"
        mt="4px"
        sx={{
          cursor: "pointer",
          userSelect: "none",
          borderRadius: "5px",
          transition: ".3s",
          ":hover": {
            bgcolor: "#54545433",
          },
        }}
        onClick={() => {
          setIsImage(!isImage);
          setImageError(false);
        }}
      >
        <ImageOutlined />
        <Typography>Image</Typography>
      </FlexBetween>

      {loading && (
        <Box width="100%" textAlign="center" marginTop="40px">
          <img
            src={"../../../assets/kOnzy.gif"}
            alt=""
            width="87"
            style={{
              userSelect: "none",
              filter: "sepia(1) hue-rotate(127deg)",
            }}
          />
        </Box>
      )}

      {commentsState?.map((com) => {
        return (
          <Box key={com?._id}>
            <Box key={com?._id} display="flex" gap="6px" my="34px">
              <Link
                to={`/profile/${com?.userId}`}
                style={{ height: "fit-content" }}
              >
                <Box sx={{ cursor: "pointer" }}>
                  <UserImage image={com?.userPicture} size="45px" />
                </Box>
              </Link>
              <Box width="100%" mb="16px">
                <Box position="relative">
                  <Box
                    bgcolor={mode === "light" ? "#e7e7e7" : "#404040"}
                    p="10px"
                    borderRadius="0 .75rem .75rem .75rem 0"
                    borderLeft="2px solid gray"
                  >
                    <Box display="flex" justifyContent="space-between">
                      <Box>
                        <Link
                          to={`/profile/${com?.userId}`}
                          className="opacityBox"
                        >
                          <Box display="flex" alignItems="center" gap="5px">
                            <Typography
                              fontWeight="600"
                              sx={{ cursor: "pointer" }}
                              width="fit-content"
                            >
                              {com?.firstName} {com?.lastName}
                            </Typography>
                            {com?.verified && (
                              <VerifiedOutlined
                                sx={{ fontSize: "20px", color: "#00D5FA" }}
                              />
                            )}
                          </Box>
                        </Link>
                        <Typography
                          fontSize="11px"
                          mt="-1px"
                          mb="5px"
                          fontWeight="300"
                          color={mode === "light" ? "#6a6a6a" : "#b8b8b8"}
                          display="flex"
                          alignItems="center"
                          gap="2px"
                          sx={{ userSelect: "none" }}
                        >
                          <Box>{timeAgo(com?.createdAt)}</Box>

                          {com?.edited && (
                            <Typography
                              fontSize="11px"
                              fontWeight="300"
                              color={mode === "light" ? "#6a6a6a" : "#b8b8b8"}
                            >
                              | Edited
                            </Typography>
                          )}
                        </Typography>
                      </Box>

                      {(user._id === userId && (
                        <IconButton
                          onClick={() => {
                            setCommentId(com?._id),
                              setCommentText(com?.text),
                              setCommentEditOpen(true);
                            setCommentUserId(com?.userId);
                          }}
                        >
                          <MoreHoriz />
                        </IconButton>
                      )) ||
                        (user._id === com?.userId && (
                          <IconButton
                            onClick={() => {
                              setCommentId(com?._id),
                                setCommentText(com?.text),
                                setCommentEditOpen(true);
                              setCommentUserId(com?.userId);
                            }}
                          >
                            <MoreHoriz />
                          </IconButton>
                        ))}
                    </Box>

                    <Typography
                      mt="2px"
                      ml="8px"
                      sx={{
                        wordBreak: "break-word",
                        direction: testArabic(com?.text) ? "rtl" : "ltr",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(convertTextLink(com?.text), {
                          ADD_ATTR: ["target", "rel"],
                        }),
                      }}
                    />
                  </Box>

                  {com?.picturePath && (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/assets/${
                        com?.picturePath
                      }`}
                      alt={com?.picturePath}
                      style={{
                        width: "300px",
                        maxWidth: "100%",
                        maxHeight: "290px",
                        objectFit: "cover",
                        borderLeft: "2px solid gray",
                        background: "gray",
                        cursor: "pointer",
                        borderRadius: "0 0 10px 0",
                        minHeight: "201px",
                      }}
                      onClick={() => {
                        setOpenPhotoImage(com?.picturePath),
                          setIsOpenPhoto(true);
                      }}
                    />
                  )}

                  <Box position="absolute" bottom="-34px" left="0">
                    <Box display="flex" alignItems="center">
                      <IconButton
                        onClick={() => {
                          handleLikeComment(com?._id);
                        }}
                      >
                        {com?.likes?.includes(user._id) ? (
                          <FavoriteOutlined sx={{ color: "red" }} />
                        ) : (
                          <FavoriteBorderOutlined />
                        )}
                      </IconButton>

                      <Typography
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          setShowLikes(true), whoLikes(com?.likes);
                        }}
                      >
                        {com?.likes?.length}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}

      {showLikes && (
        <TasksComponent
          setOpen={setShowLikes}
          description="Likes Info"
          open={showLikes}
        >
          {likesLoading ? (
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
              <img
                src={"../../../assets/kOnzy.gif"}
                alt=""
                width="87"
                style={{
                  userSelect: "none",
                  filter: "sepia(1) hue-rotate(127deg)",
                }}
              />
            </Box>
          ) : likeList?.length < 1 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="100%"
              position="absolute"
              top="50%"
              left="50%"
              sx={{
                transform: "translate(-50%,-50%)",
              }}
            >
              <Typography fontSize="25px">There are no likes yet</Typography>
            </Box>
          ) : (
            likeList?.map((user, index) => {
              return (
                <>
                  <Link to={`/profile/${user._id}`} className="opacityBox">
                    <FlexBetween key={index} sx={{ cursor: "pointer" }}>
                      <Box display="flex" alignItems="center" gap="10px">
                        <UserImage image={user.picturePath} />
                        <Box display="flex" alignItems="center" gap="4px">
                          <Typography>
                            {user.firstName || "Undefined"} {user.lastName}
                          </Typography>
                          {user.verified && (
                            <VerifiedOutlined
                              sx={{
                                fontSize: "20px",
                                color: "#00D5FA",
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </FlexBetween>
                  </Link>
                  {likeList?.indexOf(user) !== likeList?.length - 1 && (
                    <Divider />
                  )}
                </>
              );
            })
          )}
        </TasksComponent>
      )}

      {commentEditOpen && (
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
              setCommentEditOpen(false);
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
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              gap="10px"
              width="100%"
            >
              {user._id === CommentUserId && (
                <IconButton
                  sx={{
                    borderRadius: "8px",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    width: "100%",
                  }}
                  onClick={() => {
                    setIsEdit(true);
                    setCommentEditOpen(false);
                  }}
                >
                  <EditOutlined sx={{ fontSize: "25px" }} />
                  <Typography fontSize="16px">Edit The Comment</Typography>
                </IconButton>
              )}

              <IconButton
                sx={{
                  borderRadius: "8px",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  width: "100%",
                }}
                onClick={() => {
                  setCommentEditOpen(false);
                  setIsDeleteComment(true);
                }}
              >
                <DeleteOutlined sx={{ fontSize: "25px" }} />
                <Typography fontSize="16px">Delete The Comment</Typography>
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}

      {isEdit && (
        <CommentEdit
          setIsEdit={setIsEdit}
          commentText={commentText}
          commentId={commentId}
          setCommentsState={setCommentsState}
        />
      )}

      {isDeleteComment && (
        <DeleteComponent
          type="comment"
          setIsDeleteComment={setIsDeleteComment}
          handleDeleteComment={handleDeleteComment}
        />
      )}

      {isOpenPhoto && (
        <OpenPhoto photo={openPhotoImage} setIsImagOpen={setIsOpenPhoto} />
      )}
    </Box>
  );
};

export default Comments;
