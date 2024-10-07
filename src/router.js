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
      { path: "/authRegisterGoogle", element: <AuthRegisterGoogle /> },
      { path: "/authLoginGoogle", element: <AuthLoginGoogle /> },
    ],
  },
  { path: "/uploadPost", element: <UploadPost /> },
]);

export default router;
