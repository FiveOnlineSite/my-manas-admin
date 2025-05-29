import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { vidhyaVanamAchievementsData } from "./vidhyaVanamAchievementsData";

export const VidhyaVanamAchievementsContext = createContext();

export const VidhyaVanamAchievementsContextProvider = (props) => {
  const [data, setData] = useState(vidhyaVanamAchievementsData);

  return (
    <VidhyaVanamAchievementsContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </VidhyaVanamAchievementsContext.Provider>
  );
};
