import { Router } from "express";

import * as rechargeController from "../controllers/rechargeController.js"
import * as rechargeValidate from "../middlewares/validateRecharge.js"

const rechargeRouter = Router();
rechargeRouter.post("/recharge/:cardId", rechargeValidate.validateRecharge, rechargeController.recharge)

export default rechargeRouter;