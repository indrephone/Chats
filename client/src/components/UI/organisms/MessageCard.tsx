import { MessageType } from '../../../contexts/MessagesContext';
import { UserType } from '../../../contexts/UsersContext';
import LikeButton from './LikeButton';
import styled from 'styled-components';

const MessageCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 8px 0;
`;

const ProfileImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 8px;
`;

const MessageHeader = styled.div`
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    margin-bottom: 4px;
`;

const Username = styled.span`
    font-weight: bold;
    margin-right: 8px;
    color: #d3d2d2;
`;

const Timestamp = styled.span`
    font-size: 0.8rem;
    /* color: #666; */
    color: #b6b6b6;
`;

const MessageContent = styled.p`
    font-size: 1rem;
    padding: 8px 20px;
    margin: 4px 0;
    background-color: #fff;
    border-radius: 20px;
    border: 1px solid #afafaf;
`;

const LikeSection = styled.div`
    display: flex;
    align-items: center;
    font-size: 0.9rem;
`;

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
        <MessageCardContainer>
            <MessageHeader>
                <ProfileImage src={sender?.profileImage || "/default_profile_image.svg"} alt={`${sender?.username}'s profile`} />
                <Username>{sender?.username}</Username>
                <Timestamp>{new Date(message.timestamp).toLocaleTimeString()}</Timestamp>
            </MessageHeader>
          
            <MessageContent>{message.content}</MessageContent>

            <LikeSection>
                {!isOwnMessage &&  <LikeButton messageId={message._id} isLiked={isLiked} />}
                {likeCount > 0 && <span>{likeCount} {likeCount === 1 ? "Like" : "Likes"}</span>}
            </LikeSection>
        </MessageCardContainer>
    );
};

export default MessageCard;
               
