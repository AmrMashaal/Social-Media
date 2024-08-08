import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ borderRadius: "50%", objectFit: "cover", userSelect: "none" }}
        width={size}
        height={size}
        src={`http://localhost:3001/assets/${image}`}
        alt="user img"
      />
    </Box>
  );
};

export default UserImage