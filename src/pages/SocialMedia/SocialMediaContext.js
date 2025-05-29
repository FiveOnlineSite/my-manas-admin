import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { socialMediaLinksData } from "./socialMediaData";

export const SocialMediaLinksContext = createContext();

export const SocialMediaLinksContextProvider = (props) => {
  const [data, setData] = useState(socialMediaLinksData);

  return (
    <SocialMediaLinksContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </SocialMediaLinksContext.Provider>
  );
};
