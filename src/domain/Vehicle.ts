import {IVehicle, TechRecord} from "../../@Types/TechRecords";
import {checkValidationErrors, validateVrms} from "../utils/validations";
import HTTPError from "../models/HTTPError";
import {ValidationResult} from "@hapi/joi";
import {formatErrorMessage} from "../utils/formatErrorMessage";

export abstract class Vehicle<T extends IVehicle> {
  private readonly vehicle: T;

  protected constructor(vehicleObj: T) {
    this.vehicle = vehicleObj;
  }

  protected abstract validateTechRecordFields(techRecord: TechRecord): ValidationResult;

  public async createVehicle(): Promise<T> {
    const newVehicle: T = this.create(); // returns a valid vehicle
    // async operations - generate systemNumber/trailerId
    newVehicle.systemNumber = "generated async";
    return Promise.resolve(newVehicle);
  }

  protected create(): T {
    console.log("base vehicle validate");
    this.vehicle.techRecord[0] = this.validate(this.vehicle);
    console.log("passed all validations");
    return this.vehicle;
  }

  protected update(): T {
    return this.vehicle;
  }

  private validate(newVehicle: T): TechRecord {
    const validationResult: ValidationResult = this.validateTechRecordFields(newVehicle.techRecord[0]);
    console.log("VALIDATION RESULT", validationResult);
    checkValidationErrors(validationResult);
    this.validatePrimaryAndSecondaryVrm(newVehicle);
    return validationResult.value;
  }

  private validatePrimaryAndSecondaryVrm(newVehicle: T): void | HTTPError {
    if (!validateVrms(newVehicle)) {
      throw new HTTPError(400, formatErrorMessage("Primary or secondaryVrms are not valid"));
    }
  }
}
