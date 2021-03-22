import TechRecordsDAO from "../models/TechRecordsDAO";
import TechRecordsService from "../services/TechRecordsService";
import HTTPResponse from "../models/HTTPResponse";
import {populatePartialVin} from "../utils/validations/ValidationUtils";
import { HTTPRESPONSE } from "../assets/Enums";

const postTechRecords = async (event: any) => {
  const techRecordsDAO = new TechRecordsDAO();
  const techRecordsService = new TechRecordsService(techRecordsDAO);

  const techRec = event.body ? event.body.techRecord : null;
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

  const techRecord = {
    vin,
    partialVin: populatePartialVin(vin),
    techRecord: techRec,
    systemNumber: "",
    primaryVrm,
    secondaryVrms
  };

  try {
    console.log("inside post Tech Record function");
    const data = await techRecordsService.insertTechRecord(techRecord, msUserDetails);
    return new HTTPResponse(201, HTTPRESPONSE.TECHINICAL_RECORD_CREATED);
  } catch (error) {
    console.log(error);
    return new HTTPResponse(error.statusCode, error.body);
  }
};

export {postTechRecords};
