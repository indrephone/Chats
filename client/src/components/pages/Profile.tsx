import { useContext} from 'react';
import UsersContext,{ UsersContextTypes } from '../../contexts/UsersContext';


const Profile = () => {
   const { loggedInUser } = useContext(UsersContext) as UsersContextTypes;

   if(!loggedInUser) return <p>Loading...</p>;

    return ( 
        <section>
            <h1>Profile - Welcome to the Chat Palace!</h1>
            <p>{loggedInUser.username}</p>
            <img src={loggedInUser.profileImage} alt={`${loggedInUser.username}'s profile`} />
        </section>
     );
}
 
export default Profile;