import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./routes/homePage/Homepage";
import DashBoard from "./routes/dashBoard/DashBoard";
import Chatpage from "./routes/chatPage/ChatPage";
import RouteLayout from "./layout/RootLayout/RouteLayout";
import DashBoardLayout from "./layout/dashBoardLayout/DashBoardLayout";
import SignInpage from "./routes/signIn/SignIn";
import SignUpPage from "./routes/signup/SignUp";

function App() {
  const router = createBrowserRouter([
    {
      element: <RouteLayout />,
      children: [
        {
          path: "/",
          element: <Homepage />,
        },
        {
          path: "/sign-in/*",
          element: <SignInpage />,
        },
        {
          path: "/sign-up",
          element: <SignUpPage />,
        },
        {
          element: <DashBoardLayout />,
          children: [
            {
              path: "dashboard",
              element: <DashBoard />,
            },
            {
              path: "dashboard/chats/:id",
              element: <Chatpage />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
