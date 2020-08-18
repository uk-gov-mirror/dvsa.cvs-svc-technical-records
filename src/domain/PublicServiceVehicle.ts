import {Vehicle} from "./Vehicle";
import {IPublicServiceVehicle, PsvTechRecord} from "../../@Types/TechRecords";
import {populateBodyTypeCode, populateVehicleClassCode, psvValidation} from "../utils/validations";
import {ValidationResult} from "@hapi/joi";
import {NumberGenerator} from "../handlers/NumberGenerator";

export class PublicServiceVehicle extends Vehicle<IPublicServiceVehicle> {
  constructor(vehicleObj: IPublicServiceVehicle, numberGenerator: NumberGenerator) {
    super(vehicleObj, numberGenerator);
  }

  protected async create(): Promise<IPublicServiceVehicle> {
    console.log("PSV create");
    return super.create();
  }

  protected async update(): Promise<IPublicServiceVehicle> {
    return super.update();
  }

  protected validateTechRecordFields(newVehicle: PsvTechRecord): ValidationResult {
    console.log("PSV validate tech record fields");
    const options = {abortEarly: false};
    return psvValidation.validate(newVehicle, options);
  }

  protected populateFields(techRecord: PsvTechRecord): PsvTechRecord {
    console.log(`PSV populate fields`);
    techRecord.bodyType.code = populateBodyTypeCode(techRecord.bodyType.description);
    techRecord.vehicleClass.code = populateVehicleClassCode(techRecord.vehicleClass.description);
    techRecord.brakes.brakeCodeOriginal = techRecord.brakes.brakeCode.substring(techRecord.brakes.brakeCode.length - 3);
    techRecord.brakeCode = techRecord.brakes.brakeCode;
    return techRecord;
  }
}
