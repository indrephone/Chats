import { useContext, useState} from "react";
import MessagesContext, { MessageType, MessagesContextTypes } from '../../contexts/MessagesContext';
import UsersContext from '../../contexts/UsersContext';
import ConversationsContext, { ConversationsContextTypes } from '../../contexts/ConversationsContext';
import MessageList from '../UI/atoms/MessageList';  // Component for displaying list of messages
import MessageInput from "../UI/atoms/MessageInput"; // Component for message input

type ChatPageProps = {
     conversationId: string;
 };
// Define a type for creating a new message without `_id`
type NewMessageType = Omit<MessageType, '_id'>;

const ChatPage = ( { conversationId }: ChatPageProps) => {
    
     const messagesContext = useContext(MessagesContext) as MessagesContextTypes;
     const usersContext = useContext(UsersContext);
     const conversationsContext = useContext(ConversationsContext) as ConversationsContextTypes;

     const [newMessage, setNewMessage] = useState("");

     if (!usersContext || !conversationsContext) {
          console.error("UsersContext or ConversationsContext  is not provided.");
          return null; // Handle missing context 
      }
  
 
     const {users, loggedInUser }  = usersContext;
     const { activeConversationId } = conversationsContext;

     const messages = messagesContext?.getMessagesByConversationId(activeConversationId || "") || [];
     const postMessage = messagesContext?.postMessage;
 
     // Handler for sending a new message to the backend
     const handleSendMessage = () => {
          console.log("Conversation ID in handleSendMessage:", conversationId);  // Verify conversationId is defined
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
        <section>
             <h1>Chat Page</h1>
             <MessageList messages={messages} users={users} />
             <MessageInput
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onSendMessage={handleSendMessage}
            />
             
        </section>
     );
}
 
export default ChatPage;