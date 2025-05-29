import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { scholarshipOverviewData } from "./scholarshipOverviewData";

export const ScholarshipOverviewContext = createContext();

export const ScholarshipOverviewContextProvider = (props) => {
  const [data, setData] = useState(scholarshipOverviewData);

  return (
    <ScholarshipOverviewContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </ScholarshipOverviewContext.Provider>
  );
};
