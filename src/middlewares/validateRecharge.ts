import { NextFunction, Request, Response } from "express";

import rechargeSchema from "../schemas/rechargeSchema.js";

export function validateRecharge (req: Request, res: Response, next: NextFunction) {
    const amount = req.body;
    const {error} = rechargeSchema.validate(amount, {abortEarly: false});
    if(error) {
        return res.status(422).send(error.details.map(detail => detail.message));
    };

    next();
}