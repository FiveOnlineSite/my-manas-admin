import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { quotesData } from "./quotesData";

export const QuotesContext = createContext();

export const QuotesContextProvider = (props) => {
  const [data, setData] = useState(quotesData);

  return (
    <QuotesContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </QuotesContext.Provider>
  );
};
