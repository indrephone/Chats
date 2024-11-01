import { useContext } from 'react';
import styled from 'styled-components';

import ConversationsContext, { ConversationsContextTypes } from '../../contexts/ConversationsContext';
import UsersContext, { UsersContextTypes } from '../../contexts/UsersContext';
import AllConversationsCard from '../UI/molecules/AllConversationsCard';


const Conversations = () => {
   const { conversations } = useContext(ConversationsContext) as ConversationsContextTypes;
   const { users } = useContext(UsersContext) as UsersContextTypes;

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


    return ( 
        <section>
            <h2>Conversations</h2>
            <div>
                {filteredConversations.map(conversation =>
                    <AllConversationsCard
                        key={conversation._id}
                        data={conversation}
                    />
                )}
            </div>
            
        </section>
     );
}
 
export default Conversations;