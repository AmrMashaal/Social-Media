import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  return (
    <Box>
      <Box padding="10px" bgcolor={alt} p="14px 30px" textAlign="center">
        <Typography
          fontSize="23px"
          fontWeight="bold"
          color="primary"
          style={{ userSelect: "none" }}
        >
          SocialMedia
        </Typography>
      </Box>
      <Box
        width={isNonMobileScreen ? "50%" : "90%"}
        backgroundColor={alt}
        m="2rem auto" // 1rem == 16px
        p="2rem"
        borderRadius="5px"
      >
        <Typography variant="h5" lineHeight="25px" mb="1.5rem">
          Welcome to SocialMedia, the Social Media for Egyptian Students
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
