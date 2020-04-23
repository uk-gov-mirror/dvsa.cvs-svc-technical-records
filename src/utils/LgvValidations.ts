import Joi from "@hapi/joi";
import {VEHICLE_SUBCLASS} from "../assets/Enums";
import {commonSchemaLgvMotorcycleCar} from "./CommonSchema";

export const lgvValidation = commonSchemaLgvMotorcycleCar.keys({
  vehicleSubclass: Joi.array().items(Joi.string().valid(...VEHICLE_SUBCLASS)).required(),
}).required();
