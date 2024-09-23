import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { api, OMDbSearch, token } from '../api';

interface Movie {
    Title: string;
    imdbID: string;
    Poster: string;
    imdbRating: string;
}

interface MovieListProps {
    movies: { imdbID: string; Title: string }[]; // Simplifiquei os tipos de entrada dos filmes
    handleLibraryClick: (movie: Movie) => void;
    favoriteComponent: React.ComponentType<{ isFavorite: unknown; onClick: () => void }>;
}

const MovieList: React.FC<MovieListProps> = ({ movies, handleLibraryClick, favoriteComponent: FavoriteComponent }) => {
    const [localMovies, setLocalMovies] = useState<Movie[]>([]);

    // Função para verificar se o filme já está na biblioteca
    const isMovieInLibrary = async (movieId: string): Promise<boolean> => {
        const response = await api.get("/libraries/2");

        // Verifica se o movieId está presente na resposta
        const movies = response.data.movies || [];
        return movies.some((movie: { movieId: string; }) => movie.movieId === movieId);
    };

    useEffect(() => {
        // Realiza requisição para OMDB API para cada filme na lista
        const fetchMovieDetails = async () => {
            try {
                const promises = movies.map(async (movie) => {
                    const response = await OMDbSearch.get(`?i=${movie.imdbID}&apikey=${token}`);
                    return response.data; // axios já processa a resposta como JSON
                });
                const fetchedMovies = await Promise.all(promises);
                setLocalMovies(fetchedMovies);
            } catch (error) {
                console.error('Erro ao buscar detalhes dos filmes:', error);
            }
        };

        if (movies.length > 0) {
            fetchMovieDetails();
        }
    }, [movies]);

    return (
        <List>
            {localMovies.map((movie) => {
                const isFavorite = isMovieInLibrary(movie.imdbID);
                return (
                    <ListItem key={movie.imdbID} divider>
                        <img src={movie.Poster} alt={`${movie.Title} Poster`} style={{ width: '50px', marginRight: '16px' }} />
                        <ListItemText
                            primary={`${movie.Title} (Rating: ${movie.imdbRating})`}
                            secondary={`IMDB ID: ${movie.imdbID}`}
                        />
                        <ListItemSecondaryAction>
                            <FavoriteComponent isFavorite={isFavorite} onClick={() => handleLibraryClick(movie)} />
                        </ListItemSecondaryAction>
                    </ListItem>
                );
            })}
        </List>
    );
};

export default MovieList;
