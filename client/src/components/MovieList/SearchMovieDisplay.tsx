import React from "react";
import { MovieContainer, MovieImage, MovieTitle, MovieRating, MovieButton, MovieInfo } from './index'; // Importa os componentes estilizados

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
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      {movies.map((movie) => (
        <MovieContainer key={movie.imdbID}>
          <MovieImage src={movie.Poster} alt={movie.Title} />
          <MovieInfo>
            <MovieTitle>{movie.Title}</MovieTitle>
            <MovieRating>⭐ {movie.imdbRating || "N/A"}</MovieRating>
            <MovieButton
              added={isMovieInLibrary(movie.imdbID)}
              onClick={() => onAddToLibrary(movie)}
            >
              {isMovieInLibrary(movie.imdbID)
                ? "Remover da Biblioteca"
                : "Adicionar à Biblioteca"}
            </MovieButton>
          </MovieInfo>
        </MovieContainer>
      ))}
    </div>
  );
};

export default SearchMovieDisplay;
