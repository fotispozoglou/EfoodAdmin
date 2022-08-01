const mongoose = require('mongoose');
const Admin = require('../models/admin.js');

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const dbUrl = IS_PRODUCTION ? process.env.MONGO_URL : 'mongodb://localhost:27017/efood';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  
  addAdmin("menu", "password" );

});

const addAdmin = async ( username, password ) => {

  await register(username, password ).then(() => { mongoose.connection.close() });

};

const register = async ( username, password ) => {

  try {

    const admin = new Admin({ username, password, isAdmin: true });
    
    const registeredAdmin = await Admin.register(admin, password);

    console.log(`ADDED: ${ registeredAdmin.username }`);
  
  } catch (e) {
  
    console.log("ERROR ADDING ADMIN");
  
  }

}
