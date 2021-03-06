module.exports = {
  saveData: function (req, res) {
    if (req.body) {
      Subscribe.saveData(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  getAll: function (req, res) {
    function callback(err, data) {
      Global.response(err, data, res);
    }
    if (req.body) {
      Subscribe.getAll(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },

  deleteSubscribe: function (req, res) {
 if (req.body) {
      Subscribe.deleteSubscribe(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },

  generateExcel: function (req, res) {
    Subscribe.generateExcel(res);
  },

  findLimited: function (req, res) {
    if (req.body) {
      if (req.body.pagenumber && req.body.pagenumber !== "" && req.body.pagesize && req.body.pagesize !== "") {
        Subscribe.findLimited(req.body, res.callback);
      } else {
        res.json({
          value: false,
          data: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  }

};