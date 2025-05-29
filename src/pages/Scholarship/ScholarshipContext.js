import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { scholarshipData } from "./scholarshipData";

export const ScholarshipContext = createContext();

export const ScholarshipContextProvider = (props) => {
  const [data, setData] = useState(scholarshipData);

  return (
    <ScholarshipContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </ScholarshipContext.Provider>
  );
};
