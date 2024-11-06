import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ConversationsContext, { ConversationsContextTypes } from '../../contexts/ConversationsContext';
import UsersContext, { UsersContextTypes } from '../../contexts/UsersContext';
import AllConversationsCard from '../UI/molecules/AllConversationsCard';
import DeleteConversationButton from '../UI/organisms/DeleteConversationsButton';
import { StyledHeader , StyledSectionForLists} from '../styles/AllPageStyles';


const UnreadIndicator = styled.span`
  color: red;
  font-weight: bold;
  margin-left: 8px;
`;
const StyleNewDeletDiv = styled.div`
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  gap: 10px;
`;


const Conversations = () => {
   const { conversations,  setActiveConversation  } = useContext(ConversationsContext) as ConversationsContextTypes;
   console.log("Conversations from context:", conversations);

   const { users } = useContext(UsersContext) as UsersContextTypes;
   const navigate = useNavigate();

   // Retrieve the logged-in user’s ID from localStorage
   const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
   const userId = loggedInUser?._id;

  // Filter conversations to only show those for the logged-in user
  const filteredConversations = conversations
  .filter(conversation => conversation.user1 === userId || conversation.user2 === userId)
  .map(conversation => {
      const otherUserId = conversation.user1 === userId ? conversation.user2 : conversation.user1;
      const otherUser = users.find(user => user._id === otherUserId);

      return { ...conversation, userData: otherUser }; // `userData` as a single UserType
  });

  const chooseConversationIfExists = (conversationId: string) => {
       setActiveConversation(conversationId);
       navigate(`/chat/${conversationId}`);
  }


    return ( 
        <StyledSectionForLists>
            <StyledHeader>Conversations</StyledHeader>
            <div>
                {filteredConversations.length > 0 ? (
                   filteredConversations.map(conversation => (
                      <StyleNewDeletDiv key={conversation._id} style={{ display: 'flex', alignItems: 'center' }}>
                        <AllConversationsCard
                           data={conversation}
                           onClick={() => chooseConversationIfExists(conversation._id)}
                        />
                    {conversation.hasUnreadMessages && <UnreadIndicator>New</UnreadIndicator>}
                    <DeleteConversationButton conversationId={conversation._id} />
                   </StyleNewDeletDiv>
                   ))
                ) : (
                    <p>Choose another user to start a conversation.</p>
                )}
            </div>
            
        </StyledSectionForLists>
     );
}
 
export default Conversations;