import {defineFeature, loadFeature} from 'jest-cucumber';
import supertest from "supertest";
import path from 'path';

const url = "http://localhost:3005/";
const request = supertest(url);
import mockData from "../../resources/technical-records.json";
import {cloneDeep} from 'lodash';

const feature = loadFeature(path.resolve(__dirname, "../7885.ACs.feature"));

defineFeature(feature, test => {
  test('AC1. Vehicles API spec contains GET/POST/PUT/ verbs', ({given, when, then, and}) => {
    let requestUrlPOST: string;
    let requestUrlPUT: string;
    let requestUrlGET: string;

    let responsePOST: any;
    let responsePUT: any;
    let responseGET: any;

    given('I am a consumer of the vehicles API', () => {
      requestUrlPOST = 'vehicles/';
      requestUrlPUT = 'vehicles/1B7GG36N12S678410';
      requestUrlGET = 'vechicles/1B7GG36N12S678410/tech-records';
    });
    when('I call the vehicles API', async () => {
      const postPayload = createPOSTPayload();
      const putPayload = createPUTPayload();
      responsePOST = await request.post(requestUrlPOST).send(postPayload);
      responsePUT = await request.put(requestUrlPUT).send(putPayload);
    });
    then('I am able to perform a PUT or POST request', () => {
      expect(responsePOST.status).toEqual(201);
      expect(responsePOST.body).toEqual("Technical Record created");

      expect(responsePUT.status).toEqual(200);
      expect(responsePUT.body.techRecord[0].bodyType.description).toEqual("Updated Tech Record");
      expect(responsePUT.body.techRecord[0].grossGbWeight).toEqual(5678);
    });
    and('I am still able to perform a GET request', async () => {
      responseGET = await request.get(requestUrlGET);
      expect(responsePUT.status).toEqual(200);
      expect(responsePUT.body).toEqual(responsePUT.body);
    });
  });
});

const createPOSTPayload = () => {
  const newTechRec = cloneDeep(mockData[0]);
  newTechRec.vin = Date.now().toString();
  newTechRec.partialVin = newTechRec.vin.substr(newTechRec.vin.length - 6);
  newTechRec.techRecord[0].bodyType.description = "New Tech Record";
  newTechRec.primaryVrm = Math.floor(100000 + Math.random() * 900000).toString();
  newTechRec.trailerId = Math.floor(100000 + Math.random() * 900000).toString();
  return newTechRec;
};

const createPUTPayload = () => {
  const techRec: any = cloneDeep(mockData[1]);
  techRec.techRecord[0].bodyType.description = "Updated Tech Record";
  techRec.techRecord[0].grossGbWeight = 5678;
  return techRec;
};
