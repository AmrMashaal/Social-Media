/* eslint-disable react/prop-types */
import { Divider, IconButton, Typography } from "@mui/material";
import { Box, useMediaQuery, useTheme } from "@mui/system";
import UserImage from "./UserImage";
import { useNavigate } from "react-router-dom";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  CloseOutlined,
} from "@mui/icons-material";
import WidgetWrapper from "./WidgetWrapper";

const PostClick = ({
  picturePath,
  firstName,
  lastName,
  userPicturePath,
  description,
  setIsPostClicked,
  _id,
}) => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { palette } = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        onClick={() => setIsPostClicked(false)}
        bgcolor="#00000091"
        sx={{ backdropFilter: "blur(13px)" }}
        width="100%"
        height="101%"
        position="absolute"
      ></Box>
      <Box
        position="absolute"
        top="10px"
        width="100%"
        left="10px"
        onClick={() => setIsPostClicked(false)}
      >
        <IconButton>
          <CloseOutlined />
        </IconButton>
      </Box>
      <Box
        width="90%"
        py="10px"
        margin="auto"
        display="flex"
        justifyContent="center"
        flexDirection={isNonMobileScreens ? "row" : "column"}
        overflow={isNonMobileScreens ? "unset" : "auto"}
        maxHeight="100%"
      >
        {picturePath && (
          <Box
            bgcolor="black"
            sx={{
              zIndex: "1",
              maxHeight: isNonMobileScreens ? "700px" : undefined,
              height: isNonMobileScreens ? undefined : "394px",
              minHeight: isNonMobileScreens ? "700px" : undefined,
            }}
          >
            <img
              src={`http://localhost:3001/assets/${picturePath}`}
              title={picturePath}
              style={{
                objectFit: "contain",
                height: "100%",
                width: isNonMobileScreens ? "500px" : "100%",
                maxWidth: "100%",
                //   maxHeight: isNonMobileScreens ? undefined : "500px",
                margin: isNonMobileScreens ? "auto" : undefined,
                display: isNonMobileScreens ? "block" : undefined,
              }}
            />
          </Box>
        )}

        <Box
          bgcolor={palette.neutral.light}
          p="10px 28px"
          width={isNonMobileScreens ? "500px" : "100%"}
          sx={{
            maxWidth: "100%",
            zIndex: "1",
            maxHeight: isNonMobileScreens ? "700px" : "312px",
            overflow: "auto",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap="10px"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/users/${_id}`)}
          >
            <UserImage image={userPicturePath} />
            <Typography>
              {firstName} {lastName}
            </Typography>
          </Box>
          <Divider sx={{ my: "10px" }} />
          <Typography fontSize="16px" lineHeight="27px">
            {description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PostClick;
