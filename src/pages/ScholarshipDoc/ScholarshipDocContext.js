import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { scholarshipDocData } from "./scholarshipDocData";

export const ScholarshipDocContext = createContext();

export const ScholarshipDocContextProvider = (props) => {
  const [data, setData] = useState(scholarshipDocData);

  return (
    <ScholarshipDocContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </ScholarshipDocContext.Provider>
  );
};
