import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { vidhyavanamLeadershipData } from "./vidhyavanamLeadershipData";

export const VidhyavanamLeadershipContext = createContext();

export const VidhyavanamLeadershipContextProvider = (props) => {
  const [data, setData] = useState(vidhyavanamLeadershipData);

  return (
    <VidhyavanamLeadershipContext.Provider
      value={{ contextData: [data, setData] }}
    >
      <Outlet />
    </VidhyavanamLeadershipContext.Provider>
  );
};
