import {Vehicle} from "./Vehicle";
import {CarLgvTechRecord, ICarVehicle} from "../../@Types/TechRecords";
import {carValidation, populateVehicleClassCode} from "../utils/validations";
import {ValidationResult} from "@hapi/joi";

export class CarVehicle extends Vehicle<ICarVehicle> {
  constructor(vehicleObj: ICarVehicle) {
    super(vehicleObj);
  }

  protected async create(): Promise<ICarVehicle> {
    console.log("LGV create");
    return super.create();
  }

  protected async update(): Promise<ICarVehicle> {
    return super.update();
  }

  protected validateTechRecordFields(newVehicle: CarLgvTechRecord): ValidationResult {
    console.log("LGV validate tech record fields");
    const options = {abortEarly: false};
    return carValidation.validate(newVehicle, options);
  }

  protected populateFields(techRecord: CarLgvTechRecord): CarLgvTechRecord {
    console.log(`CAR populate fields`);
    if (techRecord.vehicleClass) {
      techRecord.vehicleClass.code = populateVehicleClassCode(techRecord.vehicleClass.description);
    }
    return techRecord;
  }
}
