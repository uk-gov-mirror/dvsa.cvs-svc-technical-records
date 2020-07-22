import { TechRecord } from "../../@Types/TechRecords";

export abstract class Vehicle<T extends TechRecord> {
  public vehicle: T;
  constructor(vehicleObj: T) {
      this.vehicle = vehicleObj;
  }

  public create(newVehicle: T): T {
    //   TODO: some common logic for creating tech record
    return this.vehicle;
  }

  public update(updatedVehicle: T): T {
    return this.vehicle;
  }
}
