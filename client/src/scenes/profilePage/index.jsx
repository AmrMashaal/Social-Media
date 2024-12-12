import { Box, useMediaQuery } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../navbar";
import PostWidget from "../widgets/PostWidget";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostClick from "../../components/post/PostClick";
import { debounce } from "lodash";
import { setLogin, setPosts } from "../../../state";
import ProfileInfo from "../../components/profile/ProfileInfo";
import { Typography } from "@mui/material";
import FriendsWidget from "../widgets/FriendsWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostSkeleton from "../skeleton/PostSkeleton";
import WrongPassword from "../../components/WrongPassword";
import socket from "../../components/socket";

const ProfilePage = () => {
  const { userId } = useParams();
  const [page, setPage] = useState(1);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);
  const [isPostClicked, setIsPostClicked] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [postClickData, setPostClickData] = useState({
    picturePath: "",
    firstName: "",
    lastName: "",
    userPicturePath: "",
    description: "",
    _id: "",
    userId: "",
    verified: "",
  });
  const posts = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const mode = useSelector((state) => state.mode);
  const dispatch = useDispatch();
  const isNonMobileScreens = useMediaQuery("(min-width: 1060px)");
  const navigate = useNavigate();

  document.body.style.overflow = isPostClicked ? "hidden" : "unset";

  async function getPosts(reset = false) {
    page === 1 && setIsLoading(true);
    page === 1 && dispatch(setPosts({ posts: [] }));

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/posts/${userId}/posts?page=${page}&limit=5`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newPosts = await response.json();

      if (reset) {
        dispatch(setPosts({ posts: newPosts }));
      } else {
        dispatch(setPosts({ posts: [...posts, ...newPosts] }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (page === 1) {
      getPosts(true);
    } else {
      getPosts();
    }
  }, [page, userId]);

  const getMorePosts = () => {
    setPage((prevNum) => prevNum + 1);
  };

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (
        window.scrollY + window.innerHeight >=
        document.body.offsetHeight - 3
      ) {
        getMorePosts();
      }
    }, 300);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const userData = async () => {
    setUserInfo(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data.message) {
        setProfileError(true);
      }

      setUserInfo(data);
      if (user._id === data._id) {
        dispatch(setLogin({ token, user: data }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userInfo?.firstName !== undefined) {
      document.title = `Loop - ${userInfo?.firstName} ${userInfo?.lastName}`;
    }
  }, [userInfo]);

  useEffect(() => {
    userData();
    setPage(1);
    setIsPostClicked(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [userId]);

  useEffect(() => {
    if (profileError) {
      document.title = `Loop`;
    }
  }, [profileError]);

  const returnToHome = () => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const checkCorrectPassword = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${
          user._id
        }/checkCorrectPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ passwordChangedAt: user.passwordChangedAt }),
        }
      );

      const result = await response.json();

      if (result.message === "Password is not correct") {
        setWrongPassword(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkCorrectPassword();
  }, []);

  return (
    <div>
      <Box
        position="fixed"
        width="800px"
        height="800px"
        borderRadius="50%"
        boxShadow="0 0 20px 20px rgb(27 102 176 / 19%)"
        top="-200px"
        left="-172px"
        zIndex="100"
        sx={{
          opacity: mode === "light" ? "0.1" : "0.07",
          background:
            "radial-gradient(circle, rgb(30 144 255 / 65%), rgb(17 17 17 / 0%))",
          pointerEvents: "none",
        }}
      ></Box>

      <Box
        position="fixed"
        width="800px"
        height="800px"
        borderRadius="50%"
        boxShadow="0 0 20px 20px rgb(255 31 198 / 13%)"
        bottom="-200px"
        right="-172px"
        zIndex="100"
        sx={{
          opacity: mode === "light" ? "0.1" : "0.1",
          background:
            "radial-gradient(circle, rgb(255 31 223 / 63%), rgb(17 17 17 / 0%))",
          pointerEvents: "none",
        }}
      ></Box>

      {!profileError ? (
        <>
          <Navbar isProfile={true} />

          <ProfileInfo userInfo={userInfo} userId={userId} />

          <Box
            display="flex"
            gap="10px"
            justifyContent="space-between"
            flexDirection={isNonMobileScreens ? "row" : "column"}
            className="profileContainer"
            mt={() => {
              if (!isNonMobileScreens && userInfo?.bio?.length >= 180) {
                return "482px";
              } else if (
                isNonMobileScreens &&
                userInfo?.bio &&
                userInfo?.bio.length < 180
              ) {
                return "230px";
              } else if (
                !isNonMobileScreens &&
                userInfo?.bio &&
                !userInfo?.bio.length < 180
              ) {
                return "358px";
              } else if (isNonMobileScreens && !userInfo?.bio) {
                return "190px";
              } else if (!isNonMobileScreens && !userInfo?.bio) {
                return "300px";
              } else if (isNonMobileScreens && userInfo?.bio?.length >= 180) {
                return "310px";
              }
            }}
            padding="10px"
          >
            <Box
              width={isNonMobileScreens ? "400px" : "100%"}
              height="100%"
              position={isNonMobileScreens ? "sticky" : undefined}
              top={isNonMobileScreens ? "93px" : undefined}
              mt={isNonMobileScreens ? undefined : "10px"}
            >
              <FriendsWidget
                type="friends"
                userId={userId}
                description={
                  userId === user._id ? "my friends" : "user friends"
                }
              />
            </Box>

            <Box width="100%">
              {userId === user._id && (
                <MyPostWidget picturePath={user.picturePath} socket={socket} />
              )}

              <Box mt={isNonMobileScreens ? undefined : "-87px"}>
                <Box zIndex="1" mt={!isNonMobileScreens ? "95px" : "0"}>
                  {isLoading ? (
                    <PostSkeleton />
                  ) : (
                    <>
                      <PostWidget
                        posts={posts}
                        postClickData={postClickData}
                        setPostClickData={setPostClickData}
                        isPostClicked={isPostClicked}
                        setIsPostClicked={setIsPostClicked}
                      />
                      {isPostClicked && (
                        <PostClick
                          picturePath={postClickData.picturePath}
                          firstName={postClickData.firstName}
                          lastName={postClickData.lastName}
                          userPicturePath={postClickData.userPicturePath}
                          description={postClickData.description}
                          setIsPostClicked={setIsPostClicked}
                          _id={postClickData._id}
                          userId={postClickData.userId}
                          verified={postClickData.verified}
                        />
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            ":before": {
              content: "''",
              position: "absolute",
              padding: "6px",
              background: "red",
              left: "50%",
              transform: "rotate(40deg) translate(-50%, -50%)",
              top: "50%",
              zIndex: "-1",
              height: "400px",
              transformOrigin: "top",
            },
            ":after": {
              content: "''",
              position: "absolute",
              padding: "6px",
              background: "red",
              left: "50%",
              transform: "rotate(-40deg) translate(-50%, -50%)",
              top: "50%",
              zIndex: "-1",
              height: "400px",
              transformOrigin: "top",
            },
          }}
        >
          <Typography
            fontSize={isNonMobileScreens ? "50px" : "35px"}
            bgcolor="#000000a8"
            textTransform="capitalize"
            color="white"
          >
            this profile is not existed or has been deleted
            {returnToHome()}
          </Typography>
        </Box>
      )}

      {wrongPassword && <WrongPassword />}
    </div>
  );
};

export default ProfilePage;
