import TechRecordsDAO from "../models/TechRecordsDAO";
import TechRecordsService from "../services/TechRecordsService";
import HTTPResponse from "../models/HTTPResponse";
import {populatePartialVin} from "../utils/validations/ValidationUtils";
import {IVehicle, TechRecord} from "../../@Types/TechRecords";

const postTechRecords = (event: any) => {
  const techRecordsDAO = new TechRecordsDAO();
  const techRecordsService = new TechRecordsService(techRecordsDAO);

  const techRec: TechRecord[] = event.body ? event.body.techRecord : null;
  const msUserDetails = event.body ? event.body.msUserDetails : null;
  const vin = event.body ? event.body.vin : null;
  const primaryVrm = event.body ? event.body.primaryVrm : null;
  const secondaryVrms = event.body ? event.body.secondaryVrms : null;

  if (!vin || vin.length < 3 || vin.length > 21 || typeof vin !== "string") {
    return Promise.resolve(new HTTPResponse(400, "Invalid body field 'vin'"));
  }

  if (!techRec || !techRec.length) {
    return Promise.resolve(new HTTPResponse(400, "Body is not a valid TechRecord"));
  }

  if (!msUserDetails || !msUserDetails.msUser || !msUserDetails.msOid) {
    return Promise.resolve(new HTTPResponse(400, "Microsoft user details not provided"));
  }

  const techRecord: IVehicle = {
    vin,
    partialVin: populatePartialVin(vin),
    techRecord: techRec,
    systemNumber: "",
    primaryVrm,
    secondaryVrms
  };

  return techRecordsService.insertTechRecord(techRecord, msUserDetails)
    .then((data: IVehicle) => {
      return new HTTPResponse(201, data);
    })
    .catch((error: any) => {
      console.log(error);
      return new HTTPResponse(error.statusCode, error.body);
    });
};

export {postTechRecords};
