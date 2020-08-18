import {Vehicle} from "./Vehicle";
import {IMotorcycleVehicle, MotorcycleTechRecord} from "../../@Types/TechRecords";
import {motorcycleValidation, populateVehicleClassCode} from "../utils/validations";
import {ValidationResult} from "@hapi/joi";
import {NumberGenerator} from "../handlers/NumberGenerator";

export class MotorcycleVehicle extends Vehicle<IMotorcycleVehicle> {
  constructor(vehicleObj: IMotorcycleVehicle, numberGenerator: NumberGenerator) {
    super(vehicleObj, numberGenerator);
  }

  protected async create(): Promise<IMotorcycleVehicle> {
    console.log("MOTO create");
    return super.create();
  }

  protected async update(): Promise<IMotorcycleVehicle> {
    return super.update();
  }

  protected validateTechRecordFields(newVehicle: MotorcycleTechRecord): ValidationResult {
    console.log("MOTO validate tech record fields");
    const options = {abortEarly: false};
    return motorcycleValidation.validate(newVehicle, options);
  }

  protected populateFields(techRecord: MotorcycleTechRecord): MotorcycleTechRecord {
    console.log(`MOTO populate fields`);
    techRecord.vehicleClass.code = populateVehicleClassCode(techRecord.vehicleClass.description);
    return techRecord;
  }
}
