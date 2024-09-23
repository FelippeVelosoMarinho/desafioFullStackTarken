import React from 'react';
import { useEffect, useState } from "react";
import { notifyError } from "../Toastr";
import { MovieContainer, MovieImage, MovieTitle, MovieRating, MovieButton, MovieInfo } from './index';
import { api } from "../../api/index";

interface MovieType {
        id?: string; 
        name?: string;   
        imdbID: string;
        Title: string;
        Poster: string;
        posterUrl?: string;
        imdbRating?: string;
        imdbGrade?: string;
        releaseDate?: string;
}

interface MovieProps {
    movie: MovieType;
    onAddToLibrary: (movie: MovieType) => void;
    onRemoveFromLibrary: (movie: MovieType) => void;
    isAdded: boolean;
}

const Movie: React.FC<MovieProps> = ({ movie, onAddToLibrary, onRemoveFromLibrary, isAdded }) => {
    const handleButtonClick = () => {
        if (isAdded) {
            onRemoveFromLibrary(movie); // Chama a função de remoção se o filme já estiver na biblioteca
        } else {
            onAddToLibrary(movie); // Chama a função de adição se o filme não estiver na biblioteca
        }
    };
    return (
        <MovieContainer>
            <MovieImage src={movie.Poster} alt={movie.Title} />
            <MovieInfo>
                <MovieTitle>{movie.Title}</MovieTitle>
                <MovieRating>⭐ {movie.imdbRating || "N/A"}</MovieRating>
                <MovieButton added={isAdded} onClick={handleButtonClick}>
                    {isAdded ? "Remove from My Library" : "Add to My Library"}
                </MovieButton>
            </MovieInfo>
        </MovieContainer>
    );
};

interface MovieDisplayProps {
    movies: Array<{
        id?: string; 
        name?: string;   
        imdbID: string;
        Title: string;
        Poster: string;
        posterUrl?: string;
        imdbRating?: string;
        imdbGrade?: string;
        releaseDate?: string;

    }>;
    onRemoveFromLibrary?: (movie: MovieType) => void;
    onAddToLibrary?: (movie: MovieType) => void;
    library: Array<{ imdbID: string }>;
}

const MovieDisplay: React.FC<MovieDisplayProps> = ({ movies, onAddToLibrary, onRemoveFromLibrary, library }) => {
    const [libraryAdd, setLibraryAdd] = useState<Set<string>>(new Set());

    // Carrega os filmes da biblioteca
    useEffect(() => {
        const fetchFilmOnLibrary = async () => {
            try {
                const response = await api.get("/library-movies/1/movies");
                const libraryMovies = response.data.map((movie: MovieType) => movie.imdbID);
                setLibraryAdd(new Set(libraryMovies)); 
            } catch (error) {
                console.log("Erro: ", error);
                notifyError("Erro ao buscar a biblioteca.");
            }
        };
        fetchFilmOnLibrary();
    }, []);

    return (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            {movies.map(movie => (
                <Movie
                    key={movie.imdbID}
                    movie={movie}
                    isAdded={library.some(m => m.imdbID === movie.imdbID)}
                    onAddToLibrary={onAddToLibrary}
                    onRemoveFromLibrary={onRemoveFromLibrary} // Passa a função de remoção
                />
            ))}
        </div>
    );
};

export default MovieDisplay;
