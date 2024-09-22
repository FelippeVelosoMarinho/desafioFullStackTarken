// src/services/LibraryMoviesService.ts

import prisma from "../../../../.config/client";
import { Library_Movies } from "@prisma/client";

class LibraryMoviesService {
    /**
     * Adiciona um filme à biblioteca de um usuário.
     * @param libraryId - ID da biblioteca.
     * @param movieId - ID do filme.
     * @returns A relação criada entre a biblioteca e o filme.
     */
    async addMovieToLibrary(libraryId: number, movieId: number): Promise<Library_Movies> {
        // Verifica se a relação já existe
        const existingRelation = await prisma.library_Movies.findUnique({
            where: {
                libraryId_movieId: {
                    libraryId,
                    movieId,
                },
            },
        });

        if (existingRelation) {
            throw new Error("O filme já está na biblioteca.");
        }

        const libraryMovie = await prisma.library_Movies.create({
            data: {
                library: { connect: { id: libraryId } },
                movie: { connect: { id: movieId } },
            },
        });

        return libraryMovie;
    }

    /**
     * Remove um filme da biblioteca de um usuário.
     * @param libraryId - ID da biblioteca.
     * @param movieId - ID do filme.
     * @returns A relação removida.
     */
    async removeMovieFromLibrary(userId: number, movieId: number): Promise<Library_Movies> {
        // Verificar se a biblioteca do usuário existe e se o filme está na biblioteca
        const libraryMovie = await prisma.library_Movies.findFirst({
            where: {
                library: {
                    userId,
                },
                movieId,
            },
        });

        // Se o filme não estiver na biblioteca, retornar um erro
        if (!libraryMovie) {
            throw new Error("Movie not found in the library");
        }

        // Remover o filme da biblioteca
        await prisma.library_Movies.delete({
            where: {
                id: libraryMovie.id,
            },
        });

        return { message: "Movie removed from library" };
    }

    /**
     * Busca todos os filmes em uma biblioteca.
     * @param libraryId - ID da biblioteca.
     * @returns Lista de filmes na biblioteca.
     */
    async findAllMoviesInLibrary(libraryId: number) {
        const libraryMovies = await prisma.library_Movies.findMany({
            where: { libraryId },
            include: { movie: true },
        });

        return libraryMovies.map((lm) => lm.movie);
    }
}

export default new LibraryMoviesService();
