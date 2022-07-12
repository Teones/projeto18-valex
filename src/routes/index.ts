import { Router } from "express";

import cardRouter from "./cardRoute.js";
import paymentsRouter from "./paymentsRouter.js";
import rechargeRouter from "./rechargeRouter.js";

const router = Router();
router.use(cardRouter);
router.use(rechargeRouter);
router.use(paymentsRouter);

export default router;