import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { ourMissionData } from "./ourMissionData";

export const OurMissionContext = createContext();

export const OurMissionContextProvider = (props) => {
  const [data, setData] = useState(ourMissionData);

  return (
    <OurMissionContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </OurMissionContext.Provider>
  );
};
