import { Vehicle } from "./Vehicle";
import { HgvTechRecord } from "../../@Types/TechRecords";

export class HeavyGoodsVehicle extends Vehicle<HgvTechRecord> {
    constructor(vehicleObj: HgvTechRecord) {
        super(vehicleObj);
    }

    public create(newVehicle: HgvTechRecord): HgvTechRecord {
        super.create(newVehicle);
        return newVehicle;
    }

    public update(updatedVehicle: HgvTechRecord): HgvTechRecord {
        super.update(updatedVehicle);
        return updatedVehicle;
    }

}
