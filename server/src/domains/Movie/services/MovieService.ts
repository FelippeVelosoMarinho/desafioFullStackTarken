// src/services/MovieService.ts

import prisma from "../../../../.config/client";
import { Movie } from "@prisma/client";

class MovieService {
    /**
     * Cria um novo filme.
     * @param data - Dados do filme a serem criados.
     * @returns O filme criado.
     */
    async create(data: {
        name: string;
        posterUrl: string;
        imdbGrade: number;
        releaseDate: Date;
        genre: string;
        description: string;
    }): Promise<Movie> {
        const movie = await prisma.movie.create({
            data,
        });

        return movie;
    }

    /**
     * Busca todos os filmes.
     * @returns Lista de todos os filmes.
     */
    async findAll(): Promise<Movie[]> {
        return await prisma.movie.findMany();
    }

    /**
     * Busca um filme por ID.
     * @param id - ID do filme.
     * @returns O filme encontrado ou null se não existir.
     */
    async findOne(id: number): Promise<Movie | null> {
        return await prisma.movie.findUnique({
            where: { id },
        });
    }

    /**
     * Atualiza os dados de um filme.
     * @param id - ID do filme.
     * @param data - Dados a serem atualizados.
     * @returns O filme atualizado.
     */
    async update(id: number, data: Partial<Movie>): Promise<Movie> {
        return await prisma.movie.update({
            where: { id },
            data,
        });
    }

    /**
     * Remove um filme.
     * @param id - ID do filme.
     * @returns O filme removido.
     */
    async remove(id: number): Promise<Movie> {
        return await prisma.movie.delete({
            where: { id },
        });
    }
}

export default new MovieService();
