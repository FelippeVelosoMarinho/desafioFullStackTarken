import React from "react";
import Button from "@mui/material/Button";

interface MovieType {
  imdbID: string;
  Title: string;
  Poster: string;
  imdbRating?: string;
  Year?: string;
  Type?: string;
}

interface SearchMovieDisplayProps {
  movies: MovieType[];
  onAddToLibrary: (movie: MovieType) => void;
  library: MovieType[];
}

const SearchMovieDisplay: React.FC<SearchMovieDisplayProps> = ({
  movies,
  onAddToLibrary,
  library,
}) => {
  // Função para verificar se o filme está na biblioteca
  const isMovieInLibrary = (imdbID: string) => {
    return library.some((movie) => movie.imdbID === imdbID);
  };

  return (
    <div>
      {movies.map((movie) => (
        <div key={movie.imdbID} style={{ marginBottom: "20px" }}>
          <img src={movie.Poster} alt={movie.Title} />
          <h3>{movie.Title}</h3>
          <p>{movie.Year}</p>

          {/* Verifica se o filme já está na biblioteca */}
          {isMovieInLibrary(movie.imdbID) ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => onAddToLibrary(movie)} // Chama a função de remoção
            >
              Remover da Biblioteca
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => onAddToLibrary(movie)} // Chama a função de adição
            >
              Adicionar à Biblioteca
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchMovieDisplay;
