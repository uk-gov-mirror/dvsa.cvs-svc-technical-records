import {Vehicle} from "./Vehicle";
import {CarLgvTechRecord, ICarVehicle} from "../../@Types/TechRecords";
import {carValidation} from "../utils/validations";
import {ValidationResult} from "@hapi/joi";

export class CarVehicle extends Vehicle<ICarVehicle> {
  constructor(vehicleObj: ICarVehicle) {
    super(vehicleObj);
  }

  protected create(): ICarVehicle {
    console.log("LGV create");
    return super.create();
  }

  protected update(): ICarVehicle {
    return super.update();
  }

  protected validateTechRecordFields(newVehicle: CarLgvTechRecord): ValidationResult {
    console.log("LGV validate tech record fields");
    const options = {abortEarly: false};
    return carValidation.validate(newVehicle, options);
  }
}
