define(["js/core/Application", "underscore", "js/core/List", "raw!try/templates/start.html", "raw!try/templates/config.json", "raw!try/templates/App.xml", "raw!try/templates/AppClass.js", "try/model/File", "JSON"], function(Application, _, List, start, config, AppTemplate, AppClassTemplate, File, JSON) {

    return Application.inherit({

        defaults: {
            /***
             * @codeBehind
             */
            contentFrame: null,

            selectedTab: null,
            selectedFile: null,

            files: List,
            openFiles: List,

            newFileDialog: null
        },

        ctor: function() {
            this.callBase();

            this.createDefaultFiles();
            this.$.openFiles.reset(this.$.files.toArray());

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

        addNewFile: function() {
            var newFileDialog = this.$.newFileDialog,
                self = this;

            newFileDialog.showModal(function(err, wnd, files) {

                if (files) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];

                        self.$.files.add(file);
                        self.openFile(file);
                    }
                }

            });
        },

        openFile: function(file) {

            if (!file) {
                return;
            }

            if (!this.$.openFiles.includes(file)) {
                this.$.openFiles.add(file);
            }

            this.set("selectedFile", file);
        },

        closeFile: function(file) {
            this.$.openFiles.remove(file);
            this.set("selectedFile", this.$.openFiles.at(0));
        },

        _commitSelectedFile: function(file) {

            if (!file) {
                return;
            }

            var openFilesTabView = this.$.openFilesTabView;

            for (var i = 0; i < openFilesTabView.$children.length; i++) {
                var tab = openFilesTabView.$children[i];
                if (tab.$._file === file) {
                    this.set("selectedTab", tab);
                    return;
                }
            }

        },

        run: function() {

            var contentFrame = this.$.contentFrameTemplate.createInstance(),
                result = this.$.result;

            result.removeAllChildren();

            result.addChild(contentFrame);

            var doc = contentFrame.$el.contentWindow || contentFrame.$.el.contentDocument,
                wnd = contentFrame.$el.contentWindow,
                runConfig,
                files = this.$.files;

            runConfig = JSON.parse(config);

            var version = this.PARAMETER().version || "";
            if (version) {
                runConfig.baseUrl = "" + version;
            }

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
            doc.write(start.replace(/\$\{version\}/g, version));
            doc.close();

            wnd.onload = function() {
                wnd.window.rAppid.bootStrap("app/App.xml", null, null, runConfig, function (err) {
                    err && console.error(err);
                });
            }

        }

    });
});
