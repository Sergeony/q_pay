import React from 'react';
import styled from 'styled-_components';


const ToggleWrapper = styled.button<{ size: string, isActivated: boolean }>`
    width: ${props => props.size === 'large' ? '53px' : '32px'};
    height: ${props => props.size === 'large' ? '30px' : '18px'};
    border-radius: ${props => props.size === 'large' ? '15px' : '9px'};
    background-color: ${({theme, isActivated}) => isActivated ? theme.theme_accent : theme.toggle_span_background_color};
    border: none;
    padding: ${props => props.size === 'large' ? '3.5px' : '2px'};;
    margin: 0 25px;
`;

const ToggleSpan = styled.span<{ size: string, isActivated: boolean }>`
    display: flex;
    width: ${props => props.size === 'large' ? '23px' : '14px'};
    height: ${props => props.size === 'large' ? '23px' : '14px'};
    border-radius: 50%;
    background-color: ${({theme}) => theme.toggle_span};
    margin-left: ${({isActivated}) => isActivated ? 'auto' : '0'};
`;


interface IProps {
  size: 'small' | 'large';
}


interface IProps {
  size: 'small' | 'large';
  isActivated: boolean;
  onToggle: (isActivated: boolean) => void;
}

const Switch = ({ size, isActivated, onToggle }: IProps) => {
  const handleToggle = () => {
    onToggle(!isActivated);
  };

  return (
    <ToggleWrapper size={size} isActivated={isActivated} onClick={handleToggle} aria-pressed={isActivated}>
      <ToggleSpan size={size} isActivated={isActivated} style={{ marginLeft: isActivated ? 'auto' : '0' }} />
    </ToggleWrapper>
  );
};

export default Switch;
