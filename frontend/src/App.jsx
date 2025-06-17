import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUP from "./pages/SignUP";
import MainLayout from "./components/MainLayout";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: `/profile/:id`,
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: `/account/edit`,
          element: (
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/signup",
      element: <SignUP />,
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
