import HTTPError from "../models/HTTPError";
import TechRecordsDAO from "../models/TechRecordsDAO";
import ITechRecord from "../../@Types/ITechRecord";
import ITechRecordWrapper from "../../@Types/ITechRecordWrapper";
import HTTPResponse from "../models/HTTPResponse";

/**
 * Fetches the entire list of Technical Records from the database.
 * @returns Promise
 */
class TechRecordsService {
  private techRecordsDAO: TechRecordsDAO;

  constructor(techRecordsDAO: TechRecordsDAO) {
    this.techRecordsDAO = techRecordsDAO;
  }

  public getTechRecordsList(searchTerm: string, status: string) {
    return this.techRecordsDAO.getBySearchTerm(searchTerm)
      .then((data: any) => {
        if (data.Count === 0) {
          throw new HTTPError(404, "No resources match the search criteria.");
        }

        if (data.Count > 1) {
          throw new HTTPError(422, "The provided partial VIN returned more than one match.");
        }
        // Formatting the object for lambda function
        const response = data.Items
          .map((item: ITechRecordWrapper) => {
            // Adding primary and secondary VRMs in the same array
            const vrms = [{ vrm: item.primaryVrm, isPrimary: true }];
            Object.assign(item, {
              vrms
            });
            // Cleaning up unneeded properties
            delete item.primaryVrm; // No longer needed
            delete item.secondaryVrms; // No longer needed
            delete item.partialVin; // No longer needed
            // Filtering the tech records based on their status
            item.techRecord = item.techRecord.filter((techRecord: ITechRecord) => {
              return techRecord.statusCode === status;
            });
            return item;
          })
          .filter((item: ITechRecordWrapper) => { // We do not want results without tech records, so let's fix that
            return item.techRecord.length > 0;
          });
        if (response.length === 0) {
          throw new HTTPError(404, "No resources match the search criteria.");
        }

        return response[0];
      })
      .catch((error: any) => {
        if (!(error instanceof HTTPError)) {
          console.error(error);
          error.statusCode = 500;
          error.body = "Internal Server Error";
        }
        throw new HTTPError(error.statusCode, error.body);
      });
  }

  public insertTechRecord(techRecord: ITechRecordWrapper) {
      return this.techRecordsDAO.createSingle(techRecord)
          .then(() => {
              return new HTTPResponse(201, "Technical Record created");
          })
          .catch((error: any) => {
              throw new HTTPError(error.statusCode, error.message);
          });
  }

  public updateTechRecord(techRecord: ITechRecordWrapper) {
      return this.techRecordsDAO.updateSingle(techRecord)
          .then((data: any) => {
              const response = data.Attributes;
              const vrms = [{ vrm: response.primaryVrm, isPrimary: true }];
              Object.assign(response, {
                  vrms
              });
              // Cleaning up unneeded properties
              delete response.primaryVrm; // No longer needed
              delete response.secondaryVrms; // No longer needed
              delete response.partialVin; // No longer needed
              return response;
          })
          .catch((error: any) => {
              throw new HTTPError(error.statusCode, error.message);
          });
  }

  public insertTechRecordsList(techRecordItems: ITechRecordWrapper[]) {
    return this.techRecordsDAO.createMultiple(techRecordItems)
      .then((data) => {
        if (data.UnprocessedItems) { return data.UnprocessedItems; }
      })
      .catch((error: any) => {
          console.error(error);
          throw new HTTPError(500, "Internal Server Error");
      });
  }

  public deleteTechRecordsList(techRecordItemKeys: string[][]) {
    return this.techRecordsDAO.deleteMultiple(techRecordItemKeys)
      .then((data) => {
        if (data.UnprocessedItems) { return data.UnprocessedItems; }
      })
      .catch((error: any) => {
          console.error(error);
          throw new HTTPError(500, "Internal Server Error");
      });
  }
}

export default TechRecordsService;
