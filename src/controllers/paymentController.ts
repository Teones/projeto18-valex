import { Request, Response } from "express";

import * as paymentServices from "../services/paymentSerice.js"

export async function payment (req: Request, res: Response) {
    const {cardId, password, businessId, amount} = req.body;

    await paymentServices.payment(cardId, password, businessId, amount)

    return res.sendStatus(200)
}