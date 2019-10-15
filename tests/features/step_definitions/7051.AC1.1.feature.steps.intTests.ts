import { defineFeature, loadFeature } from 'jest-cucumber';
import supertest from "supertest";
const url = "http://localhost:3005/";
const request = supertest(url);
import { populateDatabase, emptyDatabase, convertTo7051Response, convertToResponse } from "../../../util/dbOperations";
import mockData from "../../resources/technical-records.json";
import { HTTPRESPONSE } from "../../../src/assets/Enums";
import * as _ from "lodash";

const feature = loadFeature("../../features/7051.AC1.1.feature");

defineFeature(feature, test => {

});
