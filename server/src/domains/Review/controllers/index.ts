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
    const { content, rating, userId, movieId } = req.body;

    if (!content || rating === undefined || !userId || !movieId) {
      return res.status(statusCodes.BAD_REQUEST).json({ error: "content, rating, userId e movieId são obrigatórios." });
    }

    const review = await ReviewService.create({
      content,
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
    const id = Number(req.params.id);

    if (isNaN(id)) {
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
    const id = Number(req.params.id);
    const { content, rating, userId, movieId } = req.body;

    if (isNaN(id)) {
      return res.status(statusCodes.BAD_REQUEST).json({ error: "ID da resenha inválido." });
    }

    const updatedReview = await ReviewService.update(id, {
      content,
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
    const id = Number(req.params.id);

    if (isNaN(id)) {
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

export default router;
