import { Router } from "express";

import * as paymentValidator from "../middlewares/validatorPayment.js"
import * as paymentConroller from "../controllers/paymentController.js"

const paymentsRouter = Router();
paymentsRouter.post("/payment", paymentValidator.paymentValidator, paymentConroller.payment)

export default paymentsRouter;