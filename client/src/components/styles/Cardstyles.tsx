// src/components/styles/CardStyles.tsx
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export const CardDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background-color: #492f2f;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
`;

export const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

export const Username = styled.span`
  font-size: 16px;
  font-weight: normal;
  margin: 0;
  color: #fff;
`;
