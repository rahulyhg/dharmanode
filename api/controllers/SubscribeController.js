// var facebook = require('./facebook.js');
module.exports = {
	// save: function(req, res) {
	// 	if (req.body) {
	// 		Register.saveData(req.body, res.callback);
	// 	} else {
	// 		res.json({
	// 			value: false,
	// 			data: "Invalid Request"
	// 		});
	// 	}
	// },
	saveData: function(req, res) {
			if (req.body) {
					Subscribe.saveData(req.body, res.callback);
			} else {
					res.json({
							value: false,
							data: "Invalid call"
					});
			}
	},
	getAll: function(req, res) {
    function callback(err, data) {
      Global.response(err, data, res);
    }
    if (req.body) {
      User.getAll(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  }

};
