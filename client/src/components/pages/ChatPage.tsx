import { useContext, useState } from "react";
import MessagesContext, { MessageType, MessagesContextTypes } from '../../contexts/MessagesContext';
import UsersContext from '../../contexts/UsersContext';
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

     const [newMessage, setNewMessage] = useState("");
 
     // Retrieve messages for this specific conversation
     const messages = messagesContext?.getMessagesByConversationId(conversationId) || [];
     const postMessage = messagesContext?.postMessage;
     const users = usersContext?.users || [];
 
     // Handler for sending a new message to the backend
     const handleSendMessage = () => {
          if (postMessage) {
              const message: NewMessageType = {
                  conversationId,
                  senderId: "loggedInUserId",  // Replace with the actual logged-in user ID
                  content: newMessage,
                  timestamp: new Date().toISOString(),
                  likes: []
              };
              postMessage(message);  // postMessage sends this to the backend
              setNewMessage("");
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