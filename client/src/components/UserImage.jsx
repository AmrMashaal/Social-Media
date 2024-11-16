import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";

// eslint-disable-next-line react/prop-types
const UserImage = ({ image, size = "60px", isProfile, isSearch }) => {
  const theme = useTheme();
  const alt = theme.palette.background.alt;

  return (
    <Box width={size} height={size} margin={isSearch ? "auto" : undefined}>
      <img
        style={{
          backgroundColor: "gray",
          borderRadius: "50%",
          objectFit: "cover",
          userSelect: "none",
          border: isProfile ? `6px solid ${alt}` : undefined,
          boxShadow: isProfile
            ? "rgba(0, 0, 0, 0.13) 3px 6px 7px 0px"
            : undefined,
        }}
        width={size}
        height={size}
        src={`${import.meta.env.VITE_API_URL}/assets/${image}`}
        alt="user img"
      />
    </Box>
  );
};

export default UserImage;
