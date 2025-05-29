import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { donateAchievementsData } from "./DonateAchievementsData";

export const DonateAchievementsContext = createContext();

export const DonateAchievementsContextProvider = (props) => {
  const [data, setData] = useState(donateAchievementsData);

  return (
    <DonateAchievementsContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </DonateAchievementsContext.Provider>
  );
};
