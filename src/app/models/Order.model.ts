import {DateTime} from "./DateTime.model";

export class Order {
  datesTimesToPick: DateTime[];
  dateTimePicked: DateTime;
  constructor(public orderID: string, public orderNumber: number, public clientID: string, public spotNR: number,
              public installeurID: string, public status: string,
              public locationID: string) {
  }
}
