import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { contactInfoData } from "./contactInfoData";

export const ContactInfoContext = createContext();

export const ContactInfoContextProvider = (props) => {
  const [data, setData] = useState(contactInfoData);

  return (
    <ContactInfoContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </ContactInfoContext.Provider>
  );
};
