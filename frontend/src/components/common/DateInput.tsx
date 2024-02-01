import React from 'react';
import DatePicker, {ReactDatePickerCustomHeaderProps} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import {CalendarIcon, ChevronIcon} from "../../UI/SVG";
import {FieldWrapper} from "../../UI/CommonUI";


const CalendarIconWrapper = styled.div`
    display: flex;
`;

const DateSpan = styled.span`
    color: #46404B;
`;


const StyledChevronIcon = styled(ChevronIcon)`
    stroke: #AFAAB6;
`;

const Wrapper = styled.div`
    display: flex;
`;

const renderHeader = (params: ReactDatePickerCustomHeaderProps) => (
  <div style={{background: "none"}}>
    <button
      aria-label="Previous Month"
      className={
        "react-datepicker__navigation react-datepicker__navigation--previous"
      }
      onClick={params.decreaseMonth}
    >
            <span
              className={
                "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
              }
            >
              <StyledChevronIcon/>
            </span>
    </button>
    <span className="react-datepicker__current-month">
            {params.monthDate.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
    </span>
    <button
      aria-label="Next Month"
      className={
        "react-datepicker__navigation react-datepicker__navigation--next"
      }
      onClick={params.increaseMonth}
    >
            <span
              className={
                "react-datepicker__navigation-icon react-datepicker__navigation-icon--next"
              }
            >
              <StyledChevronIcon/>d
            </span>
    </button>
  </div>
);


interface InputProps {
  value: Date | null;
  onClick: () => void;
}

interface DateInputProps {
  placeholder: string | undefined;
  value: Date | undefined;
  onChange: (date: Date | null) => void;
}

const DateInput = ({placeholder, value, onChange}: DateInputProps) => {
  const CustomInputComponent = ({value, onClick}: InputProps) => {
    return (
      <FieldWrapper onClick={onClick}>
        <div style={{width: "226px"}}>
          <span>{placeholder}</span>
          <DateSpan>{` ${value}`}</DateSpan>
        </div>
        <CalendarIconWrapper>
          <CalendarIcon/>
        </CalendarIconWrapper>
      </FieldWrapper>
    );
  };

  return (
    <Wrapper>
      <DatePicker
        selected={value}
        onChange={onChange}
        customInput={<CustomInputComponent value={value || new Date()} onClick={() => { console.log(value) }}/>}
        placeholderText={placeholder}
        renderCustomHeader={renderHeader}
        allowSameDay={true}

      />
    </Wrapper>
  );
};

export default DateInput;
