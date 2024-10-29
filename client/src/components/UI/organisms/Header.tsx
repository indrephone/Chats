import styled from 'styled-components';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const StyledHeader = styled.header`
   height: 100px;
   padding: 0 20px;
   display: flex;
   justify-content: space-between;
   align-items: center;
`;

const Header = () => {
    return ( 
        <StyledHeader>
            <nav>
                <ul>
                   <li><NavLink to="/conversations">
                      <img src="/chat_white.svg" alt="chat button" /></NavLink></li>


                   <li><NavLink to="/users">
                     <img src="star_white.svg" alt="users button" /></NavLink></li>
                </ul>
            </nav>

            <div>
                <img src="https://upload.wikimedia.org/wikipedia/en/b/b2/Pluto_%28Disney%29_transparent.png"
                alt="user profile picture"
                 />
                <span>Username</span> 
                <button
                  onClick={() => {
                    setLoggedInUser('');
                    navigate('/login');
                  }}
                  >Log Out</button>
            </div>
            
        </StyledHeader>
     );
}
 
export default Header;
