// src/components/SearchBar/SearchBar.styles.ts
import styled from "styled-components";

export const SearchContainer = styled.div`
  width: 100%;
  margin-top: 20px; 
  border: 1px solid #DEDEDE;
  display: flex;
  align-items: center;
  border-radius: 4px;
  font-family: "Inter, sans-serif";
  position: relative;
`;

export const SearchInput = styled.input`
  background-color: white;
  border: 0;
  border-radius: 2px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  font-size: 16px;
  padding: 10px 15px;
  height: 40px;

  &:focus {
    outline: none;
  }
`;

export const SearchIcon = styled.div`
  height: 40px;
  width: 50px;
  background-color: #f0f0f0;
  display: grid;
  place-items: center;
  cursor: pointer;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;

  svg {
    font-size: 20px;
    color: #555;
  }

  &:hover {
    background-color: #e0e0e0;
  }
`;

export const DataResult = styled.div`
  position: absolute;
  top: 45px; 

  max-height: 200px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  overflow-y: auto;
  z-index: 1000;
  border-radius: 0 0 4px 4px;

  ::-webkit-scrollbar {
    display: none;
  }

  .dataItem {
 
    padding: 10px 15px;
    display: flex;
    align-items: center;
    color: black;
    cursor: pointer;

    &:hover {
      background-color: #f5f5f5;
    }

    p {
      margin-left: 10px;
      font-size: 14px;
    }
  }
`;

export const ClearButton = styled.div`
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;

  svg {
    font-size: 20px;
    color: #555;
  }

  &:hover {
    background-color: #e0e0e0;
  }
`;
