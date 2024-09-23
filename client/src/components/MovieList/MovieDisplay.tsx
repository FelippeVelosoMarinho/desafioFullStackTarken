import React from 'react';
import { MovieContainer, MovieImage, MovieTitle, MovieRating, MovieButton, MovieInfo } from './index';

interface MovieType {
    imdbID: string;
    Title: string;
    Poster: string;
    imdbRating?: string;
}

interface MovieProps {
    movie: MovieType; 
    onAddToLibrary: (movie: MovieType) => void;
    isAdded: boolean;
}

const Movie: React.FC<MovieProps> = ({ movie, onAddToLibrary, isAdded }) => {
    return (
        <MovieContainer>
            <MovieImage src={movie.Poster} alt={movie.Title} />
            <MovieInfo>
                <MovieTitle>{movie.Title}</MovieTitle>
                <MovieRating>⭐ {movie.imdbRating || "N/A"}</MovieRating>
                <MovieButton added={isAdded} onClick={() => onAddToLibrary(movie)}> {/* Passa o movie completo */}
                    {isAdded ? "Added to Library" : "Add to My Library"}
                </MovieButton>
            </MovieInfo>
        </MovieContainer>
    );
};

interface MovieDisplayProps {
    movies: Array<{
        imdbID: string;
        Title: string;
        Poster: string;
        imdbRating?: string;
    }>;
    onAddToLibrary: (movie: MovieType) => void; // Altere aqui para usar MovieType
    library: Array<{ imdbID: string }>;
}

const MovieDisplay: React.FC<MovieDisplayProps> = ({ movies, onAddToLibrary, library }) => {
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

export default MovieDisplay;
