import { Router, Request, Response, NextFunction } from "express";
import { statusCodes } from "../../../../utils/statusCodes";
import UserService from "../services/UserService";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.findAll();
    res.status(statusCodes.SUCCESS).json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.findOne(Number(req.params.id));
    res.status(statusCodes.SUCCESS).json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.create(req.body);
    res.status(statusCodes.CREATED).json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.update(Number(req.params.id), req.body);
    res.status(statusCodes.SUCCESS).json(user);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserService.remove(Number(req.params.id));
      res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
      next(error);
    }
  }
);

export default router;