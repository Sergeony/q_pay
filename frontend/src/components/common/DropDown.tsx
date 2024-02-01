import React from 'react';
import styled from 'styled-components';
import {ChevronIcon} from "../../UI/SVG";
import Select, {DropdownIndicatorProps, GroupBase, StylesConfig} from "react-select";
import {components} from 'react-select';


const StyledChevronIcon = styled(ChevronIcon)`
    stroke: #AFAAB6;
`;

const StyledLabel = styled.label`
    color: #46404B;
    
    font-family: 'Mulish', serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    
    display: block;
    margin-bottom: 4px;
`;

const customStyles: StylesConfig<Option, boolean, GroupBase<Option>> = {
  container: (provided: any, state: any) => {
    return {
      width: 'inherit',
    }
  },
  control: (provided: any, state: any) => {
    const selectedOption = state.getValue()[0];
    const isPlaceholder = selectedOption && selectedOption.isPlaceholder;

    return {
    cursor: 'pointer',

    display: 'flex',
    alignItems: 'center',

    padding: state.menuIsOpen ? '8px 15px 7px 15px' : '7px 15px 7px 15px',

    borderRadius: state.menuIsOpen ? '8px 8px 0 0' : '8px',
    border: '1px solid #AFAAB6',
    borderBottom: state.menuIsOpen ? 'none' : '1px solid #AFAAB6',

    gap: '8px',
    width: 'inherit',

    fontFamily: 'Mulish, serif',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',

    color: isPlaceholder && !state.menuIsOpen ? '#AFAAB6': '#46404B',
    }
  },
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    padding: '0',
    width: '100px',
    margin: '0',
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: 'inherits',
    margin: '0',
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    padding: '0',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  menu: (provided: any) => ({
    position: 'absolute',
    zIndex: '1',
    borderRadius: '0 0 8px 8px',
    border: '1px solid #AFAAB6',
    borderTop: 'none',
    width: 'inherit',
    boxShadow: 'none',
    background: 'none',
    margin: '0',
    backgroundColor: '#F8F5FE',

  }),
  menuList: (provided: any) => ({
    ...provided,
    display: "flex",
    flexDirection: 'column',
    gap: '8px',
    padding: '0 16px 8px',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    background: 'none',
    padding: '0',

    fontFamily: 'Mulish, serif',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',

    color: state.isFocused ? '#46404B' : '#AFAAB6',
  }),
};

const DropdownIndicator = (props: DropdownIndicatorProps<Option, boolean, GroupBase<Option>>) => {
  return (
    <components.DropdownIndicator {...props}>
      <StyledChevronIcon />
    </components.DropdownIndicator>
  );
};


interface Option {
  value: string | number;
  label: string;
  isPlaceholder?: boolean;
}

interface SelectProps {
  options: Option[];
  width: string;
  label?: string;
}


const DropDown: React.FC<SelectProps> = ({ options, width, label }: SelectProps) => {
  return (
    <div style={{width: width}}>
      {label && <StyledLabel>{label}</StyledLabel>}
    <Select options={options}
            styles={customStyles}
            isSearchable={false}
            components={{DropdownIndicator}}
            hideSelectedOptions={true}
            defaultValue={options.find(option => option.isPlaceholder) || options[0]}
    />
    </div>
  );
};

export default DropDown;
