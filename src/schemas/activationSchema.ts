import Joi from "joi";

const activationnSchema = Joi.object({
    cvc: Joi.string().required(),
    password: Joi.string().min(4).max(4).pattern(/^[0-9]+$/).required(),
})

export default activationnSchema;