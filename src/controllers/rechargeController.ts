import { Request, Response } from "express";

import * as rechargeService from "../services/rechargeService.js"

export async function recharge (req: Request, res: Response) {
    const {cardId} = req.params;
    if (!cardId) return res.sendStatus(401);

    const {amount} = req.body;
    await rechargeService.recharge(Number(cardId), amount)

    return res.sendStatus(200)
}