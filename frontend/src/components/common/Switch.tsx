import React from 'react';
import styled from 'styled-components';


const ToggleWrapper = styled.button<{ size: string }>`
    width: ${props => props.size === 'large' ? '53px' : '32px'};
    height: ${props => props.size === 'large' ? '30px' : '18px'};
    border-radius: ${props => props.size === 'large' ? '15px' : '9px'};
    background-color: ${({theme}) => theme.theme_accent};
    border: none;
    padding: ${props => props.size === 'large' ? '3.5px' : '2px'};;
    margin: 0 25px;
`;

const ToggleSpan = styled.span<{ size: string }>`
    display: flex;
    width: ${props => props.size === 'large' ? '23px' : '14px'};
    height: ${props => props.size === 'large' ? '23px' : '14px'};
    border-radius: 50%;
    background-color: ${({theme}) => theme.toggle_span_background_color};
`;


interface IProps {
  size: 'small' | 'large';
}


const Switch = ({ size }: IProps) => {
  return (
    <ToggleWrapper size={size}>
      <ToggleSpan size={size}/>
    </ToggleWrapper>
  );
};

export default Switch;
