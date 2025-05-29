import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { facilitiesData } from "./facilitiesData";

export const FacilitiesContext = createContext();

export const FacilitiesContextProvider = (props) => {
  const [data, setData] = useState(facilitiesData);

  return (
    <FacilitiesContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </FacilitiesContext.Provider>
  );
};
