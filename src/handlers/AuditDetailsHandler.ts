import {STATUS, UPDATE_TYPE} from "../assets/Enums";
import IMsUserDetails from "../../@Types/IUserDetails";
import {TechRecord} from "../../@Types/TechRecords";
import {isEqual} from "lodash";
import ITechRecord from "../../@Types/ITechRecord";

class AuditDetailsHandler {

  private setAuditDetails(newTechRecord: ITechRecord, oldTechRecord: ITechRecord, msUserDetails: IMsUserDetails) {
    const date = new Date().toISOString();
    newTechRecord.createdAt = date;
    newTechRecord.createdByName = msUserDetails.msUser;
    newTechRecord.createdById = msUserDetails.msOid;
    delete newTechRecord.lastUpdatedAt;
    delete newTechRecord.lastUpdatedById;
    delete newTechRecord.lastUpdatedByName;

    oldTechRecord.lastUpdatedAt = date;
    oldTechRecord.lastUpdatedByName = msUserDetails.msUser;
    oldTechRecord.lastUpdatedById = msUserDetails.msOid;

    let updateType = UPDATE_TYPE.TECH_RECORD_UPDATE;
    if (newTechRecord.adrDetails || oldTechRecord.adrDetails) {
      updateType = isEqual(newTechRecord.adrDetails, oldTechRecord.adrDetails) ? UPDATE_TYPE.TECH_RECORD_UPDATE : UPDATE_TYPE.ADR;
    }
    oldTechRecord.updateType = updateType;
  }

  public setAuditDetailsAndStatusCodeForNewRecord(techRecord: TechRecord, msUserDetails: IMsUserDetails): TechRecord {
    techRecord.createdAt = new Date().toISOString();
    techRecord.createdByName = msUserDetails.msUser;
    techRecord.createdById = msUserDetails.msOid;
    techRecord.statusCode = STATUS.PROVISIONAL;

    return techRecord;
  }

  public setCreatedAuditDetails(techRecord: TechRecord, createdByName: string, createdById: string, date: string) {
    techRecord.createdAt = date;
    techRecord.createdByName = createdByName;
    techRecord.createdById = createdById;
    delete techRecord.lastUpdatedAt;
    delete techRecord.lastUpdatedById;
    delete techRecord.lastUpdatedByName;
  }

  public setLastUpdatedAuditDetails(techRecord: TechRecord, createdByName: string, createdById: string, date: string) {
    techRecord.lastUpdatedAt = date;
    techRecord.lastUpdatedByName = createdByName;
    techRecord.lastUpdatedById = createdById;
  }
}

export default new AuditDetailsHandler();
