import { Router, Request, Response, NextFunction } from "express";
import { statusCodes } from "../../../../utils/statusCodes";
import ReviewService from "../services/ReviewService";

const router = Router();

/**
 * @route   POST /reviews
 * @desc    Cria uma nova resenha
 * @access  Public (Considerar autenticação)
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, audioUri, rating, userId, movieId } = req.body;

    if (!content && !audioUri) {
      return res.status(statusCodes.BAD_REQUEST).json({ error: "content ou audioUri são obrigatórios." });
    }
    if (rating === undefined || !userId || !movieId) {
      return res.status(statusCodes.BAD_REQUEST).json({ error: "rating, userId e movieId são obrigatórios." });
    }

    const review = await ReviewService.create({
      content,
      audioUri,
      rating,
      userId,
      movieId,
    });

    res.status(statusCodes.CREATED).json(review);
  } catch (error) {
    next(error);
  }
});


/**
 * @route   GET /reviews
 * @desc    Busca todas as resenhas
 * @access  Public
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await ReviewService.findAll();
    res.status(statusCodes.SUCCESS).json(reviews);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /reviews/:id
 * @desc    Busca uma resenha por ID
 * @access  Public
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (id === "") {
      return res.status(statusCodes.BAD_REQUEST).json({ error: "ID da resenha inválido." });
    }

    const review = await ReviewService.findOne(id);

    if (!review) {
      return res.status(statusCodes.NOT_FOUND).json({ error: "Resenha não encontrada." });
    }

    res.status(statusCodes.SUCCESS).json(review);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /reviews/:id
 * @desc    Atualiza uma resenha
 * @access  Public (Considerar autenticação)
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { content, audioUri, rating, userId, movieId } = req.body;

    if (!content && !audioUri) {
      return res.status(statusCodes.BAD_REQUEST).json({ error: "content ou audioUri são obrigatórios." });
    }

    if (id === "") {
      return res.status(statusCodes.BAD_REQUEST).json({ error: "ID da resenha inválido." });
    }

    const updatedReview = await ReviewService.update(id, {
      content,
      audioUri,
      rating,
      userId,
      movieId,
    });

    res.status(statusCodes.SUCCESS).json(updatedReview);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /reviews/:id
 * @desc    Remove uma resenha
 * @access  Public (Considerar autenticação)
 */
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (id === "") {
      return res.status(statusCodes.BAD_REQUEST).json({ error: "ID da resenha inválido." });
    }

    const removedReview = await ReviewService.remove(id);
    res.status(statusCodes.SUCCESS).json({ message: "Resenha removida com sucesso.", removedReview });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /reviews/user/:userId
 * @desc    Busca resenhas por usuário
 * @access  Public
 */
router.get("/user/:userId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      return res.status(statusCodes.BAD_REQUEST).json({ error: "userId inválido." });
    }

    const reviews = await ReviewService.findByUser(userId);
    res.status(statusCodes.SUCCESS).json(reviews);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /reviews/movie/:movieId
 * @desc    Busca resenhas por filme
 * @access  Public
 */
router.get("/movie/:movieId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movieId = req.params.movieId;

    if (movieId == "") {
      return res.status(statusCodes.BAD_REQUEST).json({ error: "movieId inválido." });
    }

    const reviews = await ReviewService.findByMovie(movieId);
    res.status(statusCodes.SUCCESS).json(reviews);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /reviews/movie/:movieId
 * @desc    Deleta resenhas por filme
 * @access  Public
 */
router.delete("/movie/:movieId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { movieId } = req.params;

    if (!movieId || movieId.trim() === "") {
      return res.status(400).json({ error: "movieId inválido." });
    }

    // Verifica se existem reviews associadas ao filme
    const reviews = await ReviewService.findByMovie(movieId);
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ error: "Nenhuma review encontrada para este filme." });
    }

    // Deleta todas as reviews associadas ao movieId
    await ReviewService.deleteByMovie(movieId);

    return res.status(200).json({ message: "Todas as reviews do filme foram excluídas com sucesso." });
  } catch (error) {
    next(error);
  }
});


export default router;
