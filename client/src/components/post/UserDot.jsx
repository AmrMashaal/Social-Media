/* eslint-disable react/prop-types */
import { DeleteOutlined, EditOutlined, PushPin } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setPosts } from "../../../state";

const UserDot = (props) => {
  const token = useSelector((state) => state.token);
  const posts = useSelector((state) => state.posts);

  const dispatch = useDispatch();

  const location = useLocation();

  const handlePin = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${props.postInfo.postId}/pin`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      dispatch(
        setPosts({
          posts: [data, ...posts.filter((ele) => ele._id !== data._id)],
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      gap="10px"
      width="100%"
    >
      <IconButton
        sx={{
          borderRadius: "8px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          width: "100%",
        }}
        onClick={() => {
          props.setIsDots(false);
          props.setIsEdit(true);
        }}
      >
        <EditOutlined sx={{ fontSize: "25px" }} />
        <Typography fontSize="16px">Edit The Post</Typography>
      </IconButton>

      {location.pathname.split("/")[1] === "profile" && (
        <IconButton
          sx={{
            borderRadius: "8px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
            width: "100%",
          }}
          onClick={() => {
            handlePin();
            props.setIsDots(false);
          }}
        >
          <PushPin sx={{ fontSize: "25px" }} />
          <Typography fontSize="16px">Pin The Post</Typography>
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
          // eslint-disable-next-line react/prop-types
          props.setPostWhoDeleted(props.postInfo.postId);
          props.setIsDelete(true);
          props.setIsDots(false);
        }}
      >
        <DeleteOutlined sx={{ fontSize: "25px" }} />
        <Typography fontSize="16px">Delete The Post</Typography>
      </IconButton>
    </Box>
  );
};

export default UserDot;
