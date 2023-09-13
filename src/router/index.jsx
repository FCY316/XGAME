import React, { lazy, Suspense } from "react";
import LoadingPage from "./LoadingPage";
import { useRoutes } from "react-router-dom";
import Layout from "@/Layout";

const Home = lazy(
  async () => await import(/* webpackChunkName: "home" */ "@/pages/home")
);
const Game = lazy(
  async () => await import(/* webpackChunkName: "home" */ "@/pages/game")
);
const Country = lazy(
  async () => await import(/* webpackChunkName: "home" */ "@/pages/country")
);
const routeConfig = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/game",
        element: <Game />,
      },
      {
        path: "/country",
        element: <Country />,
      },
    ],
  },
];

const AppRouter = () => {
  const element = useRoutes(routeConfig);
  return <Suspense fallback={<LoadingPage />}>{element}</Suspense>;
};
export default AppRouter;
