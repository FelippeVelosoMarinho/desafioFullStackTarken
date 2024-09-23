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
  data: DataItem[] | undefined; // Aceita 'undefined' para evitar erro
  onSearch: (searchTerm: string) => void; // Adiciona a função de busca
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, data = [], onSearch }) => {
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [wordEntered, setWordEntered] = useState<string>("");

  // Filtra os dados da pesquisa com base no texto inserido
  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);

    // Verifica se 'data' é um array antes de aplicar o 'filter'
    if (data && data.length > 0) {
      const newFilter = data.filter((value) =>
        value.title.toLowerCase().includes(searchWord.toLowerCase())
      );

      setFilteredData(searchWord === "" ? [] : newFilter);
    } else {
      setFilteredData([]);
    }
  };

  // Limpa o input de pesquisa
  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  // Dispara a função de pesquisa ao clicar no ícone de pesquisa
  const handleSearchClick = () => {
    onSearch(wordEntered); // Chama a função de busca passando o termo de pesquisa
  };

  return (
    <SearchContainer>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "end" }}>
        <SearchInput
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
        <SearchIcon onClick={handleSearchClick}> {/* Adiciona a função ao clicar */}
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
