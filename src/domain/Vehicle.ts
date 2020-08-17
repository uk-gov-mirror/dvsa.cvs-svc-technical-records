import {IVehicle, TechRecord} from "../../@Types/TechRecords";
import {checkValidationErrors, validateVrms} from "../utils/validations";
import HTTPError from "../models/HTTPError";
import {ValidationResult} from "@hapi/joi";
import {formatErrorMessage} from "../utils/formatErrorMessage";
import NumberGenerator from "../handlers/NumberGenerator";
import IMsUserDetails from "../../@Types/IUserDetails";
import AuditDetailsHandler from "../handlers/AuditDetailsHandler";
import {computeRecordCompleteness} from "../utils/record-completeness/ComputeRecordCompleteness";

export abstract class Vehicle<T extends IVehicle> {
  private readonly vehicle: T;

  protected constructor(vehicleObj: T) {
    this.vehicle = vehicleObj;
  }

  protected abstract validateTechRecordFields(techRecord: TechRecord): ValidationResult;
  protected abstract populateFields(techRecord: TechRecord): TechRecord;

  public async createVehicle(msUserDetails: IMsUserDetails): Promise<T> {
    const newVehicle: T = await this.create(); // returns a valid vehicle
    newVehicle.techRecord[0] = this.populateFields(newVehicle.techRecord[0]);
    console.log("Setting audit details");
    newVehicle.techRecord[0] = AuditDetailsHandler.setAuditDetailsAndStatusCodeForNewRecord(newVehicle.techRecord[0], msUserDetails);
    console.log("Computing record completeness");
    newVehicle.techRecord[0].recordCompleteness = computeRecordCompleteness(newVehicle);
    return Promise.resolve(newVehicle);
  }

  protected async create(): Promise<T> {
    console.log("base vehicle validate");
    this.vehicle.techRecord[0] = this.validate(this.vehicle);
    console.log("passed all validations");
    console.log("Generating SystemNumber");
    this.vehicle.systemNumber = await NumberGenerator.generateSystemNumber();
    return this.vehicle;
  }

  protected async update(): Promise<T> {
    return this.vehicle;
  }

  private validate(newVehicle: T): TechRecord {
    const validationResult: ValidationResult = this.validateTechRecordFields(newVehicle.techRecord[0]);
    checkValidationErrors(validationResult);
    this.validatePrimaryAndSecondaryVrm(newVehicle);
    return validationResult.value as TechRecord;
  }

  private validatePrimaryAndSecondaryVrm(newVehicle: T): void | HTTPError {
    if (!validateVrms(newVehicle)) {
      throw new HTTPError(400, formatErrorMessage("Primary or secondaryVrms are not valid"));
    }
  }
}
