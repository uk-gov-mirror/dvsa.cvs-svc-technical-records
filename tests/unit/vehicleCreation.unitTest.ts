import {cloneDeep} from "lodash";
import mockData from "../resources/technical-records.json";
import {STATUS, VEHICLE_TYPE} from "../../src/assets/Enums";
import {
  ICarVehicle,
  IHeavyGoodsVehicle,
  ILargeGoodsVehicle,
  IMotorcycleVehicle,
  IPublicServiceVehicle,
  ITrailerVehicle
} from "../../@Types/TechRecords";
import {TrailerVehicle} from "../../src/domain/TrailerVehicle";
import {PublicServiceVehicle} from "../../src/domain/PublicServiceVehicle";
import IMsUserDetails from "../../@Types/IUserDetails";
import {HeavyGoodsVehicle} from "../../src/domain/HeavyGoodsVehicle";
import {LargeGoodsVehicle} from "../../src/domain/LargeGoodsVehicle";
import {CarVehicle} from "../../src/domain/CarVehicle";
import {MotorcycleVehicle} from "../../src/domain/MotorcycleVehicle";

const msUserDetails: IMsUserDetails = {
  msOid: "1234",
  msUser: "Blabla"
};

describe("New vehicle classes creation", () => {
  const NumberGeneratorMock = jest.fn().mockImplementation(() => {
    return {
      generateSystemNumber: () => Promise.resolve("12345"),
      generateTrailerId: () => Promise.resolve("TR12345")
    };
  });

  context("When creating a vehicle", () => {
    context("and the payload is valid", () => {
      it("should pass the validation and return the validated payload for TRL", async () => {
        // @ts-ignore
        const techRec: ITrailerVehicle = cloneDeep(mockData[78]);
        delete techRec.techRecord[0].statusCode;
        techRec.techRecord[0].bodyType.description = "articulated";
        techRec.techRecord[0].vehicleClass.description = "trailer";
        const trailerVehicle: TrailerVehicle = new TrailerVehicle(techRec, new NumberGeneratorMock());
        const validatedVehicle: ITrailerVehicle = await trailerVehicle.createVehicle(msUserDetails);
        expect(validatedVehicle).toBeDefined();
        expect(validatedVehicle.techRecord[0].bodyType.code).toEqual("a");
        expect(validatedVehicle.techRecord[0].vehicleClass.code).toEqual("t");
        expect(validatedVehicle.techRecord[0].statusCode).toEqual(STATUS.PROVISIONAL);
        expect(validatedVehicle.techRecord[0].vehicleType).toEqual(VEHICLE_TYPE.TRL);
      });

      it("should pass the validation and return the validated payload for PSV", async () => {
        // @ts-ignore
        const techRec: IPublicServiceVehicle = cloneDeep(mockData[74]);
        delete techRec.techRecord[0].statusCode;
        techRec.techRecord[0].bodyType.description = "skeletal";
        techRec.techRecord[0].vehicleClass.description = "small psv (ie: less than or equal to 22 seats)";
        techRec.techRecord[0].brakes.brakeCode = "BR1234";
        const psvVehicle: PublicServiceVehicle = new PublicServiceVehicle(techRec, new NumberGeneratorMock());
        const validatedVehicle: IPublicServiceVehicle = await psvVehicle.createVehicle(msUserDetails);
        expect(validatedVehicle).toBeDefined();
        expect(validatedVehicle.techRecord[0].bodyType.code).toEqual("k");
        expect(validatedVehicle.techRecord[0].vehicleClass.code).toEqual("s");
        expect(validatedVehicle.techRecord[0].brakes.brakeCodeOriginal).toEqual("234");
        expect(validatedVehicle.techRecord[0].brakeCode).toEqual("BR1234");
        expect(validatedVehicle.techRecord[0].statusCode).toEqual(STATUS.PROVISIONAL);
        expect(validatedVehicle.techRecord[0].vehicleType).toEqual(VEHICLE_TYPE.PSV);
      });

      it("should pass the validation and return the validated payload for HGV", async () => {
        // @ts-ignore
        const techRec: IHeavyGoodsVehicle = cloneDeep(mockData[43]);
        delete techRec.techRecord[0].statusCode;
        techRec.techRecord[0].bodyType.description = "double decker";
        techRec.techRecord[0].vehicleClass.description = "heavy goods vehicle";
        const hgvVehicle: HeavyGoodsVehicle = new HeavyGoodsVehicle(techRec, new NumberGeneratorMock());
        const validatedVehicle: IHeavyGoodsVehicle = await hgvVehicle.createVehicle(msUserDetails);
        expect(validatedVehicle).toBeDefined();
        expect(validatedVehicle.techRecord[0].bodyType.code).toEqual("d");
        expect(validatedVehicle.techRecord[0].vehicleClass.code).toEqual("v");
        expect(validatedVehicle.techRecord[0].statusCode).toEqual(STATUS.PROVISIONAL);
        expect(validatedVehicle.techRecord[0].vehicleType).toEqual(VEHICLE_TYPE.HGV);
      });

      it("should pass the validation and return the validated payload for LGV", async () => {
        // @ts-ignore
        const techRec: ILargeGoodsVehicle = cloneDeep(mockData[124]);
        delete techRec.techRecord[0].statusCode;
        techRec.techRecord[0].vehicleClass!.description = "motorbikes up to 200cc";
        const lgvVehicle: LargeGoodsVehicle = new LargeGoodsVehicle(techRec, new NumberGeneratorMock());
        const validatedVehicle: ILargeGoodsVehicle = await lgvVehicle.createVehicle(msUserDetails);
        expect(validatedVehicle).toBeDefined();
        expect(validatedVehicle.techRecord[0].vehicleClass!.code).toEqual("1");
        expect(validatedVehicle.techRecord[0].statusCode).toEqual(STATUS.PROVISIONAL);
        expect(validatedVehicle.techRecord[0].vehicleType).toEqual(VEHICLE_TYPE.LGV);
      });

      it("should pass the validation and return the validated payload for CAR", async () => {
        // @ts-ignore
        const techRec: ICarVehicle = cloneDeep(mockData[123]);
        delete techRec.techRecord[0].statusCode;
        techRec.techRecord[0].vehicleClass!.description = "motorbikes up to 200cc";
        const carVehicle: CarVehicle = new CarVehicle(techRec, new NumberGeneratorMock());
        const validatedVehicle: ICarVehicle = await carVehicle.createVehicle(msUserDetails);
        expect(validatedVehicle).toBeDefined();
        expect(validatedVehicle.techRecord[0].vehicleClass!.code).toEqual("1");
        expect(validatedVehicle.techRecord[0].statusCode).toEqual(STATUS.PROVISIONAL);
        expect(validatedVehicle.techRecord[0].vehicleType).toEqual(VEHICLE_TYPE.CAR);
      });

      it("should pass the validation and return the validated payload for MOTORCYCLE", async () => {
        // @ts-ignore
        const techRec: IMotorcycleVehicle = cloneDeep(mockData[122]);
        delete techRec.techRecord[0].statusCode;
        techRec.techRecord[0].vehicleClass.description = "motorbikes up to 200cc";
        const motoVehicle: MotorcycleVehicle = new MotorcycleVehicle(techRec, new NumberGeneratorMock());
        const validatedVehicle: IMotorcycleVehicle = await motoVehicle.createVehicle(msUserDetails);
        expect(validatedVehicle).toBeDefined();
        expect(validatedVehicle.techRecord[0].vehicleClass.code).toEqual("1");
        expect(validatedVehicle.techRecord[0].statusCode).toEqual(STATUS.PROVISIONAL);
        expect(validatedVehicle.techRecord[0].vehicleType).toEqual(VEHICLE_TYPE.MOTORCYCLE);
      });

      context("when creating an LGV without vehicleClass field", () => {
        it("should not auto-populate vehicleClass", async () => {
          // @ts-ignore
          const techRec: ILargeGoodsVehicle = cloneDeep(mockData[124]);
          delete techRec.techRecord[0].vehicleClass;
          const lgvVehicle: LargeGoodsVehicle = new LargeGoodsVehicle(techRec, new NumberGeneratorMock());
          const validatedVehicle: ILargeGoodsVehicle = await lgvVehicle.createVehicle(msUserDetails);
          expect(validatedVehicle).toBeDefined();
          expect(validatedVehicle.techRecord[0]).not.toHaveProperty("vehicleClass");
          expect(validatedVehicle.techRecord[0].vehicleType).toEqual(VEHICLE_TYPE.LGV);
        });
      });

      context("when creating a CAR without vehicleClass field", () => {
        it("should not auto-populate vehicleClass", async () => {
          // @ts-ignore
          const techRec: ICarVehicle = cloneDeep(mockData[123]);
          delete techRec.techRecord[0].vehicleClass;
          const carVehicle: CarVehicle = new CarVehicle(techRec, new NumberGeneratorMock());
          const validatedVehicle: ICarVehicle = await carVehicle.createVehicle(msUserDetails);
          expect(validatedVehicle).toBeDefined();
          expect(validatedVehicle.techRecord[0]).not.toHaveProperty("vehicleClass");
          expect(validatedVehicle.techRecord[0].vehicleType).toEqual(VEHICLE_TYPE.CAR);
        });
      });
    });
  });
});
