/* eslint-disable react/no-unescaped-entities */
import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "../../components/UserImage";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const isDark = useSelector((state) => state.mode);

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) return null;

  const { firstName, lastName, location, occupation, friends } = user;

  return (
    <WidgetWrapper>
      <FlexBetween
        gap="0.8rem"
        pb="1.5rem"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/users/${userId}`)}
      >
        <Box>
          <FlexBetween gap="0.8rem" s>
            <UserImage image={picturePath}></UserImage>
            <Box display="flex" flexDirection="column">
              <Typography variant="h5">
                {firstName} {lastName}
              </Typography>
              <Typography
                color={medium}
              >{`${friends?.length} friends`}</Typography>
            </Box>
          </FlexBetween>
        </Box>
        <ManageAccountsOutlined />
      </FlexBetween>
      <Divider />
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="10px" marginBlock="1rem">
          <LocationOnOutlined style={{ fontSize: "26px" }} />
          <Typography color={medium} textTransform="capitalize" fontSize="14px">
            {location}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="10px">
          <WorkOutlineOutlined style={{ fontSize: "26px" }} />
          <Typography color={medium} textTransform="capitalize" fontSize="14px">
            {occupation}
          </Typography>
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
