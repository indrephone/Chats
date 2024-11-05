import { ChangeEvent, useState} from 'react';
import * as Yup from 'yup';

type MessageInputProps = {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSendMessage: () => void;
};

const messageSchema = Yup.string()
    .min(2, 'Message must be at least 2 characters')
    .max(1000, 'Message cannot exceed 1000 characters');

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
        <div>
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
        {error && <p style={{ color: 'red' }}>{error}</p>} 
        <p>{value.length} / 1000 characters</p> 
    </div> 
     );
}
 
export default MessageInput;