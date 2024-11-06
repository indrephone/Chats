import { MessageType } from '../../../contexts/MessagesContext';
import { UserType } from '../../../contexts/UsersContext';
import LikeButton from './LikeButton';
import {
    MessageCardContainer,
    ProfileImage,
    MessageHeader,
    Username,
    Timestamp,
    MessageContent,
    LikeSection,
  } from '../../styles/MessageStyles';



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
        <MessageCardContainer isOwnMessage={isOwnMessage}>
            <MessageHeader isOwnMessage={isOwnMessage}>
                <ProfileImage isOwnMessage={isOwnMessage} src={sender?.profileImage || "/default_profile_image.svg"} alt={`${sender?.username}'s profile`} />
                <Username>{sender?.username}</Username>
                <Timestamp>{new Date(message.timestamp).toLocaleTimeString()}</Timestamp>
            </MessageHeader>
          
            <MessageContent isOwnMessage={isOwnMessage}>{message.content}</MessageContent>

            <LikeSection>
                {!isOwnMessage &&  <LikeButton messageId={message._id} isLiked={isLiked} />}
                {likeCount > 0 && <span>{likeCount} {likeCount === 1 ? "Like" : "Likes"}</span>}
            </LikeSection>
        </MessageCardContainer>
    );
};

export default MessageCard;
               
