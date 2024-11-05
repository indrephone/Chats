import { MessageType } from '../../../contexts/MessagesContext';
import { UserType } from '../../../contexts/UsersContext';
import MessageCard from "../organisms/MessageCard";

type MessageListProps = {
    messages: MessageType[];
    users: UserType[];
    loggedInUserId: string;
};

const MessageList = ({ messages, users, loggedInUserId }: MessageListProps) => (
    <div>
        {messages.map(message => (
            <MessageCard 
               key={message._id} 
               message={message} 
               users={users} 
               loggedInUserId={loggedInUserId}
               />
        ))}
    </div>
);

export default MessageList;
