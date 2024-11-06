import React, { useContext } from 'react';
import MessagesContext from '../../../contexts/MessagesContext';
import { LikeButtonStyle } from '../../styles/MessageStyles';

type LikeButtonProps = {
    messageId: string;
    isLiked: boolean;
};


const LikeButton: React.FC<LikeButtonProps> = ({ messageId, isLiked }) => {
    const { toggleLikeMessage } = useContext(MessagesContext)!;

    const handleClick = () => {
        toggleLikeMessage(messageId);
    };

    return (
        <LikeButtonStyle onClick={handleClick}>
            {isLiked ? 'Unlike' : 'Like'}
        </LikeButtonStyle>
    );
};

export default LikeButton;
