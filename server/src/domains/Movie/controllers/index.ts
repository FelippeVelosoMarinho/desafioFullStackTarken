import { Router, Request, Response, NextFunction } from "express";
import { statusCodes } from "../../../../utils/statusCodes";
import MovieService from "../services/MovieService";

const router = Router();

/**
 * @route   POST /movies
 * @desc    Cria um novo filme
 * @access  Public (Considerar autenticação)
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name, posterUrl, imdbGrade, releaseDate, genre, description } = req.body;

    if (id === "" || !name || !posterUrl || imdbGrade === undefined || !releaseDate || !genre || !description) {
      return res.status(statusCodes.BAD_REQUEST).json({ error: "Todos os campos são obrigatórios." });
    }

    const movie = await MovieService.create({
      id,
      name,
      posterUrl,
      imdbGrade,
      releaseDate: new Date(releaseDate),
      genre,
      description,
    });

    res.status(statusCodes.CREATED).json(movie);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /movies
 * @desc    Busca todos os filmes
 * @access  Public
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movies = await MovieService.findAll();
    res.status(statusCodes.SUCCESS).json(movies);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /movies/:id
 * @desc    Busca um filme por ID
 * @access  Public
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (id === "") {
      return res.status(statusCodes.BAD_REQUEST).json({ error: "ID do filme inválido." });
    }

    const movie = await MovieService.findOne(id);

    if (!movie) {
      return res.status(statusCodes.NOT_FOUND).json({ error: "Filme não encontrado." });
    }

    res.status(statusCodes.SUCCESS).json(movie);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /movies/:id
 * @desc    Atualiza os dados de um filme
 * @access  Public (Considerar autenticação)
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { name, posterUrl, imdbGrade, releaseDate, genre, description } = req.body;

    if (id === "") {
      return res.status(statusCodes.BAD_REQUEST).json({ error: "ID do filme inválido." });
    }

    const updatedMovie = await MovieService.update(id, {
      name,
      posterUrl,
      imdbGrade,
      releaseDate: releaseDate ? new Date(releaseDate) : undefined,
      genre,
      description,
    });

    res.status(statusCodes.SUCCESS).json(updatedMovie);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /movies/:id
 * @desc    Remove um filme
 * @access  Public (Considerar autenticação)
 */
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (id === "") {
      return res.status(statusCodes.BAD_REQUEST).json({ error: "ID do filme inválido." });
    }

    const removedMovie = await MovieService.remove(id);
    res.status(statusCodes.SUCCESS).json({ message: "Filme removido com sucesso.", removedMovie });
  } catch (error) {
    next(error);
  }
});

export default router;
