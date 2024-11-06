import { useContext} from 'react';
import UsersContext,{ UsersContextTypes } from '../../contexts/UsersContext';

import { StyledHeader, ProfileSection, ProfileImage, StyledUserNameHeader} from '../styles/AllPageStyles';



const Profile = () => {
   const { loggedInUser } = useContext(UsersContext) as UsersContextTypes;

   if(!loggedInUser) return <p>Loading...</p>;

    return ( 
        <ProfileSection>
            <StyledHeader>Welcome to the Chat Palace!</StyledHeader>
            <StyledUserNameHeader>{loggedInUser.username}</StyledUserNameHeader>
            <ProfileImage 
               src={loggedInUser.profileImage || "/default_profile_image.svg"} 
               alt={`${loggedInUser.username}'s profile`} />
        </ProfileSection>
     );
}
 
export default Profile;