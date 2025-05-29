import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { appTimelineData } from "./appTimelineData";

export const AppTimelineContext = createContext();

export const AppTimelineContextProvider = (props) => {
  const [data, setData] = useState(appTimelineData);

  return (
    <AppTimelineContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </AppTimelineContext.Provider>
  );
};
