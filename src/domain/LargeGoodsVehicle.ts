import {Vehicle} from "./Vehicle";
import {CarLgvTechRecord, ILargeGoodsVehicle} from "../../@Types/TechRecords";
import {lgvValidation, populateVehicleClassCode} from "../utils/validations";
import {ValidationResult} from "@hapi/joi";
import {NumberGenerator} from "../handlers/NumberGenerator";

export class LargeGoodsVehicle extends Vehicle<ILargeGoodsVehicle> {
  constructor(vehicleObj: ILargeGoodsVehicle, numberGenerator: NumberGenerator) {
    super(vehicleObj, numberGenerator);
  }

  protected async create(): Promise<ILargeGoodsVehicle> {
    console.log("LGV create");
    return super.create();
  }

  protected async update(): Promise<ILargeGoodsVehicle> {
    return super.update();
  }

  protected validateTechRecordFields(newVehicle: CarLgvTechRecord): ValidationResult {
    console.log("LGV validate tech record fields");
    const options = {abortEarly: false};
    return lgvValidation.validate(newVehicle, options);
  }

  protected populateFields(techRecord: CarLgvTechRecord): CarLgvTechRecord {
    console.log(`LGV populate fields`);
    if (techRecord.vehicleClass) {
      techRecord.vehicleClass.code = populateVehicleClassCode(techRecord.vehicleClass.description);
    }
    return techRecord;
  }
}
