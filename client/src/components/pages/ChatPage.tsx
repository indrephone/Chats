import { useParams } from "react-router-dom";


const ChatPage = () => {
    const { conversationId } = useParams(); 

    return ( 
        <section>
             <h1>Chat Page</h1>
             <p>Conversation ID: {conversationId}</p>
        </section>
     );
}
 
export default ChatPage;