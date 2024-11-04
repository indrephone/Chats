import { useReducer,  createContext, ReactElement} from 'react';


type ChildProp = { children: ReactElement };
export type MessageType = {
    _id: string,
    conversationId: string,
    senderId: string,
    content: string,
    timestamp: string,
    likes?: string[]
};
type NewMessageType = Omit<MessageType, '_id'>;

export type MessagesContextTypes = {
    messages: MessageType[];
    dispatch: React.Dispatch<ReducerActionTypeVariations>;
    getMessagesByConversationId: (conversationId: string) => Promise<void>;
    postMessage: (message: NewMessageType) => void; // Function to post a new message
};
type ReducerActionTypeVariations =
{ type: 'setMessages', data: MessageType[] } |
{ type: 'postMessages', newMessage: MessageType} |
{ type: 'reset'}

const reducer = (state: MessageType[], action: ReducerActionTypeVariations): MessageType[] => {
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
    const getMessagesByConversationId = async (conversationId: string) =>{
        // console.log("Fetching messages for conversationId:", conversationId);

        try {
            const response = await fetch(`/api/conversations/${conversationId}/messages`, {
                headers: {
                    'Content-Type': 'application/json',
                    '_id': JSON.parse(localStorage.getItem('loggedInUser') || '{}')._id
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                // console.log("Fetched messages:", data); 
                dispatch({ type: 'setMessages', data }); // Set messages in state
            } else {
                console.error("Failed to fetch messages:", response.status);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
   

     // Function to post a new message to the backend and update state
     const postMessage = async (message: NewMessageType) => {
        try {
            const { conversationId, ...messageData } = message;
            const loggedInUser = localStorage.getItem('loggedInUser');

            // Log the message data before sending
        //    console.log("Sending message data:", message);

           if (!loggedInUser) {
            console.error("User not found in local storage.");
            throw new Error("User not authenticated.");
           }

           // Parse the loggedInUser and get _id
          const userId = JSON.parse(loggedInUser)._id;
            if (!userId) {
               console.error("User _id not found in local storage.");
            throw new Error("User not authenticated.");
        }

            const response = await fetch(`/api/conversations/${conversationId}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    '_id': userId 
                },
                body: JSON.stringify(messageData)
            });

          // Log the response status to check if it's successful
        //    console.log("Response status:", response.status);


            if (!response.ok) {
                throw new Error(`Failed to post message with status ${response.status}`);
            }

            const savedMessage: MessageType = await response.json(); // Assume backend response includes `_id`
            console.log("Saved message from backend:", savedMessage);

            dispatch({ type: 'postMessages', newMessage: savedMessage });
        } catch (error) {
            console.error("Error posting message:", error);
        }
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