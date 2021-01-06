export class LogPost {
  constructor(
    comment,
    created_timestamp,
    currency,
    distance,
    edited_timestamp,
    fuel,
    fuelprice,
    owner_id,
    isPrivate,
    vehicle
  ) {
    this.comment = comment;
    this.created_timestamp = created_timestamp;
    this.currency = currency;
    this.distance = distance;
    this.edited_timestamp = edited_timestamp;
    this.fuel = fuel;
    this.fuelprice = fuelprice;
    this.owner_id = owner_id;
    this.isPrivate = isPrivate;
    this.vehicle = vehicle;
  }
}
