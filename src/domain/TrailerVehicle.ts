import {Vehicle} from "./Vehicle";
import {ITrailerVehicle, TrlTechRecord} from "../../@Types/TechRecords";
import {checkIfTankOrBattery, featureFlagValidation, trlValidation} from "../utils/validations";
import {ValidationResult} from "@hapi/joi";

export class TrailerVehicle extends Vehicle<ITrailerVehicle> {
  constructor(vehicleObj: ITrailerVehicle) {
    super(vehicleObj);
  }

  public create(): ITrailerVehicle {
    console.log("TRL create");
    return super.create();
  }

  public update(): ITrailerVehicle {
    return super.update();
  }

  public validateTechRecordFields(newVehicle: TrlTechRecord): ValidationResult {
    console.log("TRL validate tech record fields");
    const isTankOrBattery: boolean = checkIfTankOrBattery(newVehicle);
    console.log("is tank or battery", isTankOrBattery);
    const trlOptions = {abortEarly: false, context: {isTankOrBattery}};
    return featureFlagValidation(trlValidation, newVehicle, true, trlOptions);
  }
}
