import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { gradeData } from "./gradeData";

export const GradeContext = createContext();

export const GradeContextProvider = (props) => {
  const [data, setData] = useState(gradeData);

  return (
    <GradeContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </GradeContext.Provider>
  );
};
