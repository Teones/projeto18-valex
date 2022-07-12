import Joi from "joi";

const viewsCardSchema = Joi.object({
    type: Joi.string().valid("groceries", "restaurants", "transport", "education", "health").required(),
    password: Joi.string().min(4).max(4).pattern(/^[0-9]+$/).required(),
})

export default viewsCardSchema;