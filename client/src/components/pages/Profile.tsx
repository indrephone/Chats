import { useContext} from 'react';
import UsersContext,{ UsersContextTypes } from '../../contexts/UsersContext';
import styled from 'styled-components';
import { StyledHeader } from '../styles/AllPageStyles';

const ProfileStyle = styled.section`
  display: flex;
  flex-direction:column;
  align-items: center;
  padding: 20px;
  text-align: center;
`;
const YourImage = styled.img`
  max-height: 200px;
  max-width: 400px;
  min-height: 100px;
  min-width: 100px;
  object-fit: contain;
  border: 1px solid #000;
  border-radius: 50%;
`;


const Profile = () => {
   const { loggedInUser } = useContext(UsersContext) as UsersContextTypes;

   if(!loggedInUser) return <p>Loading...</p>;

    return ( 
        <ProfileStyle>
            <StyledHeader>Welcome to the Chat Palace!</StyledHeader>
            <h3>{loggedInUser.username}</h3>
            <YourImage 
               src={loggedInUser.profileImage || "/default_profile_image.svg"} 
               alt={`${loggedInUser.username}'s profile`} />
        </ProfileStyle>
     );
}
 
export default Profile;