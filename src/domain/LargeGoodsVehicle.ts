import {Vehicle} from "./Vehicle";
import {CarLgvTechRecord, ILargeGoodsVehicle} from "../../@Types/TechRecords";
import {lgvValidation} from "../utils/validations";
import {ValidationResult} from "@hapi/joi";

export class LargeGoodsVehicle extends Vehicle<ILargeGoodsVehicle> {
  constructor(vehicleObj: ILargeGoodsVehicle) {
    super(vehicleObj);
  }

  protected create(): ILargeGoodsVehicle {
    console.log("LGV create");
    return super.create();
  }

  protected update(): ILargeGoodsVehicle {
    return super.update();
  }

  protected validateTechRecordFields(newVehicle: CarLgvTechRecord): ValidationResult {
    console.log("LGV validate tech record fields");
    const options = {abortEarly: false};
    return lgvValidation.validate(newVehicle, options);
  }
}
