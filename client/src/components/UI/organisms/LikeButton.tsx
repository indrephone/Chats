import React, { useContext } from 'react';
import MessagesContext from '../../../contexts/MessagesContext';

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
        <button onClick={handleClick}>
            {isLiked ? 'Unlike' : 'Like'}
        </button>
    );
};

export default LikeButton;
