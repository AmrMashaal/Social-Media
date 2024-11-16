import { Typography, Divider, Skeleton } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector } from "react-redux";
import FlexBetween from "../../components/FlexBetween";
import UserImage from "../../components/UserImage";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setFriends } from "../../../state";

// eslint-disable-next-line react/prop-types
const FriendsWidget = ({ userId, description }) => {
  const [loading, setLoading] = useState(true);
  const [userFriends, setUserFriends] = useState([]);
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  const handleUserFriend = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/friends`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const friends = await response.json();

      if (user._id === userId) {
        dispatch(setFriends({ friends: friends }));
      }

      setUserFriends(friends);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleUserFriend();
  }, [userId]);

  return (
    <WidgetWrapper position="sticky" top="87px">
      <Typography color="#a9a4a4" fontSize="13px" sx={{ userSelect: "none" }}>
        {description}
      </Typography>
      <Box
        mt="10px"
        maxHeight="390px"
        overflow="auto"
        sx={{ scrollbarWidth: "none" }}
      >
        {!loading ? (
          userFriends && userFriends.length > 0 ? (
            userFriends?.map((friend, index) => {
              // i trust in allah, i trust in myself
              return (
                <Box key={index} mb="15px">
                  <Link to={`/profile/${friend._id}`}>
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
                        <UserImage image={friend.picturePath} size="55px" />
                        <Box>
                          <Typography
                            fontSize="14px"
                            sx={{ transition: ".3s" }}
                            className="usernameFriends"
                          >
                            {friend.firstName} {friend.lastName}
                          </Typography>
                          <Typography color="#858585">
                            {friend.occupation}
                          </Typography>
                        </Box>
                      </Box>
                    </FlexBetween>
                  </Link>
                  {userFriends.indexOf(friend) !== userFriends.length - 1 && (
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
              <Skeleton
                width="50px"
                height="80px"
                sx={{ borderRadius: "50%" }}
              />
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
              <Skeleton
                width="50px"
                height="80px"
                sx={{ borderRadius: "50%" }}
              />
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
              <Skeleton
                width="50px"
                height="80px"
                sx={{ borderRadius: "50%" }}
              />
              <Box>
                <Skeleton width="100px" />
                <Skeleton />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendsWidget;
