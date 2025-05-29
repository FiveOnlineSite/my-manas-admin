import React, { useEffect, useState } from "react";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { Icon } from "../../../../components/Component";
import { LinkList, LinkItem } from "../../../../components/links/Links";
import UserAvatar from "../../../../components/user/UserAvatar";

const User = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setEmail(parsed.email || "");
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }
  }, []);

  const handleSignout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = `${process.env.PUBLIC_URL}/`;
  };

  return (
    <Dropdown isOpen={open} className='user-dropdown' toggle={toggle}>
      <DropdownToggle
        tag='a'
        href='#toggle'
        className='dropdown-toggle'
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className='user-toggle'>
          <UserAvatar icon='user-alt' className='sm' />
          <div className='user-info d-none d-md-block'>
            <div className='user-status'>Administrator</div>
            <div className='user-name dropdown-indicator'>{email}</div>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu end className='dropdown-menu-md dropdown-menu-s1'>
        <div className='dropdown-inner user-card-wrap bg-lighter d-none d-md-block'>
          <div className='user-card sm'>
            <div className='user-avatar'>
              <span>A</span>
            </div>
            <div className='user-info'>
              {/* <span className='lead-text'>Abu Bin Ishtiyak</span> */}
              <span className='sub-text'>{email}</span>
            </div>
          </div>
        </div>
       
        <div className='dropdown-inner'>
          <LinkList>
            <a href={`${process.env.PUBLIC_URL}/`} onClick={handleSignout}>
              <Icon name='signout'></Icon>
              <span>Sign Out</span>
            </a>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
