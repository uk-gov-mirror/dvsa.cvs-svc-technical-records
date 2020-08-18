import {VEHICLE_TYPE} from "../assets/Enums";
import {
  ICarVehicle,
  IHeavyGoodsVehicle,
  ILargeGoodsVehicle,
  IMotorcycleVehicle,
  IPublicServiceVehicle,
  ITrailerVehicle,
  IVehicle
} from "../../@Types/TechRecords";
import {PublicServiceVehicle} from "./PublicServiceVehicle";
import {TrailerVehicle} from "./TrailerVehicle";
import {HeavyGoodsVehicle} from "./HeavyGoodsVehicle";
import {CarVehicle} from "./CarVehicle";
import {LargeGoodsVehicle} from "./LargeGoodsVehicle";
import {MotorcycleVehicle} from "./MotorcycleVehicle";
import {Vehicle} from "./Vehicle";
import {formatErrorMessage} from "../utils/formatErrorMessage";
import IMsUserDetails from "../../@Types/IUserDetails";
import {NumberGenerator} from "../handlers/NumberGenerator";

export class VehicleFactory {

  public static async generateVehicle(type: VEHICLE_TYPE, vehicleObj: IVehicle, msUserDetails: IMsUserDetails, numberGenerator: NumberGenerator): Promise<IVehicle> {
    let vehicle: Vehicle<IVehicle>;
    switch (type) {
      case VEHICLE_TYPE.PSV:
        vehicle = new PublicServiceVehicle(vehicleObj as IPublicServiceVehicle, numberGenerator);
        break;
      case VEHICLE_TYPE.HGV:
        vehicle = new HeavyGoodsVehicle(vehicleObj as IHeavyGoodsVehicle, numberGenerator);
        break;
      case VEHICLE_TYPE.TRL:
        vehicle = new TrailerVehicle(vehicleObj as ITrailerVehicle, numberGenerator);
        break;
      case VEHICLE_TYPE.LGV:
        vehicle = new LargeGoodsVehicle(vehicleObj as ILargeGoodsVehicle, numberGenerator);
        break;
      case VEHICLE_TYPE.CAR:
        vehicle = new CarVehicle(vehicleObj as ICarVehicle, numberGenerator);
        break;
      case VEHICLE_TYPE.MOTORCYCLE:
        vehicle = new MotorcycleVehicle(vehicleObj as IMotorcycleVehicle, numberGenerator);
        break;
      default:
        return Promise.reject({statusCode: 400, body: formatErrorMessage("Invalid vehicle type")});
    }
    return vehicle.createVehicle(msUserDetails);
  }
}
