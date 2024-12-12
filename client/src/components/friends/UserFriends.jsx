/* eslint-disable react/prop-types */
import { Box, Typography, Skeleton, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import UserImage from "../UserImage";
import FlexBetween from "../FlexBetween";

const UserFriends = ({ userFriends, loading, user, userId }) => {
  return (
    <Box
      mt="10px"
      maxHeight="390px"
      overflow="auto"
      sx={{ scrollbarWidth: "none" }}
    >
      {!loading ? (
        userFriends && userFriends?.length > 0 ? (
          userFriends?.map((friend, index) => {
            // i trust in allah, i trust in myself
            return (
              <Box key={index} mb="15px">
                <Link to={`/profile/${friend?._id}`}>
                  <FlexBetween
                    pb="8px"
                    sx={{
                      cursor: "pointer",
                      ":hover": {
                        ".usernameFriends": {
                          marginLeft: "6px",
                        },
                      },
                    }}
                  >
                    <Box display="flex" gap="12px" alignItems="center">
                      <UserImage image={friend?.picturePath} size="55px" />
                      <Box>
                        <Typography
                          fontSize="14px"
                          sx={{ transition: ".3s" }}
                          className="usernameFriends"
                        >
                          {friend?.firstName} {friend?.lastName}
                        </Typography>
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
                      </Box>
                    </Box>
                  </FlexBetween>
                </Link>
                {userFriends?.indexOf(friend) !== userFriends?.length - 1 && (
                  <Divider />
                )}
              </Box>
            );
          })
        ) : (
          <Typography>
            {user._id === userId
              ? "You don't have friends yet"
              : "doesn't have friends yet"}
          </Typography>
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

export default UserFriends;
