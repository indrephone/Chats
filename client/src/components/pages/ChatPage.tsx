import { useContext, useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import MessagesContext, { MessageType, MessagesContextTypes } from '../../contexts/MessagesContext';
import UsersContext from '../../contexts/UsersContext';
import ConversationsContext, { ConversationsContextTypes } from '../../contexts/ConversationsContext';
import MessageList from '../UI/molecules/MessageList';  // Component for displaying list of messages
import MessageInput from "../UI/atoms/MessageInput"; // Component for message input
import { StyledHeader } from '../styles/AllPageStyles';


// Define a type for creating a new message without `_id`
type NewMessageType = Omit<MessageType, '_id'>;

const ChatContainer = styled.section`
    display: flex;
    flex-direction: column;
    height: 80vh;
    /* background-color: #f5f5f5; */
    background-color: #6d6565;
    /* background-image: url('/message_background1.png');
    background-size: cover;       
    background-position: center;  
    background-repeat: no-repeat; */
    padding: 10px 30px;
`;

const MessageListContainer = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
`;

const MessageInputContainer = styled.div`
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
`;

const ChatPage = () => {
    const { conversationId } = useParams<{ conversationId: string }>(); // Get conversationId from URL parameters
     const messagesContext = useContext(MessagesContext) as MessagesContextTypes;
     const usersContext = useContext(UsersContext);
     const conversationsContext = useContext(ConversationsContext) as ConversationsContextTypes;

     const [newMessage, setNewMessage] = useState("");

       // Fetch messages for the current conversation on component load or conversation change
       useEffect(() => {
        if ( conversationId && conversationsContext) {
            const { setActiveConversation } = conversationsContext;
            setActiveConversation(conversationId); // Set the active conversation in context
            // console.log("Setting active conversation ID:", conversationId); 
            messagesContext?.getMessagesByConversationId(conversationId); // Fetch messages for this conversation
        }
    }, [conversationId, conversationsContext, messagesContext]);


     if (!usersContext || !conversationsContext  || !usersContext.loggedInUser) {
        //   console.error("UsersContext or ConversationsContext  is not provided.");
          return null; // Handle missing context 
      }
  
 
     const {users, loggedInUser }  = usersContext;
     const { activeConversationId, conversations } = conversationsContext;
     const { postMessage } = messagesContext;

    
       const messages = messagesContext?.messages.filter(msg => msg.conversationId === conversationId) || [];
    //    console.log("Filtered messages for conversationId:", conversationId, messages); 

       // Find the conversation using activeConversationId
    const currentConversation = conversations.find(convo => convo._id === activeConversationId);

    // Identify the chat partner
    const chatPartnerId = currentConversation
        ? (currentConversation.user1 === loggedInUser._id ? currentConversation.user2 : currentConversation.user1)
        : null;

    const chatPartner = users.find(user => user._id === chatPartnerId);
    
     // Handler for sending a new message to the backend
     const handleSendMessage = () => {
        //   console.log("Conversation ID in handleSendMessage:", conversationId); 
          if (postMessage && activeConversationId && loggedInUser) {
              const message: NewMessageType = {
                  conversationId : activeConversationId,
                  senderId: loggedInUser._id,  // Replace with the actual logged-in user ID
                  content: newMessage,
                  timestamp: new Date().toISOString(),
                  likes: []
              };
              postMessage(message);  // postMessage sends this to the backend
              setNewMessage("");
          } else {
               console.error("Missing conversationId, postMessage function, or loggedInUser.");
           }
      };
 
    return ( 
        <ChatContainer>
             <StyledHeader> Chat Page with
                {chatPartner && (
                     <span style={{ marginLeft: '10px', display: 'inline-flex', alignItems: 'center' }}>
                         <img 
                             src={chatPartner.profileImage || "/default_profile_image.svg"} 
                             alt={chatPartner.username} 
                             style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '5px' }}
                         />
                         {chatPartner.username}
                     </span>
                )}
            </StyledHeader>
            <MessageListContainer>
                  <MessageList messages={messages} users={users} loggedInUserId={loggedInUser._id}/>
             </MessageListContainer>
             <MessageInputContainer>
                 <MessageInput
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onSendMessage={handleSendMessage}
                 />
                </MessageInputContainer>
        </ChatContainer>
     );
}
 
export default ChatPage;