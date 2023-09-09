import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';

function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <div className="nav">
      <Link to="/user">
        <img className="pink-logo" src='../images/pink-meeboard-logo.png'/>
      </Link>
      <div>
        <Link className="navLink" to="/tutorial">
          Tutorial
        </Link>
        {!user.id && (
          <Link className="navLink" to="/login">
            Login / Register
          </Link>
        )}
        {user.id && (
            <>
            <LogOutButton className="navLink" />
          </>
        )}
      </div>
    </div>
  );
}

export default Nav;
