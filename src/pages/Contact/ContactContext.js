import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { contactData } from "./contactData";

export const ContactContext = createContext();

export const ContactContextProvider = (props) => {
  const [data, setData] = useState(contactData);

  return (
    <ContactContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </ContactContext.Provider>
  );
};
