import { Router, Request, Response, NextFunction } from "express";
import { statusCodes } from "../../../../utils/statusCodes";
import LibraryMoviesService from "../services/LibraryMoviesService";

const router = Router();

/**
 * @route   POST /libraries/:libraryId/movies
 * @desc    Adiciona um filme à biblioteca de um usuário
 * @access  Public (Considerar autenticação)
 */
router.post("/:libraryId/movies", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const libraryId = Number(req.params.libraryId);
        const { movieId } = req.body;

        if (isNaN(libraryId) || !movieId) {
            return res.status(statusCodes.BAD_REQUEST).json({ error: "libraryId e movieId são obrigatórios e devem ser válidos." });
        }

        const libraryMovie = await LibraryMoviesService.addMovieToLibrary(libraryId, movieId);
        res.status(statusCodes.CREATED).json({ message: "Filme adicionado à biblioteca com sucesso.", libraryMovie });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /libraries/:libraryId/movies/:movieId
 * @desc    Remove um filme da biblioteca de um usuário
 * @access  Public (Considerar autenticação)
 */
router.delete("/:libraryId/movies/:movieId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const libraryId = Number(req.params.libraryId);
        const movieId = Number(req.params.movieId);

        if (isNaN(libraryId) || isNaN(movieId)) {
            return res.status(statusCodes.BAD_REQUEST).json({ error: "libraryId e movieId devem ser números válidos." });
        }

        const removedLibraryMovie = await LibraryMoviesService.removeMovieFromLibrary(libraryId, movieId);
        res.status(statusCodes.SUCCESS).json({ message: "Filme removido da biblioteca com sucesso.", removedLibraryMovie });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /libraries/:libraryId/movies
 * @desc    Busca todos os filmes na biblioteca de um usuário
 * @access  Public (Considerar autenticação)
 */
router.get("/:libraryId/movies", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const libraryId = Number(req.params.libraryId);

        if (isNaN(libraryId)) {
            return res.status(statusCodes.BAD_REQUEST).json({ error: "libraryId inválido." });
        }

        const movies = await LibraryMoviesService.findAllMoviesInLibrary(libraryId);
        res.status(statusCodes.SUCCESS).json(movies);
    } catch (error) {
        next(error);
    }
});

export default router;
