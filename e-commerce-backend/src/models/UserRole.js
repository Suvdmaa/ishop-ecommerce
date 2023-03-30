const mongoose = require("mongoose");

//Admin hereglegch bol buh erhtei hereglegch baina
//Customer hereglegch bol Admin Panel ruu nevtech chadahgui hereglegch baina
//User hereglech ni zarim neg Admin Panel deer ustgah,uurchluh esvel uisgeh erhgui hereglegch bna
const userRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter the Role Name"],
    unique: true,
  },
});

const UserRole = mongoose.model("UserRole", userRoleSchema);

module.exports = UserRole;
