import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UsersContext, { UsersContextTypes } from '../../../contexts/UsersContext';

const StyledHeader = styled.header`
   height: 100px;
   padding: 0 20px;
   display: flex;
   justify-content: space-between;
   align-items: center;

   nav ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-right: 15px;

      &:first-child a {
        img {
          width: 40px;
          height: 40px;
        }

        &:hover img,
        &:focus img,
        &.active img {
          content: url('/chat_black.svg');
        }
      }

      &:nth-child(2) a {
        img {
          width: 40px;
          height: 40px;
        }

        &:hover img,
        &:focus img,
        &.active img {
          content: url('/star_black.svg');
        }
      }
    }
  }

  .user-info {
    display: flex;
    align-items: center;

    .profile-link img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 10px;
      cursor: pointer;
    }

    .username-link {
      font-size: 18px;
      margin-right: 10px;
      /* text-decoration: none; */
      color: inherit;
      cursor: pointer;
    }

    button {
      padding: 5px 10px;
      font-size: 16px;
      cursor: pointer;
    }
  }

`;

const Header = () => {
  const { loggedInUser, logout } = useContext(UsersContext) as UsersContextTypes;
  const navigate = useNavigate();

  return ( 
    <StyledHeader>
      <nav>
        <ul>
          <li>
            <NavLink to="/conversations">
              <img src="/chat_white.svg" alt="chat button" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/users">
              <img src="/star_white.svg" alt="users button" />
            </NavLink>
          </li>
        </ul>
      </nav>

      {loggedInUser ? (
        <div className="user-info">
           <NavLink to="/profile" className="profile-link"> 
          <img 
            src={loggedInUser.profileImage || "/default_profile_image.svg"} 
            alt="user profile image" 
          />
          </NavLink> 
          
          <NavLink to={`/edit/${loggedInUser._id}`} className="username-link">
            {loggedInUser.username}
          </NavLink>

           
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
          > Sign Out
          </button>
        </div>
      ) : (
        <div>
          <NavLink to="/login">Log In</NavLink>
        </div>
      )}
    </StyledHeader>
  );
};

export default Header;
