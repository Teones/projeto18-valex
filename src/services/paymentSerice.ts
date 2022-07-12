import dayjs from "dayjs";
import bcrypt from "bcrypt";

import * as cardRepository from "../repositories/cardRepository.js"
import * as businessRepository from "../repositories/businessRepository.js"
import * as rechargeRepository from "../repositories/rechargeRepository.js"
import * as paymentRepository from "../repositories/paymentRepository.js"

export async function payment (cardId: number, password: string, businessId: number, amount: number) {
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
    // verifica senha do cartão
    const checkPassword = bcrypt.compareSync(password, card.password);
    if(!checkPassword) {
        throw { type: "unauthorized", message: "unauthorized"};
    }
    // verificar estabelecimento
    const checkBusiness = await businessRepository.findById(businessId);
    if(!checkBusiness) {
        throw {type: "bad_request", message: "unregistered business"}
    }
    // verificar tipo do cartão
    if(checkBusiness.type !== card.type) {
        throw { type: "unauthorized", message: "unauthorized"};
    }
    // verificar saldo
    const recharges = await rechargeRepository.findByCardId(cardId);
    const payments = await paymentRepository.findByCardId(cardId)
    const cardBalance = getCardBalance(recharges, payments)
    if (cardBalance < amount) {
        throw { type: "unauthorized", message: "unauthorized"};
    }
    
    // realizar compra
    await paymentRepository.insert({cardId, businessId, amount})
}

function getCardBalance(
    recharges: rechargeRepository.Recharge[], 
    payments: paymentRepository.PaymentWithBusinessName[]) 
{
    let totalRecharges = 0;
    if(recharges.length > 0) {
        for(let i = 0; i < recharges.length; i++) {
            totalRecharges += recharges[i].amount
        }
    }
    let totalPayments = 0;
    if(payments.length > 0) {
        for(let i = 0; i < payments.length; i++) {
            totalPayments += payments[i].amount
        }
    }

    const balance = totalRecharges - totalPayments
    return balance
}