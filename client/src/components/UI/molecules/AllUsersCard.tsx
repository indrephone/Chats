import { Link } from 'react-router-dom';
import styled from 'styled-components';

import {  UserType } from '../../../contexts/UsersContext';

type Props ={
    data: UserType;
}


const CardDiv = styled.div`
  
`;

const AllUsersCard = ({data} : Props) => {
    return ( 
        <CardDiv>
            <img 
              src={data.profileImage || "/default_profile_image.svg"}
              alt={data.username}
              />
              <h3>{data.username}</h3>
        </CardDiv>
     );
}
 
export default AllUsersCard;