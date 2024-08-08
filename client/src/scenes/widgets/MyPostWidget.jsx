import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
  Divider,
} from "@mui/material";
import Dropzone from "react-dropzone";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../../state";
import FlexBetween from "../../components/FlexBetween";

const PostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [post, setPost] = useState("");
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMin;
  const medium = palette.neutral.medium;

  const handlePost = async (e) => {
    e.preventDefault();
    if (post || image) {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }

      try {
        const response = await fetch("http://localhost:3001/posts", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const posts = await response.json();
        setPost("");
        setImage(null);
        dispatch(setPosts({ posts }));
        console.log(posts);
      } catch (err) {
        console.log(`Error: ${err}`);
      }
    } else {
      console.log("You Have to write or upload an image");
    }
  };

  return (
    <WidgetWrapper>
      <Box display="flex" alignItems="center" gap="20px">
        <UserImage image={picturePath} />
        <Box width="100%">
          <form onSubmit={(e) => handlePost(e)}>
            <InputBase
              type="text"
              fullWidth
              placeholder="What is on your mind?"
              value={post}
              onChange={(e) => setPost(e.target.value)}
              sx={{
                bgcolor: palette.neutral.light,
                borderRadius: "50px",
                p: "10px 10px 10px 18px",
              }}
            />
          </form>
        </Box>
      </Box>
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
            accept=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => {
              const file = acceptedFiles[0];
              const fileExtension = file.name.split(".").pop().toLowerCase();
              if (["jpg", "jpeg", "png"].includes(fileExtension)) {
                setImage(file);
                setImageError(null);
              } else if (!["jpg", "jpeg", "png"].includes(fileExtension)) {
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
          onClick={() => setIsImage(!isImage)}
        >
          <ImageOutlined />
          <Typography>Image</Typography>
        </FlexBetween>
        <Button onClick={handlePost} type="submit">
          Submit
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default PostWidget;
