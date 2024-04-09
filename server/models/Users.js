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
          "required": true
        },
        "password": {
          "type": "string",
          "required": true
        },
        "dateOfBirth": {
            "type": "string",
            "required": true
          },
          "selectProgram": {
            "type": "string",
            "required": true
          },
        "university": {
          "type": "string",
          "required": true
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