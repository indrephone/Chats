import { useContext } from 'react';
import styled from 'styled-components';


import UsersContext, { UsersContextTypes} from '../../contexts/UsersContext';
import AllUsersCard from '../UI/molecules/AllUsersCard';

const StyledSection = styled.section`
  padding: 10px 30px;
`;

const AllUsers = () => {

    const { users } = useContext(UsersContext) as UsersContextTypes;

    return ( 
        <StyledSection>
            <h2>All Users</h2>
            <div>
                {users.map(user =>
                    <AllUsersCard
                      key={user._id}
                      data={user}
                    />  
                )}
            </div>
        </StyledSection>
     );
}
 
export default AllUsers;
