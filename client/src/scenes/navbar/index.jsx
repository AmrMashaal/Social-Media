import FlexBetween from "../../components/FlexBetween";
import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  DarkMode,
  LightMode,
  Message,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../../../state/index";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutrallLight = theme.palette.neutral.light;
  // const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user?.firstName} ${user?.lastName}`;

  return (
    <FlexBetween padding="10px" bgcolor={alt} p="14px 30px">
      <FlexBetween gap="15px">
        <Typography
          fontSize="23px"
          fontWeight="bold"
          color="primary"
          style={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => navigate("/home")}
          sx={{
            transition: ".2s",
            ":hover": {
              color: primaryLight,
            },
          }}
        >
          SocialMedia
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutrallLight}
            padding="2px 0 2px 7px"
            borderRadius="9px"
            gap="3px"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* Desktop Navigate */}
      {isNonMobileScreens ? (
        <FlexBetween>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "light" ? (
              <LightMode sx={{ fontSize: "25px" }} />
            ) : (
              <DarkMode sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton>
            <Message sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton>
            <Notifications sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton>
            <Help sx={{ fontSize: "25px" }} />
          </IconButton>
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                background: neutrallLight,
                padding: "2px 8px",
                width: "150px",
                borderRadius: "9px",
                "& .MuiSvgIcon-root": {
                  width: "20px",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutrallLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>{fullName}</MenuItem>
              <MenuItem value="Log out" onClick={() => dispatch(setLogout())}>
                Log out
              </MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton onClick={() => setIsMobileMenuToggled(true)}>
          <Menu />
        </IconButton>
      )}

      {/* Mobile Navigate */}
      {!isNonMobileScreens && (
        <>
          {isMobileMenuToggled && ( // close the nav when click anywhere except the nav
            <Box
              width="100%"
              height="100%"
              position="fixed"
              left="0"
              top="0"
              zIndex="9"
              onClick={() => setIsMobileMenuToggled(false)}
            ></Box>
          )}

          <Box
            position="fixed"
            maxWidth="500px"
            minWidth="200px"
            padding="10px"
            height="100%"
            zIndex="10"
            backgroundColor={background}
            right={isMobileMenuToggled ? "0" : "-400px"}
            top="0"
            boxShadow="6px 2px 20px 0 #0000002d"
            sx={{
              transition: ".3s right",
            }}
          >
            <IconButton onClick={() => setIsMobileMenuToggled(false)}>
              <Close />
            </IconButton>

            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              gap="20px"
              marginTop="14px"
            >
              <Box
                display="flex"
                alignItems="center"
                gap="8px"
                onClick={() => dispatch(setMode())}
                sx={{
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <IconButton>
                  {theme.palette.mode === "light" ? (
                    <LightMode sx={{ fontSize: "25px" }} />
                  ) : (
                    <DarkMode sx={{ fontSize: "25px" }} />
                  )}
                </IconButton>
                <Typography fontSize="15px">
                  {theme.palette.mode === "light" ? "Light Mode" : "Dark Mode"}
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                gap="8px"
                sx={{
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <IconButton>
                  <Message sx={{ fontSize: "25px" }} />
                </IconButton>
                <Typography fontSize="15px">Messages</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                gap="8px"
                sx={{
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <IconButton>
                  <Notifications sx={{ fontSize: "25px" }} />
                </IconButton>
                <Typography fontSize="15px">Notifications</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                gap="8px"
                sx={{
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <IconButton>
                  <Help sx={{ fontSize: "25px" }} />
                </IconButton>
                <Typography fontSize="15px">Help</Typography>
              </Box>
              <FormControl variant="standard" value={fullName}>
                <Select
                  value={fullName}
                  sx={{
                    background: neutrallLight,
                    padding: "2px 8px",
                    width: "150px",
                    "& .MuiSvgIcon-root": {
                      width: "20px",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: neutrallLight,
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem value={fullName}>{fullName}</MenuItem>
                  <MenuItem
                    value="Log out"
                    onClick={() => dispatch(setLogout())}
                  >
                    Log out
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </>
      )}
    </FlexBetween>
  );
};

export default Navbar;
