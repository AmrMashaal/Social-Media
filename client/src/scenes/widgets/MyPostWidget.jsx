/* eslint-disable react/prop-types */
import {
  EditOutlined,
  DeleteOutlined,
  ImageOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import Dropzone from "react-dropzone";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../../state";
import FlexBetween from "../../components/FlexBetween";
import { Link } from "react-router-dom";
// import { badWords } from "../../../infoArrays";

const MyPostWidget = ({ picturePath, socket }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [post, setPost] = useState("");
  const [isError, setIsError] = useState(false);
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const posts = useSelector((state) => state.posts);
  const { palette } = useTheme();

  const handlePost = async (e) => {
    e.preventDefault();
    if (
      post ||
      image
      /* !post.split(" ").some((word) => badWords.includes(word)) */
    ) {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      setIsError(false);

      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const post = await response.json();

        setPost("");
        setImage(null);
        setIsImage(false);
        dispatch(setPosts({ posts: [post, ...posts] }));
        socket.emit("newPost", post);
      } catch (err) {
        console.log(`Error: ${err}`);
      }
    } else {
      setIsError(true);
      console.log("You Have to write or upload an image");
    }
  };

  useEffect(() => {
    isError && post.length !== 0 && setIsError(false);
  }, [post]);

  return (
    <WidgetWrapper mb="10px">
      <Box display="flex" alignItems="center" gap="20px">
        <Link to={`/profile/${_id}`}>
          <Box sx={{ cursor: "pointer" }}>
            <UserImage image={picturePath} />
          </Box>
        </Link>
        <Box width="100%">
          <form onSubmit={(e) => handlePost(e)}>
            <InputBase
              type="text"
              fullWidth
              sx={{
                bgcolor: palette.neutral.light,
                borderRadius: "50px",
                p: "10px 10px 10px 18px",
              }}
              placeholder="What is on your mind?"
              value={post}
              onClick={() => isError && setIsError(false)}
              onChange={(e) => setPost(e.target.value)}
            />
          </form>

          <FlexBetween></FlexBetween>
        </Box>
      </Box>
      {isError && (
        <Typography color="error" mt="8px" ml="20px">
          You have to write or share a photo
        </Typography>
      )}
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

      <Divider sx={{ mt: "10px" }} />
      <FlexBetween mt="10px">
        <FlexBetween
          gap="5px"
          p="3px"
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
            isError && setIsError(false);
          }}
        >
          <ImageOutlined />
          <Typography>Image</Typography>
        </FlexBetween>
        <Button onClick={handlePost} type="submit">
          Share
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
