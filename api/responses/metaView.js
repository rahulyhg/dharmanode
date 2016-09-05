module.exports = function(data, options) {
    var req = this.req;
    var res = this.res;
    var sails = req._sails;
    if (!data) {
        data = {};
    }
    res.view(sails.config.environment, {
        jsFiles: jsFiles,
        title: data.title,
        description: data.description,
        keywords: data.keywords,
        image: metaImageUrl + data.image,
        url: mainUrl + req.path
    });
};
