import {Vehicle} from "./Vehicle";
import {IMotorcycleVehicle, MotorcycleTechRecord} from "../../@Types/TechRecords";
import {motorcycleValidation} from "../utils/validations";
import {ValidationResult} from "@hapi/joi";

export class MotorcycleVehicle extends Vehicle<IMotorcycleVehicle> {
  constructor(vehicleObj: IMotorcycleVehicle) {
    super(vehicleObj);
  }

  protected create(): IMotorcycleVehicle {
    console.log("MOTO create");
    return super.create();
  }

  protected update(): IMotorcycleVehicle {
    return super.update();
  }

  protected validateTechRecordFields(newVehicle: MotorcycleTechRecord): ValidationResult {
    console.log("MOTO validate tech record fields");
    const options = {abortEarly: false};
    return motorcycleValidation.validate(newVehicle, options);
  }
}
