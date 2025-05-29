import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { leadershipTeamData } from "./leadershipTeamData";

export const LeadershipTeamContext = createContext();

export const LeadershipTeamContextProvider = (props) => {
  const [data, setData] = useState(leadershipTeamData);

  return (
    <LeadershipTeamContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </LeadershipTeamContext.Provider>
  );
};
