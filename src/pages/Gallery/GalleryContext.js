import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { galleryData } from "./galleryData";

export const GalleryContext = createContext();

export const GalleryContextProvider = (props) => {
  const [data, setData] = useState(galleryData);

  return (
    <GalleryContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </GalleryContext.Provider>
  );
};
