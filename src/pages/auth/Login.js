import React, { useState } from "react";
import LogoDark2x from "../../images/logomymanas.webp";
import LogoLight2x from "../../images/logomymanas.webp";

import Head from "../../layout/head/Head";
// import AuthFooter from "./AuthFooter";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../components/Component";
import { Form, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { postRequest } from "../../api/api";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");
  const navigate = useNavigate();

  const onFormSubmit = async (formData) => {
    setLoading(true);
    setError("");

    try {
      const response = await postRequest("/user/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ email: response.data.user.email })
        );
        navigate("/");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      <Head title='Login' />
      <Block className='nk-block-middle nk-auth-body login  wide-xs'>
        <div>
          <div className='brand-logo pb-4 text-center'>
            <Link to={process.env.PUBLIC_URL + "/"} className='logo-link'>
              <img
                className='logo-light logo-img logo-img-lg'
                src={LogoLight2x}
                alt='logo'
              />
              <img
                className='logo-dark logo-img logo-img-lg'
                src={LogoDark2x}
                alt='logo-dark'
              />
            </Link>
          </div>

          {/* <PreviewCard className="card-bordered" bodyClass="card-inner-lg"> */}
          <BlockHead>
            <BlockContent>
              <BlockTitle tag='h4'>Sign-In</BlockTitle>
              <BlockDes>
                <p>Access Manas Foundation using your email and password.</p>
              </BlockDes>
            </BlockContent>
          </BlockHead>
          {errorVal && (
            <div className='mb-3'>
              <Alert color='danger' className='alert-icon'>
                <Icon name='alert-circle' /> Unable to login with credentials{" "}
              </Alert>
            </div>
          )}
          <Form className='is-alter' onSubmit={handleSubmit(onFormSubmit)}>
            <div className='form-group'>
              <div className='form-label-group'>
                <label className='form-label' htmlFor='default-01'>
                  Email or Username
                </label>
              </div>
              <div className='form-control-wrap'>
                <input
                  type='text'
                  id='email'
                  {...register("email", { required: "This field is required" })}
                  placeholder='Enter your email address or username'
                  className='form-control-lg form-control'
                />
                {errors.name && (
                  <span className='invalid'>{errors.name.message}</span>
                )}
              </div>
            </div>
            <div className='form-group'>
              <div className='form-label-group'>
                <label className='form-label' htmlFor='password'>
                  password
                </label>
                {/* <Link
                className='link link-primary link-sm'
                to={`${process.env.PUBLIC_URL}/auth-reset`}
              >
                Forgot Code?
              </Link> */}
              </div>
              <div className='form-control-wrap'>
                <a
                  href='#password'
                  onClick={(ev) => {
                    ev.preventDefault();
                    setPassState(!passState);
                  }}
                  className={`form-icon lg form-icon-right password-switch ${
                    passState ? "is-hidden" : "is-shown"
                  }`}
                >
                  <Icon name='eye' className='password-icon icon-show'></Icon>

                  <Icon
                    name='eye-off'
                    className='password-icon icon-hide'
                  ></Icon>
                </a>
                <input
                  type={passState ? "text" : "password"}
                  id='password'
                  {...register("password", {
                    required: "This field is required",
                  })}
                  placeholder='Enter your password'
                  className={`form-control-lg form-control ${
                    passState ? "is-hidden" : "is-shown"
                  }`}
                />
                {errors.password && (
                  <span className='invalid'>{errors.password.message}</span>
                )}
              </div>
            </div>
            <div className='form-group'>
              <Button
                size='lg'
                className='btn-block'
                type='submit'
                color='primary'
              >
                {loading ? <Spinner size='sm' color='light' /> : "Sign in"}
              </Button>
            </div>
          </Form>
          {/* <div className='form-note-s2 text-center pt-4'>
          New on our platform?{" "}
          <Link to={`${process.env.PUBLIC_URL}/auth-register`}>
            Create an account
          </Link>
        </div> */}
        </div>
        {/* </PreviewCard> */}
      </Block>
      {/* <AuthFooter /> */}
    </>
  );
};
export default Login;
