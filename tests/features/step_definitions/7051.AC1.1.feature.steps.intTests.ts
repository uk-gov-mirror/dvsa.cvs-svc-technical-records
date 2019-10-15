import {defineFeature, loadFeature} from 'jest-cucumber';
import supertest from "supertest";
import path from 'path';

const url = "http://localhost:3005/";
const request = supertest(url);
import {convertTo7051Response} from "../../util/dbOperations";
import mockData from "../../resources/technical-records.json";
import * as _ from "lodash";

const feature = loadFeature(path.resolve(__dirname, "../7051.AC1.1.feature"));

defineFeature(feature, test => {
  test('AC1.1 API Consumer retrieve the Vehicle Technical Records for - ' +
    'query parameter "status" not provided & vehicle has both "current" and "provisional" technical records', ({given, when, then, and}) => {
    let requestUrl: string;
    let response: any;
    let expectedResponse: any;
    given('I am an API Consumer', () => {
      requestUrl = 'vehicles/YV31MEC18GA011911/tech-records';
    });
    when('I send a request to AWS_CVS_DOMAIN/vehicles/{searchIdentifier}/tech-records', async () => {
      response = await request.get(requestUrl);
    });
    and('for the identified vehicle in the database there is a Technical Record with the "statusCode" = "current"', () => {
      const isStatusPresent = isStatusCodePresent(response.body, "current");
      expect(isStatusPresent).toBe(true);
    });
    and('for the identified vehicle in the database there is a Technical Record with the "statusCode" = "provisional"', () => {
      const isStatusPresent = isStatusCodePresent(response.body, "provisional");
      expect(isStatusPresent).toBe(true);
    });
    then('for the query parameter "status", the default value "provisional_over_current" will be taken into account', () => {
      expectedResponse = convertTo7051Response(_.cloneDeep(mockData[9]), 1);
    });
    and('the system returns a body message containing a single CompleteTechRecord', () => {
      expect(expectedResponse).toEqual(response.body);
    });
    and('the statusCode of the Technical Records "provisional"', () => {
      const isStatusPresent = isStatusCodePresent(response.body, "provisional");
      expect(isStatusPresent).toBe(true);
    });
    and('the system returns an HTTP status code 200 OK', () => {
      expect(response.status).toEqual(200);
    });
  });
});

const isStatusCodePresent = (techRecord: any, status: string) => {
  let isStatusCodePresent = false;
  techRecord.forEach((record: any) => {
    if (record.statusCode === status) {
      isStatusCodePresent = true;
    }
  });
  return isStatusCodePresent;
};
