define(["js/data/Entity"], function(Model) {

    var mimeTypeMap = {
        "xml": "application/xml",
        "js": "text/javascript",
        "json": "application/json"
    };

    return Model.inherit("try.entity.File", {

        defaults: {
            path: "",
            content: ""
        },

        schema: {
            path: String,
            content: String
        },

        mimeType: function() {
            var extension = this.extension().toLowerCase();

            if (mimeTypeMap.hasOwnProperty(extension)) {
                return mimeTypeMap[extension];
            }

            return null;

        }.onChange("path"),

        extension: function() {
            var ret = /\.([^.]+)$/.exec(this.$.path || "");

            if (ret) {
                return ret[1];
            } else {
                return "";
            }
        }.onChange("path"),

        isXaml: function() {
            return /\.xml$/i.test(this.$.path);
        }.onChange("path")

    });
});