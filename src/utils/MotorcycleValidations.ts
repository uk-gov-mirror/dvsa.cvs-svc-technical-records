import Joi from "@hapi/joi";
import {commonSchemaLgvMotorcycleCar} from "./CommonSchema";

export const motorcycleValidation = commonSchemaLgvMotorcycleCar.keys({
  numberOfWheelsDriven: Joi.number().min(0).max(9999).required().allow(null),
}).required();
