/* eslint-disable react/prop-types */
import { Divider, IconButton, Typography } from "@mui/material";
import { Box, useMediaQuery, useTheme } from "@mui/system";
import UserImage from "./../UserImage";
import { Link } from "react-router-dom";
import {
  // ChatBubbleOutlineOutlined,
  // FavoriteBorderOutlined,
  // FavoriteOutlined,
  // ShareOutlined,
  CloseOutlined,
  VerifiedOutlined,
} from "@mui/icons-material";
import Comments from "./Comments";

const PostClick = ({
  picturePath,
  firstName,
  lastName,
  userPicturePath,
  description,
  setIsPostClicked,
  _id,
  userId,
  verified,
}) => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { palette } = useTheme();
  const medium = palette.neutral.medium;

  const regexTextFunction = () => {
    if (testBold || testUpper || testComma) {
      return description.slice(1, -1);
    } else if (testColor && description?.length < 180) {
      return description.split(" ").slice(0, -1).join(" ");
    } else if (description?.length > 180 && testColor) {
      return description.split(" ").slice(0, -1).join(" ");
    } else {
      return description;
    }
  };

  const regexBold = /^\*.*\*$/;
  const testBold = regexBold?.test(description);
  // ----------------------------------------------------
  const regexUpper = /^@.*@$/;
  const testUpper = regexUpper?.test(description);
  // ----------------------------------------------------
  const regexComma = /^".*"$/;
  const testComma = regexComma.test(description);
  // ----------------------------------------------------
  const regexColor =
    /\((olive|red|blue|orange|coffee|green|palestine|زيتوني|احمر|ازرق|برتقالي|قهوة|اخضر|قهوه|فلسطين)\)$/i;
  const testColor = regexColor.test(description);
  // ----------------------------------------------------
  const regexArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  const testArabic = regexArabic.test(description);

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
      zIndex="11111111111"
    >
      <Box
        onClick={() => setIsPostClicked(false)}
        bgcolor="#00000091"
        width="100%"
        height="101%"
        position="absolute"
      ></Box>
      <Box
        width={isNonMobileScreens ? "90%" : "100%"}
        py={isNonMobileScreens ? "10px" : "0"}
        margin={isNonMobileScreens ? "auto" : "0"}
        display="flex"
        justifyContent="center"
        flexDirection={isNonMobileScreens ? "row" : "column"}
        overflow={isNonMobileScreens ? "unset" : "auto"}
        maxHeight="100%"
        height={isNonMobileScreens ? undefined : "100%"}
      >
        {picturePath && (
          <Box
            bgcolor="black"
            sx={{
              zIndex: "1",
              maxHeight: isNonMobileScreens ? "550px" : undefined,
              height: isNonMobileScreens ? undefined : "300px",
              minHeight: isNonMobileScreens ? "550px" : undefined,
            }}
          >
            <img
              src={`${import.meta.env.VITE_API_URL}/assets/${picturePath}`}
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

        {/* ----------------Comments---------------- */}

        <Box
          bgcolor={palette.neutral.light}
          p="10px 28px"
          width={isNonMobileScreens ? "500px" : "100%"}
          sx={{
            maxWidth: "100%",
            zIndex: "1",
            maxHeight: isNonMobileScreens ? "550px" : undefined,
            height: isNonMobileScreens ? undefined : "380px",
            minHeight: isNonMobileScreens ? "550px" : undefined,
            overflow: "auto",
            flex: isNonMobileScreens ? undefined : "1",
          }}
          id="commentsParent"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            position="sticky"
            top="-11px"
            zIndex="11"
            p="4px 0"
            bgcolor={palette.neutral.light}
          >
            <Link to={`/profile/${userId}`} className="opacityBox">
              <Box
                display="flex"
                alignItems="center"
                gap="10px"
                sx={{
                  cursor: "pointer",
                }}
              >
                <UserImage image={userPicturePath} size="50px" />
                <Box display="flex" gap="5px" alignItems="center">
                  <Typography sx={{ transition: ".3s" }}>
                    {firstName} {lastName}
                  </Typography>
                  {verified && (
                    <VerifiedOutlined
                      sx={{ fontSize: "22px", color: "#00D5FA" }}
                    />
                  )}
                </Box>
              </Box>
            </Link>
            <Box
              onClick={(e) => {
                e.stopPropagation(), setIsPostClicked(false);
              }}
            >
              <IconButton>
                <CloseOutlined />
              </IconButton>
            </Box>
          </Box>
          <Typography
            fontSize="16px"
            lineHeight="27px"
            sx={{
              wordWrap: "break-word",
              overflowX: "auto",
              direction: testArabic ? "rtl" : "ltr",
            }}
            my="10px"
          >
            {regexTextFunction()}
          </Typography>
          <Divider />
          <Typography
            m="9px 0px 5px"
            color={medium}
            fontSize="12px"
            fontWeight="bold"
            sx={{ userSelect: "none" }}
          >
            comments
          </Typography>
          <Comments _id={_id} userId={userId} />
        </Box>
      </Box>
    </Box>
  );
};

export default PostClick;
