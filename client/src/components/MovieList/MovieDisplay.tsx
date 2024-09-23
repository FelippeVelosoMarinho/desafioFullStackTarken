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
                    {isAdded ? "Remove" : "Add to My Library"}
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
    onAddToLibrary: (movie: MovieType) => void;
    library: Array<{ imdbID: string }>;
}

const MovieDisplay: React.FC<MovieDisplayProps> = ({ movies, onAddToLibrary, library }) => {
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
                />
            ))}
        </div>
    );
};

export default MovieDisplay;
