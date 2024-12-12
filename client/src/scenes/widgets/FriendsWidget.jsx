/* eslint-disable react/prop-types */
import { Typography } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setFriends } from "../../../state";
import OnlineFriends from "../../components/friends/OnlineFriends";
import UserFriends from "../../components/friends/UserFriends";

// eslint-disable-next-line react/prop-types
const FriendsWidget = ({
  userId,
  description,
  onlineFriends,
  type,
  setOnlineFriends,
}) => {
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

  const handleOnlineFriends = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/onlineFriends`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const onlineFriends = await response.json();
      setOnlineFriends(onlineFriends);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type === "friends") {
      handleUserFriend();
    } else if (type === "onlineFriends") {
      handleOnlineFriends();
    }
  }, [userId]);

  return (
    <WidgetWrapper position="sticky" top="87px">
      <Typography color="#a9a4a4" fontSize="13px" sx={{ userSelect: "none" }}>
        {description}
      </Typography>

      {type === "onlineFriends" && (
        <OnlineFriends
          onlineFriends={onlineFriends}
          loading={loading}
          user={user}
          userId={user._id}
        />
      )}

      {type === "friends" && (
        <UserFriends
          userFriends={userFriends}
          loading={loading}
          user={user}
          userId={user._id}
        />
      )}
    </WidgetWrapper>
  );
};

export default FriendsWidget;
