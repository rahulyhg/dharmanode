/**
 * NewConfigController
 *
 * @description :: Server-side logic for managing newconfigs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {

   save: function(req, res) {
     if (req.body) {
       NewConfig.saveData(req.body, res.callback);
     } else {
       res.json({
         value: false,
         data: "Invalid Request"
       });
     }
   },

   getOne: function(req, res) {

     if (req.body) {
       NewConfig.getOne(req.body, res.callback);
     } else {
       res.json({
         value: false,
         data: "Invalid Request"
       });
     }
   },

   delete: function(req, res) {
     if (req.body) {
       NewConfig.deleteData(req.body, res.callback);
     } else {
       res.json({
         value: false,
         data: "Invalid Request"
       });
     }
   },

   getAll: function(req, res) {
     function callback(err, data) {
       Global.response(err, data, res);
     }
     if (req.body) {
       NewConfig.getAll(req.body, res.callback);
     } else {
       res.json({
         value: false,
         data: "Invalid Request"
       });
     }
   },
	 };
