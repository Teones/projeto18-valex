import { Router } from "express";

import * as cardController from "../controllers/cardController.js"
import * as validateCard from "../middlewares/validateCard.js"

const cardRouter = Router();
cardRouter.post("/cards", validateCard.validateCard, cardController.create);
cardRouter.post("/cards/:id/activate", validateCard.validateActivation, cardController.activation);
cardRouter.get("/cards/:employeeId", validateCard.validatePassword, cardController.viewsCard);
// cardRouter.get("/cards/")
cardRouter.put("/cards/:id/blocked", validateCard.validateBlocked, cardController.blocked);
cardRouter.put("/cards/:id/unBlocked", validateCard.validateBlocked, cardController.unBlocked)

export default cardRouter;