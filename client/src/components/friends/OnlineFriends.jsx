/* eslint-disable react/prop-types */
import {
  Box,
  Typography,
  Skeleton,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import UserImage from "../UserImage";
import FlexBetween from "../FlexBetween";

const OnlineFriends = ({ onlineFriends, loading }) => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box
      mt="10px"
      maxHeight="390px"
      overflow="auto"
      sx={{ scrollbarWidth: "none" }}
      display={!isNonMobileScreens ? "flex" : "block"}
      flexDirection={isNonMobileScreens ? "column" : "row"}
      gap={!isNonMobileScreens ? "25px" : undefined}
      mb={isNonMobileScreens ? undefined : "-15px"}
    >
      {!loading ? (
        onlineFriends && onlineFriends?.length > 0 ? (
          onlineFriends?.map((friend, index) => {
            // i trust in allah, i trust in myself
            if (friend?._id === undefined) {
              return;
            }

            return (
              <Box key={index} mb="15px">
                <Link to={`/profile/${friend?._id}`}>
                  <FlexBetween
                    pb="8px"
                    sx={{
                      cursor: "pointer",
                      ":hover": {
                        ".usernameFriends": {
                          marginLeft: isNonMobileScreens ? "6px" : undefined,
                        },
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      gap="12px"
                      alignItems="center"
                      flexDirection={isNonMobileScreens ? "row" : "column"}
                      className={isNonMobileScreens ? undefined : "opacityBox"}
                    >
                      <UserImage
                        image={friend?.picturePath}
                        size={isNonMobileScreens ? "55px" : "55px"}
                        isOnline={true}
                      />
                      <Box>
                        <Typography
                          fontSize={isNonMobileScreens ? "14px" : "10px"}
                          sx={{ transition: ".3s" }}
                          className="usernameFriends"
                          maxWidth="115px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          mt={!isNonMobileScreens && "-6px"}
                        >
                          {friend?.firstName} {friend?.lastName}
                        </Typography>

                        {isNonMobileScreens && (
                          <Typography
                            color="#858585"
                            whiteSpace="nowrap"
                            maxWidth="115px"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            fontSize="12px"
                          >
                            {friend?.occupation}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </FlexBetween>
                </Link>

                {isNonMobileScreens &&
                  onlineFriends?.indexOf(friend) !==
                    onlineFriends?.length - 1 && <Divider />}
              </Box>
            );
          })
        ) : (
          <Typography mb="10px">no friends online</Typography>
        )
      ) : (
        <Box>
          <Box
            display="flex"
            gap="10px"
            alignItems="center"
            mt="-10px"
            pb="4px"
          >
            <Skeleton width="50px" height="80px" sx={{ borderRadius: "50%" }} />
            <Box>
              <Skeleton width="100px" />
              <Skeleton />
            </Box>
          </Box>
          <Divider />
          <Box
            display="flex"
            gap="10px"
            alignItems="center"
            mt="-10px"
            py="4px"
          >
            <Skeleton width="50px" height="80px" sx={{ borderRadius: "50%" }} />
            <Box>
              <Skeleton width="100px" />
              <Skeleton />
            </Box>
          </Box>
          <Divider />
          <Box
            display="flex"
            gap="10px"
            alignItems="center"
            mt="-10px"
            py="4px"
          >
            <Skeleton width="50px" height="80px" sx={{ borderRadius: "50%" }} />
            <Box>
              <Skeleton width="100px" />
              <Skeleton />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OnlineFriends;
