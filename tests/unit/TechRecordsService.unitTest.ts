/* global describe context it */
import TechRecordsService from "../../src/services/TechRecordsService";
import HTTPError from "../../src/models/HTTPError";
import records from "../resources/technical-records.json";
import ITechRecordWrapper from "../../@Types/ITechRecordWrapper";

describe("getTechRecordsList", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  context("when db call returns data", () => {
    it("should return a populated response", () => {
      const MockDAO = jest.fn().mockImplementation(() => {
        return {
          getBySearchTerm: () => {
            return Promise.resolve({
              Items: [records[0]],
              Count: 1,
              ScannedCount: 1
            });
          }
        };
      });
      const mockDAO = new MockDAO();
      const techRecordsService = new TechRecordsService(mockDAO);


      return techRecordsService.getTechRecordsList("1B7GG36N12S678410", "current")
        .then((returnedRecords: any) => {
          expect(returnedRecords).not.toEqual(undefined);
          expect(returnedRecords).not.toEqual({});
          expect(returnedRecords).toEqual(records[0]);
        });
    });
  });

  context("when db returns empty data", () => {
    it("should return 404-No resources match the search criteria", async () => {
      const MockDAO = jest.fn().mockImplementation(() => {
        return {
          getBySearchTerm: () => {
            return Promise.resolve({
              Items: {},
              Count: 0,
              ScannedCount: 0
            });
          }
        };
      });
      const mockDAO = new MockDAO();
      const techRecordsService = new TechRecordsService(mockDAO);

      try {
        expect(await techRecordsService.getTechRecordsList("Rhubarb", "Potato")).toThrowError();
      } catch (errorResponse) {
        expect(errorResponse.statusCode).toEqual(404);
        expect(errorResponse.body).toEqual("No resources match the search criteria.");
      }
    });
  });
  context("when db return undefined data", () => {
    it("should return 404-No resources match the search criteria if db return null data", async () => {
      const MockDAO = jest.fn().mockImplementation(() => {
        return {
          getBySearchTerm: () => {
            return Promise.resolve({
              Items: undefined,
              Count: 0,
              ScannedCount: 0
            });
          }
        };
      });
      const mockDAO = new MockDAO();
      const techRecordsService = new TechRecordsService(mockDAO);

      try {
        expect(await techRecordsService.getTechRecordsList("", "")).toThrowError();
      } catch (errorResponse) {
        expect(errorResponse).toBeInstanceOf(HTTPError);
        expect(errorResponse.statusCode).toEqual(404);
        expect(errorResponse.body).toEqual("No resources match the search criteria.");
      }
    });
  });

  context("when db does not return response", () => {
    it("should return 500-Internal Server Error", async () => {
      const MockDAO = jest.fn().mockImplementation(() => {
        return {
          getBySearchTerm: () => {
            return Promise.reject({
              Items: undefined,
              Count: 0,
              ScannedCount: 0
            });
          }
        };
      });
      const mockDAO = new MockDAO();
      const techRecordsService = new TechRecordsService(mockDAO);

      try {
        expect(await techRecordsService.getTechRecordsList("", "")).toThrowError();
      } catch (errorResponse) {
        expect(errorResponse).toBeInstanceOf(HTTPError);
        expect(errorResponse.statusCode).toEqual(500);
        expect(errorResponse.body).toEqual("Internal Server Error");
      }
    });
  });

  context("when db returns too many results", () => {
    it("should return 422 - More Than One Match", async () => {

      const MockDAO = jest.fn().mockImplementation(() => {
        return {
          getBySearchTerm: () => {
            return Promise.resolve({
              Items: undefined,
              Count: 2,
              ScannedCount: 2
            });
          }
        };
      });
      const mockDAO = new MockDAO();
      const techRecordsService = new TechRecordsService(mockDAO);
      try {
        expect(await techRecordsService.getTechRecordsList("", "")).toThrowError();
      } catch (errorResponse) {
        expect(errorResponse).toBeInstanceOf(HTTPError);
        expect(errorResponse.statusCode).toEqual(422);
        expect(errorResponse.body).toEqual("The provided partial VIN returned more than one match.");
      }
    });
  });
});

describe("insertTechRecord", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  context("when inserting a new technical record", () => {
    it("should return 201 Technical Record Created", async () => {
      const MockDAO = jest.fn().mockImplementation(() => {
        return {
          createSingle: () => {
            return Promise.resolve({});
          }
        };
      });
      const mockDAO = new MockDAO();
      const techRecordsService = new TechRecordsService(mockDAO);

      // @ts-ignore
      const techRecord: ITechRecordWrapper = records[0];
      techRecord.vin = Date.now().toString();
      techRecord.partialVin = techRecord.vin.substr(techRecord.vin.length - 6);
      techRecord.primaryVrm = Math.floor(100000 + Math.random() * 900000).toString();
      techRecord.techRecord[0].bodyType.description = "new tech record";

      const data: any = techRecordsService.insertTechRecord(techRecord);
      expect(data).not.toEqual(undefined);
      expect(Object.keys(data).length).toEqual(0);
    });
  });

  context("when trying to create a technical record for existing vehicle", () => {
    it("should return error 400 The conditional request failed", async () => {
      const MockDAO = jest.fn().mockImplementation(() => {
        return {
          createSingle: () => {
            return Promise.reject({statusCode: 400, message: "The conditional request failed"});
          }
        };
      });
      const mockDAO = new MockDAO();
      const techRecordsService = new TechRecordsService(mockDAO);

      // @ts-ignore
      const techRecord: ITechRecordWrapper = records[0];
      techRecord.partialVin = "012345";
      techRecord.vin = "XMGDE02FS0H012345";
      techRecord.primaryVrm = "JY58FPP";

      try {
        expect(await techRecordsService.insertTechRecord(techRecord)).toThrowError();
      } catch (errorResponse) {
        expect(errorResponse).toBeInstanceOf(HTTPError);
        expect(errorResponse.statusCode).toEqual(400);
        expect(errorResponse.body).toEqual("The conditional request failed");
      }
    });
  });
});

describe("updateTechRecord", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  context("when updating a technical record for an existing vehicle", () => {
    it("should return the updated document", async () => {
      // @ts-ignore
      const techRecord: ITechRecordWrapper = records[0];
      techRecord.techRecord[0].bodyType.description = "new tech record";
      techRecord.techRecord[0].grossGbWeight = 5555;
      const vrms = [{vrm: "JY58FPP", isPrimary: true}];
      const MockDAO = jest.fn().mockImplementation(() => {
        return {
          updateSingle: () => {
            return Promise.resolve({
              Attributes: techRecord
            });
          }
        };
      });
      const mockDAO = new MockDAO();
      const techRecordsService = new TechRecordsService(mockDAO);
      const updatedTechRec = await techRecordsService.updateTechRecord(techRecord);
      expect(updatedTechRec).not.toEqual(undefined);
      expect(updatedTechRec).not.toEqual({});
      expect(updatedTechRec).not.toHaveProperty("primaryVrm");
      expect(updatedTechRec).not.toHaveProperty("partialVin");
      expect(updatedTechRec).not.toHaveProperty("secondaryVrms");
      expect(updatedTechRec.vin).toEqual("XMGDE02FS0H012345");
      expect(updatedTechRec.vrms).toStrictEqual(vrms);
      expect(updatedTechRec.techRecord[0].bodyType.description).toEqual("new tech record");
      expect(updatedTechRec.techRecord[0].grossGbWeight).toEqual(5555);
    });
  });

  context("when trying to update a technical record for non existing vehicle", () => {
    it("should return error 400 The conditional request failed", async () => {
      const MockDAO = jest.fn().mockImplementation(() => {
        return {
          updateSingle: () => {
            return Promise.reject({statusCode: 400, message: "The conditional request failed"});
          }
        };
      });
      const mockDAO = new MockDAO();
      const techRecordsService = new TechRecordsService(mockDAO);

      // @ts-ignore
      const techRecord: ITechRecordWrapper = records[0];
      techRecord.partialVin = "012345";
      techRecord.vin = "XMGDE02FS0H012345";
      techRecord.primaryVrm = "JY58FPP";
      techRecord.techRecord[0].bodyType.description = "new tech record";
      techRecord.techRecord[0].grossGbWeight = 5555;

      try {
        expect(await techRecordsService.updateTechRecord(techRecord)).toThrowError();
      } catch (errorResponse) {
        expect(errorResponse).toBeInstanceOf(HTTPError);
        expect(errorResponse.statusCode).toEqual(400);
        expect(errorResponse.body).toEqual("The conditional request failed");
      }
    });
  });
});

