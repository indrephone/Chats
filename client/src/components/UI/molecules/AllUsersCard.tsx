import { CardLink, CardDiv, ProfileImage, Username } from '../../styles/Cardstyles';
import {  UserType } from '../../../contexts/UsersContext';

type Props ={
    data: UserType;
    userId:string;
}

const AllUsersCard = ({data, userId } : Props) => {
    return ( 

        <CardLink to={`/user/${userId}`} style={{ textDecoration: 'none' }}> 
           <CardDiv>
            <ProfileImage 
                src={data.profileImage || "/default_profile_image.svg"}
                alt={data.username}
                />
            <Username>{data.username}</Username>
           </CardDiv>
        </CardLink>
     );
}
 
export default AllUsersCard;