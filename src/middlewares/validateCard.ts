import { NextFunction, Request, Response } from "express";

import createcardSchema from "../schemas/cardSchema.js";
import activationnSchema from "../schemas/activationSchema.js";
import viewsCardSchema from "../schemas/viewsCardSchema.js";
import blockedSchema from "../schemas/blockedSchema.js";

export function validateCard (req: Request, res: Response, next: NextFunction) {
    const card = req.body;
    const {error} = createcardSchema.validate(card, {abortEarly: false});
    if(error) {
        return res.status(422).send(error.details.map(detail => detail.message));
    };

    next();
};

export function validateActivation (req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const {error} = activationnSchema.validate(data, {abortEarly: false});
    if(error) {
        return res.status(422).send(error.details.map(detail => detail.message));
    };

    next();
}

export function validatePassword (req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const {error} = viewsCardSchema.validate(data, {abortEarly: false});
    if(error) {
        return res.status(422).send(error.details.map(detail => detail.message));
    };

    next();
}

export function validateBlocked (req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const {error} = blockedSchema.validate(data, {abortEarly: false});
    if(error) {
        return res.status(422).send(error.details.map(detail => detail.message));
    };

    next();
}