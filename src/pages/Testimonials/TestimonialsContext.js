import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { testimonialsData } from "./testimonialsData";

export const TestimonialsContext = createContext();

export const TestimonialsContextProvider = (props) => {
  const [data, setData] = useState(testimonialsData);

  return (
    <TestimonialsContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </TestimonialsContext.Provider>
  );
};
