import {Vehicle} from "./Vehicle";
import {HgvTechRecord, IHeavyGoodsVehicle} from "../../@Types/TechRecords";
import {checkIfTankOrBattery, featureFlagValidation, hgvValidation} from "../utils/validations";
import {ValidationResult} from "@hapi/joi";

export class HeavyGoodsVehicle extends Vehicle<IHeavyGoodsVehicle> {
  constructor(vehicleObj: IHeavyGoodsVehicle) {
    super(vehicleObj);
  }

  protected create(): IHeavyGoodsVehicle {
    console.log("HGV create");
    return super.create();
  }

  protected update(): IHeavyGoodsVehicle {
    return super.update();
  }

  protected validateTechRecordFields(newVehicle: HgvTechRecord): ValidationResult {
    console.log("HGV validate tech record fields");
    const isTankOrBattery: boolean = checkIfTankOrBattery(newVehicle);
    console.log("is tank or battery", isTankOrBattery);
    const hgvOptions = {abortEarly: false, context: {isTankOrBattery}};
    return featureFlagValidation(hgvValidation, newVehicle, true, hgvOptions);
  }
}
