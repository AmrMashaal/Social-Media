import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./scenes/homePage";
import LoginPage from "./scenes/loginPage";
import ProfilePage from "./scenes/profilePage";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import SearchPage from "./scenes/searchPage/SearchPage";
import { setFriends } from "../state";
import io from "socket.io-client";
import ChatPage from "./scenes/chatPage/ChatPage";

const socket = io.connect(import.meta.env.VITE_API_URL); // the backend server

const App = () => {
  const [newPosts, setNewPosts] = useState([]);

  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.user));

  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const dispatch = useDispatch();
  const handleUserFriend = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user._id}/friends`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const friends = await response.json();
      dispatch(setFriends({ friends: friends }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleUserFriend();
  }, []);

  useEffect(() => {
    socket.on("notification", (data) => {
      setNewPosts((prevPosts) => (prevPosts ? [...prevPosts, data] : data));
    });

    socket.emit("userOnline", user?._id);

    return () => {
      socket.off("notification");
      socket.off("userOnline"); // last code
    };
  }, [socket]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route
              path="/login"
              element={!isAuth ? <LoginPage /> : <Navigate to="/" />}
            />
             <Route
              path="/signup"
              element={!isAuth ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/"
              element={
                isAuth ? (
                  <HomePage
                    socket={socket}
                    newPosts={newPosts}
                    setNewPosts={setNewPosts}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/search/:searchValue"
              element={isAuth ? <SearchPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/chat/:userId"
              element={
                isAuth ? <ChatPage socket={socket} /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/chat"
              element={
                isAuth ? (
                  <ChatPage socket={socket} fromNav={true} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="*"
              element={isAuth ? <Navigate to="/" /> : <Navigate to="/login" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
