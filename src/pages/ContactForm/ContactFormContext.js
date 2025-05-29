import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { contactFormData } from "./contactFormData";

export const ContactFormContext = createContext();

export const ContactFormContextProvider = (props) => {
  const [data, setData] = useState(contactFormData);

  return (
    <ContactFormContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </ContactFormContext.Provider>
  );
};
