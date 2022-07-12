import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
// import cryptr from "cryptr";
import dayjs from "dayjs";

import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js"
import * as cardRepository from "../repositories/cardRepository.js"

export async function create (apiKey: string, employeeId: number, type: cardRepository.TransactionTypes) {
    const company = await companyRepository.findByApiKey(apiKey);
    const employee = await employeeRepository.findById(employeeId);
    const existingCard = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    
    if (!company || !employee) {
        throw {type: "not_found", message: "no data in the database"}
    } if (existingCard) {
        throw {type: "conflict", message: "employee already have a card with this type"}
    }

    const number = faker.finance.creditCardNumber('mastercard');
    
    const cardholderName = formatNamePrintedCard(employee.fullName);
    
    const expirationDate = dayjs().add(5, "year").format("MM/YY");
    
    const securityCode = faker.finance.creditCardCVV();
    console.log(securityCode)
    const hash = bcrypt.hashSync(securityCode, 8);

    const card = {
        employeeId,
        number,
        cardholderName,
        securityCode: hash,
        expirationDate,
        isVirtual: false,
        isBlocked: false,
        type
    } ;
    await cardRepository.insert(card);

    return {card, securityCode};
}

function formatNamePrintedCard(employeeFullName: string) {
    const nameObject = employeeFullName.split(" ")
    const name = [nameObject[0]];
    for (let i = 1; i < nameObject.length -1; i++) {
        if(nameObject[i].length >= 3) {
            name.push(nameObject[i][0])
        }
    }
    name.push(nameObject[nameObject.length - 1])
    return name.join(" ").toUpperCase();
}

export async function activation(id: number, cvc: string, password: string) {
    // verificar se há um cartão
    const card = await cardRepository.findById(id);
    if (!card) {
        throw {type: "not_found", message: "no data in the database"}
    };
    // verificar se já está vencido
    const today = dayjs().format("MM/YY");
    if (dayjs(today).isAfter(dayjs(card.expirationDate))) {
        throw {type: "bad_request", message: "expired card"}
    };
    // verificar se já possui senha
    if (card.password) {
        throw {type: "conflict", message: "card already has password"}
    };
    // verificar cvc
    const checkCVC = bcrypt.compareSync(cvc, card.securityCode);
    if (!checkCVC) {
        throw { type: "unauthorized", message: "unauthorized"};
    };
    // validação da senha do cartão
    if(!Number(password) || password.length != 4) {
        throw {type: "bad_request", message: "password in wrong format"}
    }
    // criptografando senha do cartão
    const hash = bcrypt.hashSync(password, 8);
    await cardRepository.update(id, {password: hash});
}

export async function viewsCard (employeeId: number, type: cardRepository.TransactionTypes, password: string) {
    // verificar se há um cartão
    const card = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    if (!card) {
        throw {type: "not_found", message: "no data in the database"}
    }
    // verifica se o cartão está ativo
    if (card.isBlocked) {
        throw {type: "not_found", message: "no data in the database"}
    }
    // verifica senha
    const checkPassword = bcrypt.compareSync(password, card.password);
    if(!checkPassword) {
        throw { type: "unauthorized", message: "unauthorized"};
    }
    
    return {
        "cards": [{
            "number": card.number,
            "cardholderName": card.cardholderName,
            "expirationDate": card.expirationDate,
            "securityCode": card.securityCode
        }]
    }
}

export async function blocked (id: number ,password: string) {
    // verificar se há um cartão
    const card = await cardRepository.findById(id);
    if (!card) {
        throw {type: "not_found", message: "no data in the database"}
    };
    // verificar se o cartão está cadastrado
    if (!card.password) {
        throw {type: "not_found", message: "no data in the database"}
    };
    // verificar se já está vencido
    const today = dayjs().format("MM/YY");
    if (dayjs(today).isAfter(dayjs(card.expirationDate))) {
        throw {type: "bad_request", message: "expired card"}
    };
    // verifica se o cartão está ativo
    if (card.isBlocked) {
        throw {type: "not_found", message: "no data in the database"}
    }
    // verifica senha
    const checkPassword = bcrypt.compareSync(password, card.password);
    if(!checkPassword) {
        throw { type: "unauthorized", message: "unauthorized"};
    }
    
    // bloquear cartão
    await cardRepository.update(id, {isBlocked: true})
}

export async function unBlocked (id: number ,password: string) {
    // verificar se há um cartão
    const card = await cardRepository.findById(id);
    if (!card) {
        throw {type: "not_found", message: "no data in the database"}
    };
    // verificar se o cartão está cadastrado
    if (!card.password) {
        throw {type: "not_found", message: "no data in the database"}
    };
    // verificar se já está vencido
    const today = dayjs().format("MM/YY");
    if (dayjs(today).isAfter(dayjs(card.expirationDate))) {
        throw {type: "bad_request", message: "expired card"}
    };
    // verifica se o cartão está ativo
    if (!card.isBlocked) {
        throw {type: "not_found", message: "no data in the database"}
    }
    // verifica senha
    const checkPassword = bcrypt.compareSync(password, card.password);
    if(!checkPassword) {
        throw { type: "unauthorized", message: "unauthorized"};
    }
    
    // desbloquear cartão
    await cardRepository.update(id, {isBlocked: false})
}