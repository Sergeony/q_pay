import React from 'react';
import styled from 'styled-_components';
import {ChevronIcon} from "../../../src_old/__UI/SVG";
import Select, {
  ActionMeta,
  DropdownIndicatorProps,
  GroupBase,
  MultiValue,
  OptionProps,
  PropsValue, SingleValue,
  StylesConfig
} from "react-select";
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
    margin-top: 30px;
`;

const customStyles: StylesConfig<CustomOptionProps, boolean, GroupBase<CustomOptionProps>> = {
  container: (provided: any, state: any) => {
    return {
      width: 'inherit',
      height: 'inherit',
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
    height: 'inherit',

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
    maxWidth: '398px',
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

    display: "flex",
    alignItems: "center",
    gap: "8px",

    color: state.isFocused ? '#46404B' : '#AFAAB6',
  }),
};

const DropdownIndicator: React.FC<DropdownIndicatorProps<CustomOptionProps, boolean, GroupBase<CustomOptionProps>>> = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <StyledChevronIcon />
    </components.DropdownIndicator>
  );
};



export interface CustomOptionProps {
  value: string | number;
  label: string;
  icon?: React.ElementType;
}


const Option: React.FC<OptionProps<CustomOptionProps, false>> = (props) => {
  return (
    <components.Option {...props}>
      {props.data.icon && <props.data.icon/>} {props.data.label}
    </components.Option>
  );
};


interface DropDownProps {
  options: CustomOptionProps[];
  width: string;
  height?: string;
  label?: string;
  onChange?: (newValue: (MultiValue<CustomOptionProps> | SingleValue<CustomOptionProps>), actionMeta: ActionMeta<CustomOptionProps>) => void
  value: PropsValue<CustomOptionProps> | undefined;
}


const DropDown: React.FC<DropDownProps> = ({options, width, height, label, onChange, value}) => {
  return (
    <div style={{width: width, height: height}}>
      {label && <StyledLabel>{label}</StyledLabel>}
      <Select options={options}
              styles={customStyles}
              isSearchable={false}
              components={{ Option, DropdownIndicator }}
              hideSelectedOptions={true}
              onChange={onChange}
              value={value}
      />
    </div>
  );
};

DropDown.defaultProps = {
  height: '34px'
}

export default DropDown;
