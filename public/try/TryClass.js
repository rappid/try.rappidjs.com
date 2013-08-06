define(["js/core/Application", "underscore", "js/core/List", "raw!try/templates/start.html", "raw!try/templates/config.json", "raw!try/templates/App.xml", "raw!try/templates/AppClass.js", "try/model/File"], function(Application, _, List, start, config, AppTemplate, AppClassTemplate, File) {


    return Application.inherit({

        defaults: {
            /***
             * @codeBehind
             */
            contentFrame: null,

            files: List
        },

        ctor: function() {
            this.callBase();

            this.createDefaultFiles();
        },

        createDefaultFiles: function() {

            var files = this.$.files;
            files.clear();

            var file = new File({
                path: "app/App.xml"
            });
            file.set("content", AppTemplate);
            files.add(file);

            file = new File({
                path: "app/AppClass.js"
            });
            file.set("content", AppClassTemplate);
            files.add(file);
        },

        run: function() {

            var contentFrame = this.$.contentFrame;

            var doc = contentFrame.$el.contentWindow || contentFrame.$.el.contentDocument,
                wnd = contentFrame.$el.contentWindow,
                runConfig,
                files = this.$.files;

            runConfig = JSON.parse(config);
//            runConfig.context = "try";

            files.each(function(file) {
                var path = file.$.path.replace(/\.[^.]+$/, "");

                if (file.isXaml()) {
                    runConfig.xamlClasses.push(file.$.path.replace(/\.xml$/i, ""));
                    runConfig.paths[path] = "data:" + file.$.content;
                } else {
                    runConfig.paths[path] = "data:text/javascript," + file.$.content + "\n//";
                }

            });

            if (doc.document) {
                doc = doc.document;
            }

            wnd.window.getVirtualFile = function (path) {

                for (var i = 0; i < files.$items.length; i++) {
                    var file = files.$items[i];
                    if (file.$.path === path) {
                        return file;
                    }
                }

                throw new Error("File '" + path + "' not found.");
            };

            doc.open();
            doc.write(start);
            doc.close();

            wnd.onload = function() {


                console.log(JSON.stringify(runConfig));
                wnd.window.rAppid.bootStrap("app/App.xml", null, null, runConfig, function (err) {
                    err && console.error(err);
                });
            }



        }

    });
});
