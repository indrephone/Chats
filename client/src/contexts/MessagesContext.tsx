import { useReducer, useEffect, createContext, ReactElement, useContext} from 'react';
import { UserType } from './UsersContext';
import { ConversationType } from './ConversationsContext';

type ChildProp = { children: ReactElement };
export type MessageType = {
    _id: string,
    conversationId: string,
    senderId: string,
    content: string,
    timestamp: string,
    likes?: string[]
};
type MessagesWithUser = MessageType & {
    userData: UserType
};
export type MessagesContextTypes = {
    messages: MessagesWithUser[];
    dispatch: React.Dispatch<ReducerActionTypeVariations>;
    getMessagesByConversationId: (conversationId: string) => MessagesWithUser[]; // Function to get messages for a specific conversation
    postMessage: (message: MessageType) => void; // Function to post a new message
};
type ReducerActionTypeVariations =
{ type: 'setMessages', data: MessagesWithUser[] } |
{ type: 'postMessages', newMessage: MessagesWithUser} |
{ type: 'reset'}

const reducer = (state: MessagesWithUser[], action: ReducerActionTypeVariations): MessagesWithUser[] => {
    switch (action.type) {
        case 'setMessages':
            return action.data;
        case 'postMessages':
            return [...state, action.newMessage];
        case 'reset':
            return [];
        default:
            return state;
    }
};



const MessagesContext = createContext<MessagesContextTypes | undefined>(undefined);
const MessagesProvider = ( {children } : ChildProp) => {

    const [messages, dispatch] = useReducer(reducer, []);

    // Function to get messages by conversation ID
    const getMessagesByConversationId = (conversationId: string): MessagesWithUser[] => {
        return messages.filter(message => message.conversationId === conversationId);
    };

    // Function to post a new message (can also include API call)
    const postMessage = (message: MessageType) => {
        const messageWithUser: MessagesWithUser = { ...message, userData: {} as UserType }; // Add actual user data if available
        dispatch({ type: 'postMessages', newMessage: messageWithUser });
    };

    return  (
        <MessagesContext.Provider
           value={{
            messages,
            dispatch,
            getMessagesByConversationId,
            postMessage,
           }}
           >
            { children }
           </MessagesContext.Provider>
    )
}

export { MessagesProvider};
export default MessagesContext