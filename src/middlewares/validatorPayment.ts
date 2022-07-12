import { NextFunction, Request, Response } from "express";

import paymentSchema from "../schemas/paymentSchema.js";

export function paymentValidator (req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const {error} = paymentSchema.validate(data, {abortEarly: false});
    if(error) {
        return res.status(422).send(error.details.map(detail => detail.message));
    };

    next();
}