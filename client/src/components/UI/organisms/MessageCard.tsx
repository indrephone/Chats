import { MessageType } from '../../../contexts/MessagesContext';
import { UserType } from '../../../contexts/UsersContext';
import LikeButton from './LikeButton';

type MessageCardProps = {
    message: MessageType;
    users: UserType[];
    loggedInUserId: string;
};

const MessageCard = ({ message, users, loggedInUserId }: MessageCardProps) => {
    const sender = users.find(user => user._id === message.senderId);  // Fetch sender details
    const isOwnMessage = message.senderId === loggedInUserId;  // Replace with actual logged-in user ID check
    const isLiked = message.likes?.includes(loggedInUserId) || false;
    const likeCount = message.likes ? message.likes.length : 0;

    return (
        <div className="message-card">
            <img src={sender?.profileImage} alt={`${sender?.username}'s profile`} />
            <div>
                <span>{sender?.username}</span>
                <p>{message.content}</p>
                <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                <div>
                {!isOwnMessage &&  <LikeButton messageId={message._id} isLiked={isLiked} />}
                {likeCount > 0 && <span>{likeCount} {likeCount === 1 ? "Like" : "Likes"}</span>}
                </div>
            </div>
        </div>
    );
};

export default MessageCard;
