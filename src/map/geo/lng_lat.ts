import constant from './constant';
class LngLat {
  lng: number;
  lat: number;

  constructor(lng: number, lat: number) {
      if (isNaN(lng) || isNaN(lat)) {
          throw new Error(`Invalid LngLat object: (${lng}, ${lat})`);
      }
      this.lng = +lng;
      this.lat = +lat;
      if (this.lat > 90 || this.lat < -90) {
          throw new Error('Invalid LngLat latitude value: must be between -90 and 90');
      }
  }

  toArray() {
      return [this.lng, this.lat];
  }

  toString() {
      return `LngLat(${this.lng}, ${this.lat})`;
  }
}


export default LngLat