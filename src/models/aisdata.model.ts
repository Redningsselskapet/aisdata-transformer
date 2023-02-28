import dms from "@redningsselskapet/dec2dms";
import { Expose, Transform } from "class-transformer";
import moment from "moment";

export class AisData {

  @Expose({ name: 'mmsi' })
  MMSI: string;
  @Expose({ name: 'name' })
  Ship_name: string;
  @Expose()
  @Transform(({ value, obj, key }) => {
    key = 'Destination';
    return 'N/A'
  })
  Destination: 'N/A';

  @Expose()
  @Transform(({ value, obj, key }) => {
    key = 'Latitude';
    return dms({ lat: obj.latitude, lng: obj.longitude }).lat;
  })
  Latitude: string

  @Expose()
  @Transform(({ value, obj, key }) => {
    key = 'Latitude';
    return dms({ lat: obj.latitude, lng: obj.longitude }).lng;
  })
  Longitude: string

  @Expose({ name: 'latitude' })
  Decimal_Latitude: string;
  @Expose({ name: 'longitude' })
  Decimal_Longitude: string;
  @Expose({ name: 'msgtime' })
  @Transform(({ value }) => moment(value).format('YYYY-MM-DDTHH:mm:ss')+ 'Z')
  Time_stamp: string;
  @Expose({ name: 'speedOverGround' })
  SOG: string;
  @Expose({ name: 'courseOverGround' })
  COG: string;
}

// "courseOverGround": 86,
// "latitude": 66.021023,
// "longitude": 12.642795,
// "name": "EYR YTTERHOLMEN",
// "rateOfTurn": 0,
// "shipType": 58,
// "speedOverGround": 0.1,
// "trueHeading": 152,
// "mmsi": 257047000,
// "msgtime": "2023-02-28T11:06:37+00:00"

// "MMSI": "257246500",
// "Ship_name": "DAGFINN PAUST",
// "Destination": "TLF 91679603",
// "Latitude": "69° 19.4234'",
// "Longitude": "016° 08.0226'",
// "Decimal_Latitude": "69.32372333333333",
// "Decimal_Longitude": "16.13371",
// "Time_stamp": "2023-02-28T11:22:26Z",
// "SOG": ".0",
// "COG": "281"