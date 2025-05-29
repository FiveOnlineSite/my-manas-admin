import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { vidhyaVanamGradeData } from "./vidhyaVanamGradeData";

export const VidhyaVanamGradeContext = createContext();

export const VidhyaVanamGradeContextProvider = (props) => {
  const [data, setData] = useState(vidhyaVanamGradeData);

  return (
    <VidhyaVanamGradeContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </VidhyaVanamGradeContext.Provider>
  );
};
