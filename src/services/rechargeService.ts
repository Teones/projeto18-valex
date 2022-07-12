import dayjs from "dayjs";

import * as cardRepository from "../repositories/cardRepository.js"
import * as rechargeRepository from "../repositories/rechargeRepository.js"

export async function recharge (cardId: number, amount: number) {
    // verificar se há um cartão
    const card = await cardRepository.findById(cardId);
    if (!card) {
        throw {type: "not_found", message: "no data in the database"}
    };
    // verificar se o cartão está cadastrado
    if (!card.password) {
        throw {type: "not_found", message: "no data in the database"}
    };
    // verifica se o cartão está ativo
    if (card.isBlocked) {
        throw {type: "not_found", message: "no data in the database"}
    }
    // verificar se já está vencido
    const today = dayjs().format("MM/YY");
    if (dayjs(today).isAfter(dayjs(card.expirationDate))) {
        throw {type: "bad_request", message: "expired card"}
    };

    // fazer recarga
    await rechargeRepository.insert({cardId, amount})
}