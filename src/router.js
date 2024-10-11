import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/Main";
import Register from "./pages/Register";
import RegisterUser from "./pages/RegisterUser";
import Login from "./pages/Login";
import Mypage from "./pages/MyPage";
import AuthRegisterKakao from "./pages/auth/AuthRegisterKakao";
import AuthLoginKakao from "./pages/auth/AuthLoginKakao";
import AuthRegisterNaver from "./pages/auth/AuthRegisterNaver";
import UploadPost from "./pages/post/UploadPost";
import AuthRegisterGoogle from "./pages/auth/AuthRegisterGoogle";
import AuthLoginGoogle from "./pages/auth/AuthLoginGoogle";
import ReportList from "./pages/ReportList";
import MyFollower from "./pages/follow/MyFollower";
import FollowMeUsers from "./pages/follow/FollowMeUsers";
import AuthLoginNaver from "./pages/auth/AuthLoginNaver";
import UploadVotePost from "./pages/post/UploadVotePost";
import VotePost from "./pages/post/VotePost";
import Vote from "./pages/post/Vote";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Main /> },
      { path: "/register", element: <Register /> },
      { path: "/registerUser", element: <RegisterUser /> },
      { path: "/login", element: <Login /> },
      { path: "/mypage", element: <Mypage /> },
      { path: "/authRegisterKakao", element: <AuthRegisterKakao /> },
      { path: "/authLoginKakao", element: <AuthLoginKakao /> },
      { path: "/authRegisterNaver", element: <AuthRegisterNaver /> },
      { path: "/authLoginNaver", element: <AuthLoginNaver /> },
      { path: "/authRegisterGoogle", element: <AuthRegisterGoogle /> },
      { path: "/authLoginGoogle", element: <AuthLoginGoogle /> },
      { path: "/reportList", element: <ReportList /> },
      { path: "/votePost", element: <VotePost /> },
      { path: "/uploadVotePost", element: <UploadVotePost /> },
      { path: "/Vote/:voteCode", element: <Vote /> },
    ],
  },
  {
    path: `mypage/follow/myFollower/:followingUserCode`,
    element: <MyFollower />,
  },
  {
    path: `mypage/follow/followMeUsers/:followerUserCode`,
    element: <FollowMeUsers />,
  },
  { path: "/uploadPost", element: <UploadPost /> },
]);

export default router;
