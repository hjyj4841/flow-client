import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/Main";
import Register from "./pages/user/Register";
import RegisterUser from "./pages/user/RegisterUser";
import Login from "./pages/user/Login";
import Mypage from "./pages/MyPage";
import AuthRegisterKakao from "./pages/auth/AuthRegisterKakao";
import AuthLoginKakao from "./pages/auth/AuthLoginKakao";
import AuthRegisterNaver from "./pages/auth/AuthRegisterNaver";
import UploadPost from "./pages/post/UploadPost";
import AuthRegisterGoogle from "./pages/auth/AuthRegisterGoogle";
import AuthLoginGoogle from "./pages/auth/AuthLoginGoogle";
import ReportList from "./pages/ReportList";
import MyFollower from "./pages/follow/MyFollower";
import AuthLoginNaver from "./pages/auth/AuthLoginNaver";
import UploadVotePost from "./pages/post/UploadVotePost";
import UpdatePost from "./pages/post/UpdatePost";
import VotePost from "./pages/post/VotePost";
import Vote from "./pages/post/Vote";
import Detail from "./pages/post/Detail";
import UpdateUser from "./pages/user/UpdateUser";
import NewFeed from "./pages/post/NewFeed";
import PopularFeed from "./pages/post/PopularFeed";
import MyFollowerFeed from "./pages/post/MyFollowerFeed.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Main /> },
      { path: "/register", element: <Register /> },
      { path: "/registerUser", element: <RegisterUser /> },
      { path: "/login", element: <Login /> },
      { path: "/mypage/:mypageUserCode", element: <Mypage /> },
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
      { path: "/uploadPost", element: <UploadPost /> },
      {
        path: `mypage/:followingUserCode/follow/myFollower/:followingUserCode`,
        element: <MyFollower />,
      },
      {
        path: "/post/",
        children: [
          {
            path: ":postCode",
            element: <Detail />,
          },
          {
            path: "update/:postCode",
            element: <UpdatePost />,
          },
        ],
      },
      { path: "/updateUser", element: <UpdateUser /> },
      { path: "/updatePost/:postCode", element: <UpdatePost /> },
      { path: "/newFeed", element: <NewFeed /> },
      { path: "/popularFeed", element: <PopularFeed /> },
      { path: "/myFollowerFeed", element: <MyFollowerFeed /> },
    ],
  },
]);

export default router;
