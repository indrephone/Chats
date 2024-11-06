import { useContext } from 'react';

import UsersContext, { UsersContextTypes} from '../../contexts/UsersContext';
import AllUsersCard from '../UI/molecules/AllUsersCard';

import { StyledHeader, StyledSectionForLists } from '../styles/AllPageStyles';


const AllUsers = () => {

const { users, loggedInUser } = useContext(UsersContext) as UsersContextTypes;

// Filter out the logged-in user from the users list
  const filteredUsers = users.filter(user => user._id !== loggedInUser?._id);

    return ( 
        <StyledSectionForLists>
             <StyledHeader>All Users</StyledHeader>
            <div>
                   {filteredUsers.map(user =>
                    <AllUsersCard
                      key={user._id}
                      data={user}
                      userId={user._id}
                    />  
                
                )}
            </div>
        </StyledSectionForLists>
     );
}
 
export default AllUsers;
