import React, { useState } from "react";
import {
  SearchContainer,
  SearchInput,
  SearchIcon,
  DataResult,
  ClearButton,
} from "./index";
import SearchIconMaterial from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

// Define o tipo para o item de dados da pesquisa
interface DataItem {
  title: string;
  link: string;
}

interface SearchBarProps {
  placeholder: string;
  data: DataItem[];
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, data }) => {
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [wordEntered, setWordEntered] = useState<string>("");

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.title.toLowerCase().includes(searchWord.toLowerCase());
    });

    setFilteredData(searchWord === "" ? [] : newFilter);
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <SearchContainer>
      <div style={{ display: "flex" }}>
        <SearchInput
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
        <SearchIcon>
          {filteredData.length === 0 ? (
            <SearchIconMaterial />
          ) : (
            <ClearButton onClick={clearInput}>
              <CloseIcon />
            </ClearButton>
          )}
        </SearchIcon>
      </div>
      {filteredData.length !== 0 && (
        <DataResult>
          {filteredData.slice(0, 15).map((value, key) => (
            <a
              key={key}
              className="dataItem"
              href={value.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p>{value.title}</p>
            </a>
          ))}
        </DataResult>
      )}
    </SearchContainer>
  );
};

export default SearchBar;
