import {  ProfileImage, Username } from '../../styles/Cardstyles';
import styled from 'styled-components';
import { UserType } from '../../../contexts/UsersContext';
import { ConversationType } from '../../../contexts/ConversationsContext';

type Props ={
    data: ConversationType & {
        userData?: UserType;
    };
    onClick: () => void;
};

const CardDivNoBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background-color: #492f2f;
  cursor: pointer;
`;
const AllConversationsCard = ({ data, onClick }: Props) => {
    return ( 
        <CardDivNoBottom onClick={onClick} >
        <ProfileImage 
           src={data.userData?.profileImage || "/default_profile_image.svg"}
           alt={data.userData?.username || "User"}
        />
        <Username>{data.userData?.username || "Unknown User"}</Username>
      </CardDivNoBottom>
     );
}
 
export default AllConversationsCard;