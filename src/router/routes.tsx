import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loading from "../components/loading";

const Signup = lazy(() => import("../pages/Signup"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const Layout = lazy(() => import("../components/Layout"));
const Login = lazy(() => import("../pages/Login"));
const Profile = lazy(() => import("../pages/profile"));
const RequireAuth = lazy(() => import("../components/RequireAuth"));
const GamePanel = lazy(() => import("../pages/game"));
const CreateGame = lazy(() => import("../pages/newGame"));
const Room = lazy(() => import("../pages/room"));
const Chat = lazy(() => import("../pages/chat"));
const Trust = lazy(() => import("../pages/trust"));
const Rules = lazy(() => import("../pages/rules"));
const Rating = lazy(() => import("../pages/rating"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "*",
        element: <Suspense fallback={<Loading />}><ErrorPage></ErrorPage></Suspense>,
      },
      {
        path: "signup",
        element: <Suspense fallback={<Loading />}><Signup></Signup></Suspense>,

      }, {
        path: "login",
        element: <Suspense fallback={<Loading />}><Login /></Suspense>,

      }, {
        path: "profile",
        element: <Suspense fallback={<Loading />}><RequireAuth>
          <Profile />
        </RequireAuth></Suspense>,

      }, {
        index: true,
        element: <Suspense fallback={<Loading />}><RequireAuth>
          <GamePanel />
        </RequireAuth></Suspense>,

      }, {
        path: "createNewGame",
        element: <Suspense fallback={<Loading />}><RequireAuth>
          <CreateGame />
        </RequireAuth></Suspense>,

      }, {
        path: "room/:roomId",
        element:
          <Suspense fallback={<Loading />}><RequireAuth>
            <Room />
          </RequireAuth></Suspense>,
      }, {
        path: "chat",
        element: <Suspense fallback={<Loading />}><Chat /></Suspense>,
      }, {
        path: "buymeacoffe",
        element: <Suspense fallback={<Loading />}><Trust /></Suspense>,
      }, {
        path: "rules",
        element: <Suspense fallback={<Loading />}><Rules /></Suspense>,
      }, {
        path: "rating",
        element: <Suspense fallback={<Loading />}><Rating /></Suspense>,
      }
    ]
  }
]);

export default router;