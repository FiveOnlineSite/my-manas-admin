import React, { useState } from "react";
import { putData, putRequest } from "../../api/api"; // use your common API method
import LogoDark2x from "../../images/logomymanas.webp";
import LogoLight2x from "../../images/logomymanas.webp";
import Head from "../../layout/head/Head";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
} from "../../components/Component";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const payload = {
      oldPassword,
      newPassword,
    };

    const response = await putRequest("/user/change-password", payload);

    if (response.success) {
        toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
       navigate("/")
    } else {
      setError(response.message);
    }

    setLoading(false);
  };

  return (
    <>
      <Head title="Change Password" />
      <Block className="nk-block-middle nk-auth-body wide-xs">
        <div className="brand-logo pb-4 text-center">
          <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
            <img className="logo-light logo-img logo-img-lg" src={LogoLight2x} alt="logo" />
            <img className="logo-dark logo-img logo-img-lg" src={LogoDark2x} alt="logo-dark" />
          </Link>
        </div>

        <BlockHead>
          <BlockContent>
            <BlockTitle tag="h4">Change Password</BlockTitle>
            <BlockDes>
              <p>Enter your current and new password below.</p>
            </BlockDes>
          </BlockContent>
        </BlockHead>

        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <Button color="primary" size="lg" className="btn-block" type="submit">
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </div>

          {message && <div className="alert alert-success text-center">{message}</div>}
          {error && <div className="alert alert-danger text-center">{error}</div>}
        </form>

        <div className="form-note-s2 text-center pt-4">
          <Link to={`${process.env.PUBLIC_URL}/`}>
            <strong>Back to Dashboard</strong>
          </Link>
        </div>
      </Block>
    </>
  );
};

export default ChangePassword;
