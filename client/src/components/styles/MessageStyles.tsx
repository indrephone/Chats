// src/components/styles/MessageStyles.tsx
import styled, { css } from 'styled-components';

export const MessageCardContainer = styled.div<{ isOwnMessage: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isOwnMessage }) => (isOwnMessage ? 'flex-end' : 'flex-start')};
  margin: 8px 0;
  ${({ isOwnMessage }) =>
    isOwnMessage &&
    css`
      align-self: flex-end;
      text-align: right;
    `}
`;

export const ProfileImage = styled.img<{ isOwnMessage: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: ${({ isOwnMessage }) => (isOwnMessage ? '0 0 0 8px' : '0 8px 0 0')};
`;

export const MessageHeader = styled.div<{ isOwnMessage: boolean }>`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  margin-bottom: 4px;
  flex-direction: ${({ isOwnMessage }) => (isOwnMessage ? 'row-reverse' : 'row')};
`;

export const Username = styled.span`
  font-weight: bold;
  margin-right: 8px;
  color: #d3d2d2;
`;

export const Timestamp = styled.span`
  font-size: 0.8rem;
  color: #b6b6b6;
`;

export const MessageContent = styled.p<{ isOwnMessage: boolean }>`
  font-size: 1rem;
  padding: 8px 15px;
  margin: 4px 0;
  background-color: #fff;
  border-radius: 20px;
  border: 1px solid #afafaf;
  ${({ isOwnMessage }) =>
    isOwnMessage &&
    css`
      background-color: #e0e7ff; /* Change background color for own messages */
    `}
`;

export const LikeSection = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  margin-top: 4px;
  color: #a4a4a4;
`;
