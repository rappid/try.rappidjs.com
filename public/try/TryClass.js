define(["js/core/Application", "underscore", "js/core/List", "raw!try/templates/start.html", "json!config.json", "raw!try/templates/App.xml", "raw!try/templates/AppClass.js", "try/model/File"], function(Application, _, List, start, config, AppTemplate, AppClassTemplate, File) {

    var realNamespaces = ["js", "try"],
        pluginStripper = /^([^!]+!)?(.*)$/;

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

            runConfig = _.clone(config);
            runConfig.paths.virtual = "try/plugin/virtual";
            runConfig.context = "try";

            files.each(function(file) {
                if (file.isXaml()) {
                    runConfig.xamlClasses.push(file.$.path.replace(/\.xml$/i, ""));
                }
            });

            if (doc.document) {
                doc = doc.document;
            }

            doc.open();
            doc.write(start);
            doc.close();


            wnd.window.getVirtualFile = function (path) {

                for (var i = 0; i < files.$items.length; i++) {
                    var file = files.$items[i];
                    if (file.$.path === path) {
                        return file;
                    }
                }

                throw new Error("File '" + path + "' not found.");
            };

            wnd.onload = function() {

                // overwrite define function
                var originalDefine = wnd.define;

                wnd.define = function (dependencies, fn, errFn) {
                    dependencies = dependencies || [];

                    var newDependencies = [];
                    for (var i = 0; i < dependencies.length; i++) {
                        var dependency = dependencies[i],
                            match = pluginStripper.exec(dependency || ""),
                            dependencyPath = match[2] || "",
                            dependencyNamespace = dependencyPath.split("/").shift();

                        if (_.indexOf(realNamespaces, dependencyNamespace) === -1 &&
                            dependency !== "require" &&
                            dependency !== "rAppid" &&
                            !runConfig.paths.hasOwnProperty(dependency)) {
                            // virtual file
                            newDependencies.push("virtual!" + dependency);
                        } else {
                            newDependencies.push(dependency)
                        }
                    }

                    console.log(newDependencies);
                    originalDefine(newDependencies, fn, errFn);
                };

                wnd.window.rAppid.bootStrap("virtual!xaml!app/App.xml", null, null, runConfig, function (err, application) {
                    console.log(err, application);
                });

            };

        }

    });
});
