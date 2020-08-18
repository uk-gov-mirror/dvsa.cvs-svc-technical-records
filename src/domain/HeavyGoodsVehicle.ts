import {Vehicle} from "./Vehicle";
import {HgvTechRecord, IHeavyGoodsVehicle} from "../../@Types/TechRecords";
import {
  checkIfTankOrBattery,
  featureFlagValidation,
  hgvValidation,
  populateBodyTypeCode,
  populateVehicleClassCode
} from "../utils/validations";
import {ValidationResult} from "@hapi/joi";
import {NumberGenerator} from "../handlers/NumberGenerator";

export class HeavyGoodsVehicle extends Vehicle<IHeavyGoodsVehicle> {
  constructor(vehicleObj: IHeavyGoodsVehicle, numberGenerator: NumberGenerator) {
    super(vehicleObj, numberGenerator);
  }

  protected async create(): Promise<IHeavyGoodsVehicle> {
    console.log("HGV create");
    return super.create();
  }

  protected async update(): Promise<IHeavyGoodsVehicle> {
    return super.update();
  }

  protected validateTechRecordFields(newVehicle: HgvTechRecord): ValidationResult {
    console.log("HGV validate tech record fields");
    const isTankOrBattery: boolean = checkIfTankOrBattery(newVehicle);
    console.log("is tank or battery", isTankOrBattery);
    const hgvOptions = {abortEarly: false, context: {isTankOrBattery}};
    return featureFlagValidation(hgvValidation, newVehicle, true, hgvOptions);
  }

  protected populateFields(techRecord: HgvTechRecord): HgvTechRecord {
    console.log(`HGV populate fields`);
    techRecord.bodyType.code = populateBodyTypeCode(techRecord.bodyType.description);
    techRecord.vehicleClass.code = populateVehicleClassCode(techRecord.vehicleClass.description);
    return techRecord;
  }
}
