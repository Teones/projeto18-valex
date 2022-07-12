import { Request, Response } from "express";

import * as cardService from '../services/cardService.js'

export async function create(req: Request, res: Response) {
    const apiKey = req.headers["x-api-key"] as string;
    if (!apiKey) return res.sendStatus(401);

    const { employeeId, type } = req.body;
    const card = await cardService.create(apiKey, employeeId, type);

    return res.status(201).send(card);    // created
}

export async function activation (req: Request, res: Response) {
    const {id} = req.params;
    const {cvc, password} = req.body;

    await cardService.activation(Number(id), cvc, password);

    return res.sendStatus(200)
}

export async function viewsCard (req: Request, res: Response) {
    const {employeeId} = req.params;
    const {password, type} = req.body;

    const cards = await cardService.viewsCard (Number(employeeId),type, password)

    return res.status(200).send(cards)
}

export async function blocked(req: Request, res: Response) {
    const {id} = req.params;
    const {password} = req.body;

    await cardService.blocked (Number(id) ,password)

    return res.sendStatus(200)
}

export async function unBlocked(req: Request, res: Response) {
    const {id} = req.params;
    const {password} = req.body;

    await cardService.unBlocked (Number(id) ,password)

    return res.sendStatus(200)
}