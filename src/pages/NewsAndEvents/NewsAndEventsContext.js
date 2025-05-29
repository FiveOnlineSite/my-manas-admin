import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { newsAndEventsData } from "./newsAndEventsData";

export const NewsAndEventsContext = createContext();

export const NewsAndEventsContextProvider = (props) => {
  const [data, setData] = useState(newsAndEventsData);

  return (
    <NewsAndEventsContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </NewsAndEventsContext.Provider>
  );
};
