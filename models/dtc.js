const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create openxc Schema & model
const dtcSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    code: {
        type: String,
        required : [true,'code field is required']
    },
    system: {
        type : String,
        required : [true,'system field is required']
    },
    manufacturer:{
        type: String,
        required : [true,'manufacturer field is required']
    }
});


// const openxc = mongoose.model('openxc',openxcSchema);

module.exports = mongoose.model('dtc',dtcSchema);