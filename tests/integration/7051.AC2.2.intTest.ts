import supertest from "supertest";
const url = "http://localhost:3005/";
const request = supertest(url);
import { populateDatabase, emptyDatabase, convertTo7051Response, convertToResponse } from "../util/dbOperations";
import mockData from "../resources/technical-records.json";
import * as _ from "lodash";

describe("techRecords", () => {
  beforeAll(async () => {
    await emptyDatabase();
  });

  beforeEach(async () => {
    await populateDatabase();
  });

  afterEach(async () => {
    await emptyDatabase();
  });

  afterAll(async () => {
    await populateDatabase();
  });

  context("AC2.2 API Consumer retrieve the Vehicle Technical Records for - query parameter \"status\" is \"provisional_over_current\" & vehicle has only one \"current\" OR \"provisional\" technical record\n" +
      "GIVEN I am an API Consumer\n" +
      "WHEN I send a request to AWS_CVS_DOMAIN/vehicles/{searchIdentifier}\n" +
      "\n" +
      "/tech-records?status=provisional_over_current\n" +
      "AND the query parameter \"status\" is \"provisional_over_current\"\n" +
      "AND for the identified vehicle in the database there is only one \"current\" OR \"provisional\" Technical Record - not both of them at the same time\n", () => {
      it("THEN the system returns a body message containing a single CompleteTechRecord\n" +
      "AND the specific Technical Record found in database is returned - \"current\" or \"provisional\" as it is in the database\n" +
      "AND the system returns an HTTP status code 200 OK", async () => {
          const expectedResponseD = convertToResponse(_.cloneDeep(mockData[25]));
          const response = await request.get("vehicles/T72741234/tech-records?status=provisional_over_current");
          expect(response.status).toEqual(200);
          expect(expectedResponseD).toEqual(response.body);
        });
    });
});