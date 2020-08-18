import {Vehicle} from "./Vehicle";
import {ITrailerVehicle, TrlTechRecord} from "../../@Types/TechRecords";
import {
  checkIfTankOrBattery,
  featureFlagValidation,
  populateBodyTypeCode,
  populateVehicleClassCode,
  trlValidation
} from "../utils/validations";
import {ValidationResult} from "@hapi/joi";
import {NumberGenerator} from "../handlers/NumberGenerator";

export class TrailerVehicle extends Vehicle<ITrailerVehicle> {
  constructor(vehicleObj: ITrailerVehicle, numberGenerator: NumberGenerator) {
    super(vehicleObj, numberGenerator);
  }

  protected async create(): Promise<ITrailerVehicle> {
    console.log("TRL create");
    const newVehicle: ITrailerVehicle = await super.create();
    console.log("Generating trailer ID");
    newVehicle.trailerId = await this.getNumberGenerator().generateTrailerId();
    return newVehicle;
  }

  protected async update(): Promise<ITrailerVehicle> {
    return super.update();
  }

  protected validateTechRecordFields(newVehicle: TrlTechRecord): ValidationResult {
    console.log("TRL validate tech record fields");
    const isTankOrBattery: boolean = checkIfTankOrBattery(newVehicle);
    console.log("is tank or battery", isTankOrBattery);
    const trlOptions = {abortEarly: false, context: {isTankOrBattery}};
    return featureFlagValidation(trlValidation, newVehicle, true, trlOptions);
  }

  protected populateFields(techRecord: TrlTechRecord): TrlTechRecord {
    console.log(`TRL populate fields`);
    techRecord.bodyType.code = populateBodyTypeCode(techRecord.bodyType.description);
    techRecord.vehicleClass.code = populateVehicleClassCode(techRecord.vehicleClass.description);
    return techRecord;
  }
}
