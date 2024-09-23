import { MovieContainer, MovieImage, MovieTitle, MovieRating, MovieButton, MovieInfo } from "./index";
import React from 'react';

interface MovieProps {
    movie: {
        imdbID: string;
        Title: string;
        Poster: string;
        imdbRating?: string;
    };
    onAddToLibrary: (movie: { imdbID: string }) => void;
    isAdded: boolean;
}

const Movie: React.FC<MovieProps> = ({ movie, onAddToLibrary, isAdded }) => {
    return (
        <MovieContainer>
            <MovieImage src={movie.Poster} alt={movie.Title} />
            <MovieInfo>
                <MovieTitle>{movie.Title}</MovieTitle>
                <MovieRating>⭐ {movie.imdbRating || "N/A"}</MovieRating>
                <MovieButton added={isAdded} onClick={() => onAddToLibrary(movie)}>
                    {isAdded ? "Added to Library" : "Add to My Library"}
                </MovieButton>
            </MovieInfo>
        </MovieContainer>
    );
};

interface MovieListProps {
    movies: Array<{
        imdbID: string;
        Title: string;
        Poster: string;
        imdbRating?: string;
    }>;
    onAddToLibrary: (movie: { imdbID: string }) => void;
    library: Array<{ imdbID: string }>;
}

const MovieList: React.FC<MovieListProps> = ({ movies, onAddToLibrary, library }) => {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            {movies.map(movie => (
                <Movie
                    key={movie.imdbID}
                    movie={movie}
                    isAdded={library.some(m => m.imdbID === movie.imdbID)}
                    onAddToLibrary={onAddToLibrary}
                />
            ))}
        </div>
    );
};

export default MovieList;
