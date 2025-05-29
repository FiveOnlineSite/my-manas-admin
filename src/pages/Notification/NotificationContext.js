import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { notificationData } from "./notificationData";

export const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [data, setData] = useState(notificationData);

  return (
    <NotificationContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </NotificationContext.Provider>
  );
};
