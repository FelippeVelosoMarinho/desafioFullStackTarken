// src/services/LibraryService.ts

import prisma from "../../../../.config/client";
import { Library } from "@prisma/client";

class LibraryService {
    /**
     * Cria uma nova biblioteca para um usuário.
     * @param userId - ID do usuário proprietário da biblioteca.
     * @returns A biblioteca criada.
     */
    async create(userId: number): Promise<Library> {
        // Verifica se o usuário já possui uma biblioteca
        const existingLibrary = await prisma.library.findUnique({
            where: { userId },
        });

        if (existingLibrary) {
            throw new Error("O usuário já possui uma biblioteca.");
        }

        const library = await prisma.library.create({
            data: {
                user: { connect: { id: userId } },
            },
        });

        return library;
    }

    /**
     * Busca a biblioteca de um usuário.
     * @param userId - ID do usuário.
     * @returns A biblioteca do usuário ou null se não existir.
     */
    async findUserLibrary(userId: number): Promise<Library | null> {
        const library = await prisma.library.findUnique({
            where: { userId },
            include: {
                movies: {
                    include: {
                        movie: true,
                    },
                },
            },
        });

        return library;
    }

    /**
     * Atualiza os dados de uma biblioteca.
     * @param libraryId - ID da biblioteca.
     * @param data - Dados a serem atualizados.
     * @returns A biblioteca atualizada.
     */
    async update(libraryId: number, data: Partial<Library>): Promise<Library> {
        const library = await prisma.library.update({
            where: { id: libraryId },
            data,
        });

        return library;
    }

    /**
     * Remove uma biblioteca.
     * @param libraryId - ID da biblioteca.
     * @returns A biblioteca removida.
     */
    async remove(libraryId: number): Promise<Library> {
        const library = await prisma.library.delete({
            where: { id: libraryId },
        });

        return library;
    }
}

export default new LibraryService();
