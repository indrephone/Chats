import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext} from 'react';
import { UserType } from '../../contexts/UsersContext';
import styled from 'styled-components';
import ConversationsContext, { ConversationsContextTypes} from '../../contexts/ConversationsContext';
import { StyledHeader, ProfileSection, ProfileImage, StyledUserNameHeader } from '../styles/AllPageStyles';


const StartConversationButton = styled.img`
  cursor: pointer;
  width: 200px;
  height: 100px;
  margin-top: 20px;

  &:hover {
    content: url('/start_conversation_active.svg');
  }

  &:active {
    content: url('/start_conversation_active.svg');
  }
`;

const UserPage = () => {
    const [user, setUser] = useState<UserType | null>(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { startOrGetConversation } = useContext(ConversationsContext) as ConversationsContextTypes;
    
    useEffect(() => {
        if (id) {
            fetch(`/api/users/${id}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch user data");
                    }
                    return res.json();
                })
                .then(data => setUser(data))
                .catch(error => console.error("Error fetching user:", error));
        }
    }, [id]);

    const handleStartConversation = async () => {
        if (id) {
            const conversationId = await startOrGetConversation(id);
            if (conversationId) {
                navigate(`/chat/${conversationId}`);
            }
        }
    };


    if (!user) {
        return <p>Loading user data...</p>;
    }

    return ( 
        <ProfileSection>
            <StyledHeader>User Profile</StyledHeader>
               <StyledUserNameHeader>Username: {user.username}</StyledUserNameHeader>
               <ProfileImage
                  src={user.profileImage || "/default_profile_image.svg"} 
                  alt={`${user.username}'s profile`} 
                />
               <StartConversationButton 
                  src="/start_conversation.svg" 
                  alt="Start Conversation" 
                  onClick={handleStartConversation}
               />  
        </ProfileSection>
     );
}
 
export default UserPage;
                 
        
       
             
       