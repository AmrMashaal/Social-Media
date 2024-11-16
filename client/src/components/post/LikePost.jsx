/* eslint-disable react/prop-types */
import { IconButton, Typography } from "@mui/material";
import FlexBetween from "./../FlexBetween";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";

const LikePost = ({
  ele,
  user,
  setShowLikes,
  handleLike,
  whoLikes,
  setIsPostClicked,
  setPostClickData,
}) => {
  return (
    <FlexBetween>
      <FlexBetween gap="8px">
        <FlexBetween>
          <IconButton onClick={() => handleLike(ele || {})}>
            {Object.keys(ele?.likes || {}).includes(user?._id) ? (
              <FavoriteOutlined sx={{ color: "red" }} />
            ) : (
              <FavoriteBorderOutlined />
            )}
          </IconButton>
          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setShowLikes(true);
              whoLikes(ele?.likes);
            }}
          >
            {Object.keys(ele?.likes || {}).length}
          </Typography>
        </FlexBetween>
        <FlexBetween
          sx={{ cursor: "pointer" }}
          onClick={() => {
            setIsPostClicked(true),
              setPostClickData({
                picturePath: ele?.picturePath,
                firstName: ele?.firstName,
                lastName: ele?.lastName,
                userPicturePath: ele?.userPicturePath,
                description: ele?.description,
                _id: ele?._id,
                userId: ele?.userId,
                verified: ele?.verified,
              });
          }}
        >
          <IconButton>
            <ChatBubbleOutlineOutlined />
          </IconButton>
        </FlexBetween>
      </FlexBetween>
      <IconButton>
        <ShareOutlined />
      </IconButton>
    </FlexBetween>
  );
};

export default LikePost;
