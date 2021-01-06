export class Vehicle {
  constructor(
    created_timestamp,
    displayname,
    edited_timestamp,
    image,
    make,
    model,
    modelyear,
    owner_id,
    plate,
    isPrivate
  ) {
    this.created_timestamp = created_timestamp;
    this.displayname = displayname;
    this.edited_timestamp = edited_timestamp;
    this.image = image;
    this.make = make;
    this.model = model;
    this.modelyear = modelyear;
    this.owner_id = owner_id;
    this.plate = plate;
    this.isPrivate = isPrivate;
  }
}
