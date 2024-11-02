import styled from 'styled-components';

import { UserType } from '../../../contexts/UsersContext';
import { ConversationType } from '../../../contexts/ConversationsContext';

type Props ={
    data: ConversationType & {
        userData?: UserType;
    }
}

const AllConversationsCard = ({ data }: Props) => {
    return ( 
        <div>
        <img 
           src={data.userData?.profileImage || "/default_profile_image.svg"}
           alt={data.userData?.username || "User"}
        />
        <span>{data.userData?.username || "Unknown User"}</span>
      </div>
     );
}
 
export default AllConversationsCard;