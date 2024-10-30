import { Link } from 'react-router-dom';
import styled from 'styled-components';

import {  UserType } from '../../../contexts/UsersContext';

type Props ={
    data: UserType;
}
const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const CardDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  span {
    font-size: 16px;
    font-weight: normal;
    margin: 0;
  }
`;

const AllUsersCard = ({data} : Props) => {
    return ( 

        <CardLink to={`/userPage/${data._id}`}> 
           <CardDiv>
            <img 
                src={data.profileImage || "/default_profile_image.svg"}
                alt={data.username}
                />
            <span>{data.username}</span>
           </CardDiv>
        </CardLink>
     );
}
 
export default AllUsersCard;