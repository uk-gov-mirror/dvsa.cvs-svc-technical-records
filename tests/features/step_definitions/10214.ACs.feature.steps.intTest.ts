import {defineFeature, loadFeature} from "jest-cucumber";
import supertest from "supertest";
import path from "path";
import mockData from "../../resources/technical-records.json";
import {emptyDatabase, populateDatabase} from "../../util/dbOperations";
import {cloneDeep} from "lodash";

const url = "http://localhost:3005/";
const request = supertest(url);

const createPUTPayload = () => {
  const techRec: any = cloneDeep(mockData[43]);
  delete techRec.techRecord[0].statusCode;
  const payload = {
    msUserDetails: {
      msUser: "dorel",
      msOid: "1234545"
    },
    systemNumber: techRec.systemNumber,
    techRecord: techRec.techRecord
  };
  return payload;
};

const feature = loadFeature(path.resolve(__dirname, "../10214.ACs.feature"));

defineFeature(feature, (test) => {
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

  test.skip("AC1. PUT: Vehicle class code is autopopulated", ({given, when, then, and}) => {
    let requestUrlPUT: string;
    let requestUrlGET: string;
    const putPayload = createPUTPayload();
    let responsePUT: any;
    let responseGET: any;

    given("I am a consumer of the vehicles API", () => {
      requestUrlPUT = "vehicles/ABCDEFGH654321";
      requestUrlGET = `vehicles/ABCDEFGH654321/tech-records?status=all`;
    });
    and("I have completed the \"vehicle class description\" field", () => {
      putPayload.techRecord[0].vehicleClass = {
        description: "MOT class 4"
      };
    });
    when("I submit my request via the PUT method", async () => {
      responsePUT = await request.put(requestUrlPUT).send(putPayload);
    });
    then("the corresponding vehicle class code is autopopulated, as per the linked excel", async () => {
      responseGET = await request.get(requestUrlGET);
      expect(responseGET.body[0].techRecord[1].vehicleClass.code).toEqual("4");
    });
  });

  test.skip("AC2. PUT: Body type code is autopopulated", ({given, when, then, and}) => {
    let requestUrlPUT: string;
    let requestUrlGET: string;
    const putPayload = createPUTPayload();
    let responsePUT: any;
    let responseGET: any;

    given("I am a consumer of the vehicles API", () => {
      requestUrlPUT = "vehicles/ABCDEFGH654321";
      requestUrlGET = `vehicles/ABCDEFGH654321/tech-records?status=all`;
    });
    and("I have completed the \"body type description\" field", () => {
      putPayload.techRecord[0].bodyType = {
        description: "skeletal"
      };
    });
    when("I submit my request via the PUT method", async () => {
      responsePUT = await request.put(requestUrlPUT).send(putPayload);
    });
    then("the corresponding body type code is autopopulated, as per the linked excel", async () => {
      responseGET = await request.get(requestUrlGET);
      expect(responseGET.body[0].techRecord[1].bodyType.code).toEqual("k");
    });
  });
});
