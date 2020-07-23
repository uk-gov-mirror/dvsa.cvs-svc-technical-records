import {Vehicle} from "./Vehicle";
import {IPublicServiceVehicle, PsvTechRecord} from "../../@Types/TechRecords";
import {psvValidation} from "../utils/validations";
import {ValidationResult} from "@hapi/joi";

export class PublicServiceVehicle extends Vehicle<IPublicServiceVehicle> {
  constructor(vehicleObj: IPublicServiceVehicle) {
    super(vehicleObj);
  }

  protected create(): IPublicServiceVehicle {
    console.log("PSV create");
    return super.create();
  }

  protected update(): IPublicServiceVehicle {
    return super.update();
  }

  protected validateTechRecordFields(newVehicle: PsvTechRecord): ValidationResult {
    console.log("PSV validate tech record fields");
    const options = {abortEarly: false};
    return psvValidation.validate(newVehicle, options);
  }
}
