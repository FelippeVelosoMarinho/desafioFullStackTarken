// src/services/ReviewService.ts

import prisma from "../../../../.config/client";
import { Review } from "@prisma/client";

class ReviewService {
    /**
     * Cria uma nova resenha.
     * @param data - Dados da resenha a serem criados.
     * @returns A resenha criada.
     */
    async create(data: {
        content: string;
        rating: number;
        userId: number;
        movieId: string;
    }): Promise<Review> {
        // Validação opcional: Verificar se o usuário e o filme existem
        const user = await prisma.user.findUnique({ where: { id: data.userId } });
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        const movie = await prisma.movie.findUnique({ where: { id: data.movieId } });
        if (!movie) {
            throw new Error("Filme não encontrado.");
        }

        const review = await prisma.review.create({
            data,
        });

        return review;
    }

    /**
     * Busca todas as resenhas.
     * @returns Lista de todas as resenhas.
     */
    async findAll(): Promise<Review[]> {
        return await prisma.review.findMany({
            include: {
                user: {
                    select: { id: true, name: true },
                },
                movie: {
                    select: { id: true, name: true },
                },
            },
        });
    }

    /**
     * Busca uma resenha por ID.
     * @param id - ID da resenha.
     * @returns A resenha encontrada ou null se não existir.
     */
    async findOne(id: number): Promise<Review | null> {
        return await prisma.review.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true },
                },
                movie: {
                    select: { id: true, name: true },
                },
            },
        });
    }

    /**
     * Atualiza os dados de uma resenha.
     * @param id - ID da resenha.
     * @param data - Dados a serem atualizados.
     * @returns A resenha atualizada.
     */
    async update(id: number, data: Partial<Review>): Promise<Review> {
        // Se o rating for atualizado, você pode adicionar validações adicionais
        if (data.rating && (data.rating < 1 || data.rating > 10)) {
            throw new Error("A nota deve estar entre 1 e 10.");
        }

        return await prisma.review.update({
            where: { id },
            data,
        });
    }

    /**
     * Remove uma resenha.
     * @param id - ID da resenha.
     * @returns A resenha removida.
     */
    async remove(id: number): Promise<Review> {
        return await prisma.review.delete({
            where: { id },
        });
    }

    /**
     * Busca resenhas por usuário.
     * @param userId - ID do usuário.
     * @returns Lista de resenhas do usuário.
     */
    async findByUser(userId: number): Promise<Review[]> {
        return await prisma.review.findMany({
            where: { userId },
            include: {
                movie: {
                    select: { id: true, name: true },
                },
            },
        });
    }

    /**
     * Busca resenhas por filme.
     * @param movieId - ID do filme.
     * @returns Lista de resenhas do filme.
     */
    async findByMovie(movieId: string): Promise<Review[]> {
        return await prisma.review.findMany({
            where: { movieId },
            include: {
                user: {
                    select: { id: true, name: true },
                },
            },
        });
    }
}

export default new ReviewService();
