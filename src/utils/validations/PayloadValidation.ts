import {ERRORS, SEARCHCRITERIA, VEHICLE_TYPE} from "../../assets/Enums";
import Joi, {ObjectSchema} from "@hapi/joi";
import Configuration from "../Configuration";
import * as fromValidation from "./";
import {HgvTechRecord, IVehicle, TechRecord, TrlTechRecord} from "../../../@Types/TechRecords";

export const checkIfTankOrBattery = (payload: HgvTechRecord | TrlTechRecord) => {
  let isTankOrBattery = false;
  if (payload.adrDetails && payload.adrDetails.vehicleDetails && payload.adrDetails.vehicleDetails.type) {
    const vehicleDetailsType = payload.adrDetails.vehicleDetails.type.toLowerCase();
    if ((vehicleDetailsType.indexOf("battery") !== -1) || (vehicleDetailsType.indexOf("tank") !== -1)) {
      isTankOrBattery = true;
    }
  }
  return isTankOrBattery;
};

export const featureFlagValidation = (validationSchema: ObjectSchema, payload: HgvTechRecord | TrlTechRecord, validateEntireRecord: boolean, options: any) => {
  const allowAdrUpdatesOnlyFlag: boolean = Configuration.getInstance().getAllowAdrUpdatesOnlyFlag();
  if (allowAdrUpdatesOnlyFlag && !validateEntireRecord) {
    Object.assign(options, {stripUnknown: true});
    const {adrDetails, reasonForCreation} = payload;
    return fromValidation.validateOnlyAdr.validate({adrDetails, reasonForCreation}, options);
  } else {
    return validationSchema.validate(payload, options);
  }
};

// will be removed
export const validatePayload = (payload: TechRecord, validateEntireRecord: boolean = true) => {
  const isTankOrBattery = checkIfTankOrBattery(payload as TrlTechRecord | HgvTechRecord);
  const abortOptions = {abortEarly: false};
  const hgvTrlOptions = {...abortOptions, context: {isTankOrBattery}};
  if (payload.vehicleType === VEHICLE_TYPE.HGV) {
    return featureFlagValidation(fromValidation.hgvValidation, payload as TrlTechRecord | HgvTechRecord, validateEntireRecord, hgvTrlOptions);
  } else if (payload.vehicleType === VEHICLE_TYPE.PSV) {
    return fromValidation.psvValidation.validate(payload, abortOptions);
  } else if (payload.vehicleType === VEHICLE_TYPE.TRL) {
    return featureFlagValidation(fromValidation.trlValidation, payload as TrlTechRecord | HgvTechRecord, validateEntireRecord, hgvTrlOptions);
  } else if (payload.vehicleType === VEHICLE_TYPE.LGV) {
    return fromValidation.lgvValidation.validate(payload, abortOptions);
  } else if (payload.vehicleType === VEHICLE_TYPE.CAR) {
    return fromValidation.carValidation.validate(payload, abortOptions);
  } else if (payload.vehicleType === VEHICLE_TYPE.MOTORCYCLE) {
    return fromValidation.motorcycleValidation.validate(payload, abortOptions);
  } else {
    return {
      error: {
        details: [{message: ERRORS.VEHICLE_TYPE_ERROR}]
      }
    };
  }
};

export const validateVrms = (techRecord: IVehicle) => {
  let areVrmsValid = true;
  const vehicleType = techRecord.techRecord[0].vehicleType;
  if (vehicleType !== VEHICLE_TYPE.TRL && !techRecord.primaryVrm) {
    areVrmsValid = false;
  } else {
    const isValid = fromValidation.validatePrimaryVrm.validate(techRecord.primaryVrm);
    if (isValid.error) {
      areVrmsValid = false;
    }
  }
  if (techRecord.secondaryVrms) {
    const isValid = fromValidation.validateSecondaryVrms.validate(techRecord.secondaryVrms);
    if (isValid.error) {
      areVrmsValid = false;
    }
  }
  return areVrmsValid;
};

export const validatePrimaryVrm = Joi.string().min(1).max(9);
export const validateSecondaryVrms = Joi.array().items(Joi.string().min(1).max(9));
export const validateTrailerId = Joi.string().min(7).max(8);


export const isValidSearchCriteria = (specifiedCriteria: string): boolean => {
  const vals: string[] = Object.values(SEARCHCRITERIA);
  // return vals.includes(specifiedCriteria); //TODO reinstate for proper input validation
  return true;
};
