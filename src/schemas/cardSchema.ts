import Joi from "joi";

const createcardSchema = Joi.object({
    employeeId: Joi.number().required(),
    type: Joi.string().valid("groceries", "restaurants", "transport", "education", "health").required()
})

export default createcardSchema;