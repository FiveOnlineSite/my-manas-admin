import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Spinner } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { postRequest } from "../../api/api";

const Register = () => {
  const [passState, setPassState] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const handleFormSubmit = async (formData)  => {
    setLoading(true);

    try {
      const response = await postRequest("/user/register", {
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        navigate(`${process.env.PUBLIC_URL}/`); // go to login page
      } else {
        console.error(response.message);
      }
    } catch (err) {
      console.error("Registration failed", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Head title='Register' />
      <Block className='nk-block-middle nk-auth-body  wide-xs'>
        <div className='brand-logo pb-4 text-center'>
          <Link to={`${process.env.PUBLIC_URL}/`} className='logo-link'>
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
            <BlockTitle tag='h4'>Register</BlockTitle>
            <BlockDes>
              <p>Create New Manas Foundation Account</p>
            </BlockDes>
          </BlockContent>
        </BlockHead>
        <form className='is-alter' onSubmit={handleSubmit(handleFormSubmit)}>
          <div className='form-group'>
            <div className='form-label-group'>
              <label className='form-label' htmlFor='default-01'>
                Email or Username
              </label>
            </div>
            <div className='form-control-wrap'>
              <input
                type='text'
                bssize='lg'
                id='default-01'
                {...register("email", { required: true })}
                className='form-control-lg form-control'
                placeholder='Enter your email address or username'
              />
              {errors.email && (
                <p className='invalid'>This field is required</p>
              )}
            </div>
          </div>
          <div className='form-group'>
            <div className='form-label-group'>
              <label className='form-label' htmlFor='password'>
                password
              </label>
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

                <Icon name='eye-off' className='password-icon icon-hide'></Icon>
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
              type='submit'
              color='primary'
              size='lg'
              className='btn-block'
            >
              {loading ? <Spinner size='sm' color='light' /> : "Register"}
            </Button>
          </div>
        </form>
        <div className='form-note-s2 text-center pt-4'>
          {" "}
          Already have an account?{" "}
          <Link to={`${process.env.PUBLIC_URL}/`}>
            <strong>Sign in instead</strong>
          </Link>
        </div>

        {/* </PreviewCard> */}
      </Block>
      {/* <AuthFooter /> */}
    </>
  );
};
export default Register;
