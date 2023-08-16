const { Schema, model } = require("mongoose");

const RolesSchema = new Schema({
  value: {
    type: String,
    default: "USER",
  },
  
});

module.exports = model("roles", RolesSchema);
