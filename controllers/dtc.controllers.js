const dtc = require('../models/dtc');
const user = require('../models/user');
const fs = require('fs');
const xml2js = require('xml2js');




//**********ADD DATA TO DTC COLLECTION*******************/
module.exports.dtcAddAll = function (req, res, next) {
    //getXMLData();
    user.findById(req.body.id, function (err, user) {
        if (err) {
            res.send(err);
        }
    })
    let newDtc = new dtc();
    newDtc.code = req.body.code;
    newDtc.system = req.body.system;
    newDtc.manufacturer = req.body.manufacturer;
    newDtc.user = req.body.id;

    newDtc.save(function (err) {
        if (err) {
            return res.send(err);
        }
        else{
            res.json({ message: 'DTC was successful'});
        }
    });
    


}


//**********GET DATA FROM DTC COLLECTIONS*******************/
module.exports.dtcGetAll = function (req, res, next) {
    var data = {
        "Data": ""
    };
    dtc.find({}).then(function (rows) {
        data["Data"] = rows;
        res
            .status(200)
            .send(data);
        console.log("success");
    })

}


//**********GET ONE DATA FROM DTC COLLECTION THROUGH DTC COLLECTION ID******************/
module.exports.dtcGetOne = function (req, res, next) {
    var data = dtc.findById({ user: req.params.id }).then(function (rows) {
        res.send(rows);
        console.log(rows);
    });
    
    console.log(data);

}