import { ChangeEvent, useState} from 'react';
import * as Yup from 'yup';
import styled from 'styled-components';

type MessageInputProps = {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSendMessage: () => void;
};

const messageSchema = Yup.string()
    .trim()
    .min(1, 'Message must be at least 1 character')
    .max(1000, 'Message cannot exceed 1000 characters');

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
   
    box-sizing: border-box;
`;

const TextInput = styled.input`
    flex: 1;
    padding: 15px;
    font-size: 1rem;
    border: none;
    outline: none;
    height: 100%;
    box-sizing: border-box;
    background-color: #7e750a;
    color: white;
`;

const SendButton = styled.img`
    cursor: pointer;
    height: 100%;
  
`;


const MessageInput = ({ value, onChange, onSendMessage}: MessageInputProps) => {
    const [error, setError] = useState<string | null>(null);

    const handleSendMessage = async () => {
        try {
            await messageSchema.validate(value); // Validate with Yup
            setError(null); // Clear any previous error
            onSendMessage(); // Call the send function if validation passes
        } catch (validationError) {
            if (validationError instanceof Yup.ValidationError) {
                setError(validationError.message); // Access the error message safely
            }
        }
    };


    return ( 
        <InputContainer>
        <TextInput
            type="text"
            value={value}
            onChange={onChange}
            placeholder="Type a message"
        />
        <SendButton 
            src="/send-button.svg"
            alt="Send"
            onClick={handleSendMessage}
            onMouseOver={(e) => (e.currentTarget.src = "/send-button-active.svg")}
            onMouseOut={(e) => (e.currentTarget.src = "/send-button.svg")}
            /> 
        {error && <p style={{ color: 'red', marginLeft: '10px' }}>{error}</p>} 
        {/* <p>{value.length} / 1000 characters</p>  */}
    </InputContainer> 
     );
}
 
export default MessageInput;