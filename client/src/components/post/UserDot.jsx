/* eslint-disable react/prop-types */
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";

const UserDot = (props) => {
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
