module.exports.IS_PRODUCTION = process.env.NODE_ENV === "production";
module.exports.LOCAL_IP = "192.168.1.15";
module.exports.SERVER_URL = this.IS_PRODUCTION ? `https://efood-admin.herokuapp.com` : `http://${ this.LOCAL_IP }:8080`;
module.exports.API_URL = this.IS_PRODUCTION ? `https://efoodapi.herokuapp.com` : `http://${ this.LOCAL_IP }:3000`;