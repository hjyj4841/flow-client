import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/Main";
import Register from "./pages/Regsiter";
import Auth from "./pages/Auth";
import RegisterUser from "./pages/RegisterUser";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Main /> },
      { path: "/register", element: <Register /> },
      { path: "/auth", element: <Auth /> },
      { path: "/registerUser", element: <RegisterUser /> },
      { path: "/login", element: <Login /> },
    ],
  },
]);

export default router;
