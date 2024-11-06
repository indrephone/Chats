// src/components/styles/FormStyles.js
import styled from 'styled-components';

export const FormContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  h2 {
    margin-bottom: 20px;
    text-align: center;
  }

  p {
    margin-top: 15px;
    text-align: center;
  }
`;

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  gap: 10px;

  > div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 10px;
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
  box-sizing: border-box;

  &:focus {
    outline: none; /* Ensures no outline appears */
    border: 2px solid #6a5acd; /* Optionally, add a custom focus border */
  }
`;

export const SubmitButton = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #7b68ee;
  color: white;
  outline: none;
  border: none;
  transition: background-color 0.3s ease, color 0.3s ease, font-size 0.3s ease, font-weight 0.3s ease;

  &:hover {
    color: #ff00ea;
    background-color: #6a5acd;
    font-size: 17px;
    font-weight: bold;
  }

  &:active {
    background-color: #4c3ccf;
    font-size: 17px;
    font-weight: bold;
  }
`;

export const StyledLabel = styled.label`
  color: white;
  font-size: 18px; 
  margin-bottom: 5px; 
`;