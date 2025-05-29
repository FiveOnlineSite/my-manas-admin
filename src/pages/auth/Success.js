import React from "react";
import LogoDark2x from "../../images/logomymanas.webp";
import LogoLight2x from "../../images/logomymanas.webp";
import Head from "../../layout/head/Head";
// import AuthFooter from "./AuthFooter";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle } from "../../components/Component";
import { Link } from "react-router-dom";
import {Button} from "../../components/Component";

const Success = () => {
  return (
    <>
      <Head title='Success' />
      <Block className='nk-block-middle nk-auth-body'>
        <div className='brand-logo pb-5'>
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
        <BlockHead>
          <BlockContent>
            <BlockTitle tag='h4'>Thank you for submitting form</BlockTitle>
            <BlockDes className='text-success'>
              <p>You can now sign in with your new password</p>
              <Link to={`${process.env.PUBLIC_URL}/login`}>
                <Button color='primary' size='lg'>
                  Back to Login
                </Button>
              </Link>
            </BlockDes>
          </BlockContent>
        </BlockHead>
      </Block>
      {/* <AuthFooter /> */}
    </>
  );
};
export default Success;
