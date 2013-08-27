define(["js/core/Application", "underscore", "js/core/List", "raw!try/templates/start.html", "raw!try/templates/config.json", "raw!try/templates/App.xml", "raw!try/templates/AppClass.js", "try/model/File", "JSON", "try/model/Project", "js/core/History"], function(Application, _, List, start, config, AppTemplate, AppClassTemplate, File, JSON, Project, History) {

    var modeMap = {
        js: "javascript"
    };

    return Application.inherit({

        defaults: {
            /***
             * @codeBehind
             */
            contentFrame: null,

            selectedTab: null,
            selectedFile: null,

            project: null,

            openFiles: List,

            newFileDialog: null,

            /***
             * @type js.data.DataSource
             */
            dataSource: null
        },

        inject: {
            history: History
        },

        _initializationComplete: function() {
            this.callBase();

            this.openProject(this.createNewProject());
        },

        start: function() {

            this.$.history.set("useState", true);

            this.callBase();
        },

        openProject: function(project) {

            this.set("project", project);

            if (project) {
                this.$.openFiles.reset(project.$.files.toArray());
            }
        },

        createNewProject: function() {
            var project = this.$.dataSource.createEntity(Project);
            project.$.files.add(this.createDefaultFiles());
            return project;
        },

        createDefaultFiles: function() {

            var files = [];

            var file = new File({
                path: "app/App.xml"
            });

            file.set("content", AppTemplate);
            files.push(file);

            file = new File({
                path: "app/AppClass.js"
            });
            file.set("content", AppClassTemplate);
            files.push(file);

            return files;

        },

        addNewFile: function() {
            var newFileDialog = this.$.newFileDialog,
                self = this;

            newFileDialog.showModal(function(err, wnd, files) {

                var project = self.$.project;

                if (files) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];

                        project.$.files.add(file);
                        self.openFile(file);
                    }
                }

            });
        },

        getMode: function(file) {
            if (!file) {
                return null
            }

            var extension = file.extension();
            return modeMap[ extension] || extension;
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

        startOver: function() {
            this.openProject(this.createNewProject());
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

            if (version === "${VERSION}") {
                version = "";
            }

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
