import React from "react";
import LogoLight2x from "../../images/logomymanas.webp";
import LogoDark2x from "../../images/logomymanas.webp";
import LogoSmall from "../../images/logomymanas.webp";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
      <img className="logo-light logo-img" src={LogoLight2x} alt="logo" />
      <img className="logo-dark logo-img" src={LogoDark2x} alt="logo" />
      <img className="logo-small logo-img logo-img-small" src={LogoSmall} alt="logo" />
    </Link>
  );
};

export default Logo;
