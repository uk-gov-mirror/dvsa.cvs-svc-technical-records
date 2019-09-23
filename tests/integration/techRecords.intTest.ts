/* global describe context it before beforeEach after afterEach */
import supertest from "supertest";
const url = "http://localhost:3005/";
const request = supertest(url);
import {populateDatabase, emptyDatabase} from "../util/dbOperations";
import mockData from "../resources/technical-records.json";
import {HTTPRESPONSE} from "../../src/assets/Enums";

describe("techRecords", () => {
  describe("getTechRecords", () => {
    beforeAll(async () => {
      await emptyDatabase();
    });

    afterAll(async () => {
      await populateDatabase();
    });

    context("when database is populated", () => {
      const convertToResponse = (dbObj: any) => { // Needed to convert an object from the database to a response object
        const responseObj = Object.assign({}, dbObj);

        // Adding primary and secondary VRMs in the same array
        const vrms: any = [{isPrimary: true}];
        if (responseObj.primaryVrm) {
          vrms[0].vrm = responseObj.primaryVrm;
        }

        Object.assign(responseObj, {
          vrms
        });

        // Cleaning up unneeded properties
        delete responseObj.primaryVrm; // No longer needed
        delete responseObj.secondaryVrms; // No longer needed
        delete responseObj.partialVin; // No longer needed

        return responseObj;
      };
      beforeEach(async () => {
        await populateDatabase();
      });

      afterEach(async () => {
        await emptyDatabase();
      });

      context("and when a search by VRM is done", () => {
        context("and no statusCode is provided", () => {
          context("and the tech record for that VRM has statusCode 'current'", () => {
            it("should return the tech record for that VRM with default status 'current'", (done) => {
              request.get("vehicles/JY58FPP/tech-records")
                .end((err, res: any) => {
                  expect(res.statusCode).toEqual(200);
                  expect(res.headers["access-control-allow-origin"]).toEqual("*");
                  expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                  expect(res.body).toEqual(convertToResponse(mockData[0]));
                  done();
                });
            });
          });

          context("and the tech record for that VRM does not have statusCode 'current'", () => {
            it("should return 404", (done) => {
              request.get("vehicles/V916FSB/tech-records")
                .end((err, res: any) => {
                  expect(res.statusCode).toEqual(404);
                  expect(res.headers["access-control-allow-origin"]).toEqual("*");
                  expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                  expect(res.body).toEqual(HTTPRESPONSE.RESOURCE_NOT_FOUND);
                  done();
                });
            });
          });
        });

        context("and statusCode is provided", () => {
          context("and the tech record for that VRM has the statusCode provided", () => {
            it("should return the tech record for that VRM with statusCode 'archived'", (done) => {
              request.get("vehicles/AA12BCD/tech-records?status=archived")
                .end((err, res: any) => {
                  expect(res.statusCode).toEqual(200);
                  expect(res.headers["access-control-allow-origin"]).toEqual("*");
                  expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                  expect(convertToResponse(mockData[2])).toEqual(res.body);
                  done();
                });
            });
          });

          context("and the tech record for that VRM does not have statusCode 'archived'", () => {
            it("should return 404", (done) => {
              request.get("vehicles/BQ91YHQ/tech-records?status=archived")
                .end((err, res: any) => {
                  expect(res.statusCode).toEqual(404);
                  expect(res.headers["access-control-allow-origin"]).toEqual("*");
                  expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                  expect(res.body).toEqual(HTTPRESPONSE.RESOURCE_NOT_FOUND);
                  done();
                });
            });
          });
        });
      });

      context("and when a search by partial VIN is done", () => {
        context("and no statusCode is provided", () => {
          context("and the tech record for that partial VIN has statusCode 'current'", () => {
            it("should return the tech record for that partial VIN with default status 'current'", (done) => {
              request.get("vehicles/012345/tech-records")
                .end((err, res: any) => {
                  expect(res.statusCode).toEqual(200);
                  expect(res.headers["access-control-allow-origin"]).toEqual("*");
                  expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                  expect(convertToResponse(mockData[0])).toEqual(res.body);
                  done();
                });
            });
          });

          context("and the tech record for that partial VIN does not have statusCode 'current'", () => {
            it("should return 404", (done) => {
              request.get("vehicles/021430/tech-records")
                .end((err, res: any) => {
                  expect(res.statusCode).toEqual(404);
                  expect(res.headers["access-control-allow-origin"]).toEqual("*");
                  expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                  expect(res.body).toEqual(HTTPRESPONSE.RESOURCE_NOT_FOUND);
                  done();
                });
            });
          });
        });

        context("and statusCode is provided", () => {
          context("and the tech record for that partial VIN has the statusCode provided", () => {
            it("should return the tech record for that partial VIN with statusCode 'archived'", (done) => {
              request.get("vehicles/012461/tech-records?status=archived")
                .end((err, res: any) => {
                  expect(res.headers["access-control-allow-origin"]).toEqual("*");
                  expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                  // console.log(convertToResponse(mockData[2]))
                  expect(convertToResponse(mockData[2])).toEqual(res.body);
                  expect(res.statusCode).toEqual(200);
                  done();
                });
            });
          });

          context("and the tech record for that partial VIN does not have statusCode 'archived'", () => {
            it("should return 404", (done) => {
              request.get("vehicles/012345/tech-records?status=archived")
                .end((err, res: any) => {
                  expect(res.statusCode).toEqual(404);
                  expect(res.headers["access-control-allow-origin"]).toEqual("*");
                  expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                  expect(res.body).toEqual(HTTPRESPONSE.RESOURCE_NOT_FOUND);
                  done();
                });
            });
          });
        });

        context("and the partial VIN provided returns more than one match", () => {
          it("should return 422", (done) => {
            request.get("vehicles/678413/tech-records")
              .end((err, res: any) => {
                expect(res.statusCode).toEqual(422);
                expect(res.headers["access-control-allow-origin"]).toEqual("*");
                expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                expect(res.body).toEqual("The provided partial VIN returned more than one match.");
                done();
              });
          });
        });
      });

      context("and when a search by full VIN is done", () => {
        context("and no statusCode is provided", () => {
          context("and the tech record for that full VIN has statusCode 'current'", () => {
            it("should return the tech record for that full VIN with default status 'current'", (done) => {
              request.get("vehicles/XMGDE02FS0H012345/tech-records")
                .end((err, res: any) => {
                  expect(res.statusCode).toEqual(200);
                  expect(res.headers["access-control-allow-origin"]).toEqual("*");
                  expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                  expect(convertToResponse(mockData[0])).toEqual(res.body);
                  done();
                });
            });
          });

          context("and the tech record for that full VIN does not have statusCode 'current'", () => {
            it("should return 404", (done) => {
              request.get("vehicles/XMGDE02FS0H012461/tech-records")
                .end((err, res: any) => {
                  expect(res.statusCode).toEqual(404);
                  expect(res.headers["access-control-allow-origin"]).toEqual("*");
                  expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                  expect(res.body).toEqual(HTTPRESPONSE.RESOURCE_NOT_FOUND);
                  done();
                });
            });
          });
        });

        context("and statusCode is provided", () => {
          context("and the tech record for that full VIN has the statusCode provided", () => {
            it("should return the tech record for that full VIN with statusCode 'archived'", (done) => {
              request.get("vehicles/XMGDE02FS0H012461/tech-records?status=archived")
                .end((err, res: any) => {
                  expect(res.statusCode).toEqual(200);
                  expect(res.headers["access-control-allow-origin"]).toEqual("*");
                  expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                  expect(convertToResponse(mockData[2])).toEqual(res.body);
                  done();
                });
            });
          });

          context("and the tech record for that full VIN does not have statusCode 'archived'", () => {
            it("should return 404", (done) => {
              request.get("vehicles/XMGDE02FS0H012345/tech-records?status=archived")
                .end((err, res: any) => {
                  expect(res.statusCode).toEqual(404);
                  expect(res.headers["access-control-allow-origin"]).toEqual("*");
                  expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                  expect(res.body).toEqual(HTTPRESPONSE.RESOURCE_NOT_FOUND);
                  done();
                });
            });
          });
        });
      });

      context("and when a search by Trailer ID is done", () => {
        context("and no statusCode is provided", () => {
          context("and the tech record for that Trailer ID has statusCode 'current'", () => {
            it("should return the tech record for that Trailer ID with default status 'current'", (done) => {
              request.get("vehicles/C000001/tech-records")
                .end((err, res: any) => {
                  expect(res.statusCode).toEqual(200);
                  expect(res.headers["access-control-allow-origin"]).toEqual("*");
                  expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                  expect(res.body).toEqual(convertToResponse(mockData[10]));
                  done();
                });
            });
          });

          context("and the tech record for that TrailerID does not have statusCode 'current'", () => {
            it("should return 404", (done) => {
              request.get("vehicles/A456789/tech-records")
                .end((err, res: any) => {
                  expect(res.statusCode).toEqual(404);
                  expect(res.headers["access-control-allow-origin"]).toEqual("*");
                  expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                  expect(res.body).toEqual(HTTPRESPONSE.RESOURCE_NOT_FOUND);
                  done();
                });
            });
          });
        });

        context("and statusCode is provided", () => {
          context("and the tech record for that Trailer ID has the statusCode provided", () => {
            it("should return the tech record for that Trailer ID with statusCode 'archived'", (done) => {
              request.get("vehicles/Q000001/tech-records?status=archived")
                .end((err, res: any) => {
                  expect(res.statusCode).toEqual(200);
                  expect(res.headers["access-control-allow-origin"]).toEqual("*");
                  expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                  expect(convertToResponse(mockData[21])).toEqual(res.body);
                  done();
                });
            });
          });

          context("and the tech record for that Trailer ID does not have statusCode 'archived'", () => {
            it("should return 404", (done) => {
              request.get("vehicles/09876543/tech-records?status=archived")
                .end((err, res: any) => {
                  expect(res.statusCode).toEqual(404);
                  expect(res.headers["access-control-allow-origin"]).toEqual("*");
                  expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                  expect(res.body).toEqual(HTTPRESPONSE.RESOURCE_NOT_FOUND);
                  done();
                });
            });
          });
        });
      });
    });
  });

  describe("postTechRecords", () => {
    context("when database is populated", () => {
      beforeAll(async () => {
        await emptyDatabase();
      });

      afterAll(async () => {
        await populateDatabase();
      });

      context("when database is populated", () => {
        beforeEach(async () => {
          await populateDatabase();
        });

        afterEach(async () => {
          await emptyDatabase();
        });

        // @ts-ignore
        const newTechRec: ITechRecordWrapper = mockData[0];

        context("and when trying to create a new vehicle", () => {
          context("and the payload is valid", () => {
            context("and that vehicle does not exist", () => {
              it("should return status 201 Technical Record created", (done) => {
                newTechRec.vin = Date.now().toString();
                newTechRec.partialVin = newTechRec.vin.substr(newTechRec.vin.length - 6);
                newTechRec.techRecord[0].bodyType.description = "New Tech Record";
                newTechRec.primaryVrm = Math.floor(100000 + Math.random() * 900000).toString();
                request.post("vehicles")
                  .send(newTechRec)
                  .end((err, res: any) => {
                    expect(res.statusCode).toEqual(201);
                    expect(res.headers["access-control-allow-origin"]).toEqual("*");
                    expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                    expect(res.body).toEqual("Technical Record created");
                    done();
                  });
              });
            });

            context("and that vehicle does exist", () => {
              it("should return status 400 The conditional request failed", (done) => {
                request.post("vehicles")
                  .send(newTechRec)
                  .end((err, res: any) => {
                    expect(res.statusCode).toEqual(400);
                    expect(res.headers["access-control-allow-origin"]).toEqual("*");
                    expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                    expect(res.body).toEqual("The conditional request failed");
                    done();
                  });
              });
            });
          });

          context("and the payload is invalid", () => {
            context("and the techRecord array is empty", () => {
              it("should return status 400 The conditional request failed", (done) => {
                newTechRec.techRecord = [];
                request.post("vehicles")
                  .send(newTechRec)
                  .end((err, res: any) => {
                    expect(res.statusCode).toEqual(400);
                    expect(res.headers["access-control-allow-origin"]).toEqual("*");
                    expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                    expect(res.body).toEqual("Body is not a valid TechRecord");
                    done();
                  });
              });
            });
          });
        });
      });
    });
  });

  describe("updateTechRecords", () => {
    context("when database is populated", () => {
      beforeAll(async () => {
        await emptyDatabase();
      });

      afterAll(async () => {
        await populateDatabase();
      });

      context("when database is populated", () => {
        const convertToResponse = (dbObj: any) => { // Needed to convert an object from the database to a response object
          const responseObj = Object.assign({}, dbObj);

          // Adding primary and secondary VRMs in the same array
          const vrms: any = [{isPrimary: true}];
          if (responseObj.primaryVrm) {
            vrms[0].vrm = responseObj.primaryVrm;
          }

          Object.assign(responseObj, {
            vrms
          });

          // Cleaning up unneeded properties
          delete responseObj.primaryVrm; // No longer needed
          delete responseObj.secondaryVrms; // No longer needed
          delete responseObj.partialVin; // No longer needed

          return responseObj;
        };
        beforeEach(async () => {
          await populateDatabase();
        });

        afterEach(async () => {
          await emptyDatabase();
        });

        context("and when trying to update a vehicle", () => {
          context("and the path parameter VIN is valid", () => {
            context("and that vehicle does exist", () => {
              it("should return status 200 and the updated vehicle", (done) => {
                // @ts-ignore
                const techRec: ITechRecordWrapper = mockData[1];
                techRec.techRecord[0].bodyType.description = "Updated Tech Record";
                techRec.techRecord[0].grossGbWeight = 5678;
                request.put(`vehicles/${techRec.vin}`)
                  .send(techRec)
                  .end((err, res: any) => {
                    expect(res.statusCode).toEqual(200);
                    expect(res.headers["access-control-allow-origin"]).toEqual("*");
                    expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                    expect(res.body).toEqual(convertToResponse(techRec));
                    done();
                  });
              });
            });

            context("and that vehicle does not exist", () => {
              it("should return error status 400 The conditional request failed", (done) => {
                // @ts-ignore
                const techRec: ITechRecordWrapper = mockData[1];
                techRec.vin = Date.now().toString();
                techRec.partialVin = techRec.vin.substr(techRec.vin.length - 6);
                techRec.primaryVrm = Math.floor(100000 + Math.random() * 900000).toString();
                techRec.techRecord[0].bodyType.description = "Updated Tech Record";
                techRec.techRecord[0].grossGbWeight = 5678;
                request.put(`vehicles/${techRec.vin}`)
                  .send(techRec)
                  .end((err, res: any) => {
                    expect(res.statusCode).toEqual(400);
                    expect(res.headers["access-control-allow-origin"]).toEqual("*");
                    expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                    expect(res.body).toEqual("The conditional request failed");
                    done();
                  });
              });
            });

            context("and the techRecord array is empty", () => {
              it("should return error status 400 Body is not a valid TechRecord", (done) => {
                // @ts-ignore
                const techRec: ITechRecordWrapper = mockData[1];
                techRec.techRecord = [];
                request.put(`vehicles/${techRec.vin}`)
                  .send(techRec)
                  .end((err, res: any) => {
                    expect(res.statusCode).toEqual(400);
                    expect(res.headers["access-control-allow-origin"]).toEqual("*");
                    expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                    expect(res.body).toEqual("Body is not a valid TechRecord");
                    done();
                  });
              });
            });
          });

          context("and the path parameter VIN is invalid", () => {
            context("and the path parameter VIN is null", () => {
              it("should return 400 Invalid path parameter 'vin'", (done) => {
                // @ts-ignore
                const techRec: ITechRecordWrapper = mockData[1];
                techRec.techRecord = [];
                request.put(`vehicles/null`)
                  .send(techRec)
                  .end((err, res: any) => {
                    expect(res.statusCode).toEqual(400);
                    expect(res.headers["access-control-allow-origin"]).toEqual("*");
                    expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                    expect(res.body).toEqual("Invalid path parameter \'vin\'");
                    done();
                  });
              });
            });

            context("and the path parameter VIN is shorter than 9 characters", () => {
              it("should return 400 Invalid path parameter 'vin'", (done) => {
                // @ts-ignore
                const techRec: ITechRecordWrapper = mockData[1];
                techRec.techRecord = [];
                request.put(`vehicles/ABCDEF5`)
                  .send(techRec)
                  .end((err, res: any) => {
                    expect(res.statusCode).toEqual(400);
                    expect(res.headers["access-control-allow-origin"]).toEqual("*");
                    expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                    expect(res.body).toEqual("Invalid path parameter \'vin\'");
                    done();
                  });
              });
            });

            context("and the path parameter VIN contains non alphanumeric characters", () => {
              it("should return 400 Invalid path parameter 'vin'", (done) => {
                // @ts-ignore
                const techRec: ITechRecordWrapper = mockData[1];
                techRec.techRecord = [];
                request.put(`vehicles/t@ch-r#cord$`)
                  .send(techRec)
                  .end((err, res: any) => {
                    expect(res.statusCode).toEqual(400);
                    expect(res.headers["access-control-allow-origin"]).toEqual("*");
                    expect(res.headers["access-control-allow-credentials"]).toEqual("true");
                    expect(res.body).toEqual("Invalid path parameter \'vin\'");
                    done();
                  });
              });
            });
          });
        });
      });
    });
  });
});
