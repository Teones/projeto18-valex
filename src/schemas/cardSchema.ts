import Joi from "joi";

const createcardSchema = Joi.object({
    type: Joi.string().valid("groceries", "restaurants", "transport", "education", "health").required()
})

export default createcardSchema;