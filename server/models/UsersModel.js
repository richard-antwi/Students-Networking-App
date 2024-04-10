const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    
        "_id": {
          "type": "string",
          "required": true
        },
        "firstName": {
          "type": "string",
          "required": true
        },
        "lastName": {
            "type": "string",
            "required": true
        },
        "userName": {
            "type": "string",
            "required": true
        },
        "email": {
          "type": "string",
          "required": true,
          unique: true 
        },
        "password": {
          "type": "string",
          "required": true
        },
        "dateOfBirth": {
            "type": "date",
            "required": true
          },
        "selectProgram": {
            "type": "string",
            "required": false
          },
        "university": {
          "type": "string",
          "required": false
        },
        "profilePicture": {
          "type": "string",
          "required": false
        },
        "createdAt": {
          "type": "date",
          "required": true
        },
        "updatedAt": {
          "type": "date",
          "required": true
        }
      
})

const UsersModel = mongoose.model('user', UserSchema);
module.exports = UsersModel;