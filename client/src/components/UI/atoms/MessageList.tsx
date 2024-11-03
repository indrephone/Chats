import { MessageType } from '../../../contexts/MessagesContext';
import { UserType } from '../../../contexts/UsersContext';
import MessageCard from "./MessageCard";

type MessageListProps = {
    messages: MessageType[];
    users: UserType[];
};

const MessageList = ({ messages, users }: MessageListProps) => (
    <div>
        {messages.map(message => (
            <MessageCard key={message._id} message={message} users={users} />
        ))}
    </div>
);

export default MessageList;
