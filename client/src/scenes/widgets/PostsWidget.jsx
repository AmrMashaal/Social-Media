import {
  PersonAddOutlined,
  PersonRemoveOutlined,
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostClick from "../../components/PostClick";
import PostWidget from "./PostWidget";
import { setPosts } from "../../../state/index";

const PostsWidget = () => {
  const [isPostClicked, setIsPostClicked] = useState(false);
  const [postClickData, setPostClickData] = useState({
    picturePath: "",
    firstName: "",
    lastName: "",
    userPicturePath: "",
    description: "",
    _id: "",
  });
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  document.body.style.overflow = isPostClicked ? "hidden" : "unset";

  async function getPosts() {
    try {
      const response = await fetch("http://localhost:3001/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const posts = await response.json();
      dispatch(setPosts({ posts }));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Box>
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
        />
      )}
    </Box>
  );
};

export default PostsWidget;
