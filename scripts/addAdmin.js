const mongoose = require('mongoose');
const Admin = require('./models/admin.js');

const { PERMISSIONS } = require('./config/permissions.js');

const dbUrl = 'mongodb://localhost:27017/efood-admin'; // process.env.DB_URL

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  
  addAdmin("menu", "password", [ PERMISSIONS.MENU_READ, PERMISSIONS.MENU_BULK_READ, PERMISSIONS.MENU_MODIFY, PERMISSIONS.MENU_DELETE ]);

});

const addAdmin = async ( username, password, permissions ) => {

  await register(username, password, permissions).then(() => { mongoose.connection.close() });

};

const register = async ( username, password, permissions ) => {

  try {

    const admin = new Admin({ username, password, permissions, isAdmin: true });
    
    const registeredAdmin = await Admin.register(admin, password);

    console.log(`ADDED: ${ registeredAdmin.username }`);
  
  } catch (e) {
  
    console.log("ERROR ADDING ADMIN");
  
  }

}
