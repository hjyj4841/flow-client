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
import UpdatePost from "./pages/post/UpdatePost";
import VotePost from "./pages/post/VotePost";
import Detail from "./pages/post/Detail";
import UpdateUser from "./pages/user/UpdateUser";
import NewFeed from "./pages/post/NewFeed";
import PopularFeed from "./pages/post/PopularFeed";
import MyFollowerFeed from "./pages/post/MyFollowerFeed.js";
import Searched from "./pages/post/Searched.js";
import VoteDetail from "./pages/post/VoteDetail.js";
import UploadVote from "./pages/post/UploadVote.js";

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
      {
        path: "/votePost/",
        element: <VotePost />,
      },
      {
        path: "/votePost/",
        children: [
          {
            path: ":postCode",
            element: <VoteDetail />,
          },
        ],
      },

      { path: "/uploadVote", element: <UploadVote /> }, // 투표 게시물 업로드
      { path: "/uploadPost", element: <UploadPost /> },

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
      { path: "/searched", element: <Searched /> },
    ],
  },
]);

export default router;
