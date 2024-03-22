import React, { useState, KeyboardEvent } from 'react';
import styled from 'styled-_components';
import {SearchIcon} from "../../../src_old/__UI/SVG";
import {FieldWrapper} from "../../../src_old/__UI/CommonUI";

const SearchInput = styled.input`
  border: none;
  background: none;
  width: 378px;
  padding: 0;

  color: black;
  font-family: 'Mulish', serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  &[type="search"]::-ms-clear,
  &[type="search"]::-ms-reveal {
      display: none;
  }
  &[type="search"]::-webkit-search-decoration,
  &[type="search"]::-webkit-search-cancel-button,
  &[type="search"]::-webkit-search-results-button,
  &[type="search"]::-webkit-search-results-decoration {
      display: none;
  }

  &::placeholder {
      color: ${() => "#AFAAB6"};
      text-align: end;
  }

  &:focus {
      outline: none;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
      background: none;
      color: ${() => "black"};
      transition: color 5000s ease-in-out 0s, background 5000s ease-in-out 0s;
  }
`;

const SearchButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;


interface IProps {
  onSearch: (searchTerm: string) => void;
  placeholder: string;
}


const Search: React.FC<IProps> = ({ onSearch, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  return (
    <FieldWrapper>
      <SearchInput
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <SearchButton onClick={() => handleSearch(searchTerm)}>
        <SearchIcon/>
      </SearchButton>
    </FieldWrapper>
  );
};

export default Search;
