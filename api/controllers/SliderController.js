/**
 * SliderController
 *
 * @description :: Server-side logic for managing sliders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

   module.exports = {
       saveData: function(req, res) {
           if (req.body) {
               Slider.saveData(req.body, function(err, respo) {
                   if (err) {
                       res.json({
                           value: false,
                           data: err
                       });
                   } else {
                       res.json({
                           value: true,
                           data: respo
                       });
                   }
               });
           } else {
               res.json({
                   value: false,
                   data: "Invalid call"
               });
           }
       },
       getAll: function(req, res) {
           if (req.body) {
               Slider.getAll(req.body, function(err, respo) {
                   if (err) {
                       res.json({
                           value: false,
                           data: err
                       });
                   } else {
                       res.json({
                           value: true,
                           data: respo
                       });
                   }
               });
           } else {
               res.json({
                   value: false,
                   data: "Invalid call"
               });
           }
       },
       delete: function(req, res) {
           if (req.body) {
               if (req.body._id && req.body._id != "") {
                   //	console.log("not valid");
                   Slider.deleteData(req.body, function(err, respo) {
                       if (err) {
                           res.json({
                               value: false,
                               data: err
                           });
                       } else {
                           res.json({
                               value: true,
                               data: respo
                           });
                       }
                   });
               } else {
                   res.json({
                       value: false,
                       data: "Invalid Id"
                   });
               }
           } else {
               res.json({
                   value: false,
                   data: "Invalid call"
               });
           }
       },
       getOne: function(req, res) {
         console.log(req);
           if (req.body) {
               if (req.body._id && req.body._id != "") {
                   Slider.getOne(req.body, function(err, respo) {
                       if (err) {
                           res.json({
                               value: false,
                               data: err
                           });
                       } else {
                           res.json({
                               value: true,
                               data: respo
                           });
                       }
                   });
               } else {
                   res.json({
                       value: false,
                       data: "User id Invalid"
                   });
               }
           } else {
               res.json({
                   value: false,
                   data: "Invalid call"
               });
           }
       },

   };
