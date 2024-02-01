import React, {useState, useRef, useEffect, FunctionComponent} from 'react';
import {DeleteIcon, EditIcon, KebabMenuIcon} from "../../UI/SVG";
import styled from "styled-components";


const MenuButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
`;

const MenuContainer = styled.div`
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const MenuItem = styled.div`
  padding: 8px 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }

  svg {
    margin-right: 8px;
  }
`;


interface KebabMenuProps {
  showEdit: boolean;
  showDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const defaultProps: KebabMenuProps = {
  showEdit: false,
  showDelete: false,
  onEdit: () => {return},
  onDelete: () => {return}
};


const KebabMenu: FunctionComponent<KebabMenuProps> = ({ showEdit, showDelete, onEdit , onDelete}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Закрыть меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div ref={menuRef}>
      <MenuButton onClick={() => setIsOpen(!isOpen)}>
        <KebabMenuIcon/>
      </MenuButton>
      {isOpen && (
        <MenuContainer className="kebab-menu">
          {showEdit && (
            <MenuItem onClick={() => {onEdit(); setIsOpen(false)}}>
              <EditIcon/> Изменить
            </MenuItem>
          )}
          {showDelete && (
            <MenuItem onClick={() => {onDelete(); setIsOpen(false)}}>
              <DeleteIcon/> Удалить
            </MenuItem>
          )}
        </MenuContainer>
      )}
    </div>
  );
};

KebabMenu.defaultProps = defaultProps;

export default KebabMenu;
