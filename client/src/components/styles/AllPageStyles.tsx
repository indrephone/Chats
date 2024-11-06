// src/components/styles/AllPageStyles.tsx
import styled from 'styled-components';

export const StyledHeader = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-weight: 200; 
  font-size: 36px; 
  color: white;
  margin-bottom: 8px;
  text-shadow: 
    0 0 5px #ffd700,    /* Outer glow */
    0 0 10px #ffd700,   /* Medium glow */
    0 0 15px #ffd700,   /* Strong glow */
    0 0 20px #ffd700;   /* Extra glow for neon effect */
`;
export const StyledSectionForLists = styled.section`
  padding: 10px 30px;
  background-color: #6d6565;
`;
export const ProfileSection = styled.section`
  display: flex;
  flex-direction:column;
  align-items: center;
  padding: 20px;
  text-align: center;
`;
export const ProfileImage = styled.img`
  max-height: 200px;
  max-width: 400px;
  min-height: 100px;
  min-width: 100px;
  object-fit: contain;
  border: 1px solid #000;
  border-radius: 50%;
`;
export const StyledUserNameHeader = styled.p`
  color: white;
  font-size: 18px; 
  margin-bottom: 5px; 
`;