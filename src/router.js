import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/Main";
import Register from "./pages/Register";
import RegisterUser from "./pages/RegisterUser";
import Login from "./pages/Login";
import AuthRegister from "./pages/auth/AuthRegister";
import AuthLogin from "./pages/auth/AuthLogin";
import LoginSuccess from "./components/LoginSuccess";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Main /> },
      { path: "/register", element: <Register /> },
      { path: "/registerUser", element: <RegisterUser /> },
      { path: "/login", element: <Login /> },
      { path: "/authRegister", element: <AuthRegister /> },
      { path: "/authLogin", element: <AuthLogin /> },
      { path: "/loginSuccess", element: <LoginSuccess /> },
    ],
  },
]);

export default router;
