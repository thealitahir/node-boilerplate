var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String },
    image: { type: Schema.Types.Mixed },
    phoneNo: { type: String, required: true },
    verification_code: { type: String, required: true },
    auth_key: { type: String, required: true }
});

module.exports = mongoose.model('Users', UserSchema);
