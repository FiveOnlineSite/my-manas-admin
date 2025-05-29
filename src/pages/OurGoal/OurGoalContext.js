import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { ourGoalData } from "./ourGoalData";

export const OurGoalContext = createContext();

export const OurGoalContextProvider = (props) => {
  const [data, setData] = useState(ourGoalData);

  return (
    <OurGoalContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </OurGoalContext.Provider>
  );
};
