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
        <div>
          <img 
            src={loggedInUser.profileImage} 
            alt="user profile image" 
          />
          <span>{loggedInUser.username}</span> 
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Log Out
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
