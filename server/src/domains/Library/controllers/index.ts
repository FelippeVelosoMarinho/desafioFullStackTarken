import { Router, Request, Response, NextFunction } from "express";
import { statusCodes } from "../../../../utils/statusCodes";
import LibraryService from "../services/LibraryService";

const router = Router();

/**
 * @route   POST /libraries
 * @desc    Cria uma nova biblioteca para um usuário
 * @access  Public (Considerar autenticação)
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(statusCodes.BAD_REQUEST).json({ error: "userId é obrigatório." });
        }

        const library = await LibraryService.create(userId);
        res.status(statusCodes.CREATED).json(library);
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /libraries/:userId
 * @desc    Busca a biblioteca de um usuário específico
 * @access  Public (Considerar autenticação)
 */
router.get("/:userId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.userId);

        if (isNaN(userId)) {
            return res.status(statusCodes.BAD_REQUEST).json({ error: "userId inválido." });
        }

        const library = await LibraryService.findUserLibrary(userId);

        if (!library) {
            return res.status(statusCodes.NOT_FOUND).json({ error: "Biblioteca não encontrada para este usuário." });
        }

        res.status(statusCodes.SUCCESS).json(library);
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /libraries/:libraryId
 * @desc    Atualiza os dados de uma biblioteca
 * @access  Public (Considerar autenticação)
 */
router.put("/:libraryId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const libraryId = Number(req.params.libraryId);

        if (isNaN(libraryId)) {
            return res.status(statusCodes.BAD_REQUEST).json({ error: "libraryId inválido." });
        }

        const updatedLibrary = await LibraryService.update(libraryId, req.body);
        res.status(statusCodes.SUCCESS).json(updatedLibrary);
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /libraries/:libraryId
 * @desc    Remove uma biblioteca
 * @access  Public (Considerar autenticação)
 */
router.delete("/:libraryId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const libraryId = Number(req.params.libraryId);

        if (isNaN(libraryId)) {
            return res.status(statusCodes.BAD_REQUEST).json({ error: "libraryId inválido." });
        }

        const removedLibrary = await LibraryService.remove(libraryId);
        res.status(statusCodes.SUCCESS).json({ message: "Biblioteca removida com sucesso.", removedLibrary });
    } catch (error) {
        next(error);
    }
});

export default router;
