import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { scholarshipAwardessData } from "./scholarshipAwardeesData";

export const ScholarshipAwardeesContext = createContext();

export const ScholarshipAwardeesContextProvider = (props) => {
  const [data, setData] = useState(scholarshipAwardessData);

  return (
    <ScholarshipAwardeesContext.Provider
      value={{ contextData: [data, setData] }}
    >
      <Outlet />
    </ScholarshipAwardeesContext.Provider>
  );
};
