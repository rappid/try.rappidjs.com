define(["try/module/TryModule", "underscore", "js/core/List", "raw!try/templates/start.html", "raw!try/templates/config.json", "raw!try/templates/App.xml", "raw!try/templates/AppClass.js", "JSON", "try/model/Project", "js/data/DataSource", "js/core/History"], function (TryModule, _, List, start, config, AppTemplate, AppClassTemplate, JSON, Project, DataSource, History) {


    var modeMap = {
        js: "javascript"
    }, undefined;

    return TryModule.inherit({

        defaults: {

            selectedTab: null,

            project: null,

            openFiles: List,

            /***
             * @codeBehind
             */
            contentFrame: null,

            /***
             * @codeBehind
             */
            newFileDialog: null,

            saving: false
        },

        inject: {
            dataSource: DataSource,
            history: History
        },

        defaultRoute: function() {
            this.openProject(this.createNewProject());
        },

        loadProject: function(routeContext, projectId) {

            routeContext.end();

            var project = this.$.dataSource.createEntity(Project, projectId),
                self = this;

            project.fetch(null, function(err) {

                if (err) {
                    routeContext.navigate("");
                } else {
                    self.openProject(project);
                    routeContext.callback();
                }

            });

        }.async(),

        fallbackRoute: function() {
            this.$.history.navigate("", false);
        },

        openProject: function (project) {

            this.set("project", project);

            if (project) {
                this.$.openFiles.reset(project.$.files.toArray());
            }
        },

        createNewProject: function () {
            var project = this.$.dataSource.createEntity(Project);
            project.$.files.add(this.createDefaultFiles(project));
            return project;
        },

        createDefaultFiles: function (project) {

            var files = [];

            files.push(project.createFile({
                path: "app/App.xml",
                content: AppTemplate
            }));

            files.push(project.createFile({
                path: "app/AppClass.js",
                content: AppClassTemplate
            }));

            return files;

        },

        addNewFile: function (e) {
            var newFileDialog = this.$.newFileDialog,
                self = this;

            e.preventDefault();

            newFileDialog.showModal(function (err, wnd, files) {

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

        getMode: function (file) {
            if (!file) {
                return null
            }

            var extension = file.extension();
            return modeMap[extension] || extension;
        },

        openFile: function (event, file) {

            event.preventDefault();

            if (!file) {
                return;
            }

            if (!this.$.openFiles.includes(file)) {
                this.$.openFiles.add(file);
            }

            var openFilesTabView = this.$.openFilesTabView;

            for (var i = 0; i < openFilesTabView.$children.length; i++) {
                var tab = openFilesTabView.$children[i];
                if (tab.$.file === file) {
                    this.set("selectedTab", tab);
                    break;
                }
            }

        },

        closeFile: function (file) {
            this.$.openFiles.remove(file);
        },



        startOver: function () {
            this.openProject(this.createNewProject());
        },

        save: function(e) {

            e.preventDefault();

            this._save();

        },

        _save: function(callback) {
            var self = this,
                history = this.$.history,
                project = this.$.project;

            if (this.$.saving) {
                // TODO: invoke another save later
                callback && callback("already saving");
                return;
            }

            this.set("saving", true);

            // always safe a new version
            project.set("id", undefined);

            project.save(null, function (err) {
                self.set("saving", false);

                if (err) {
                    // TODO: show some error message
                    console.error(err);
                } else {
                    history.navigate("project/" + project.$.id, true, false);
                }

                callback && callback(err);

            });

        },

        run: function (e) {

            e.preventDefault();

            var contentFrame = this.$.contentFrameTemplate.createInstance(),
                result = this.$.result;

            result.removeAllChildren();

            result.addChild(contentFrame);

            var doc = contentFrame.$el.contentWindow || contentFrame.$.el.contentDocument,
                wnd = contentFrame.$el.contentWindow,
                runConfig,
                files = this.$.project.$.files;

            runConfig = JSON.parse(config);

            var version = this.PARAMETER().version || "";

            if (version === "${VERSION}") {
                version = "";
            }

            if (version) {
                version = "/" + version;
            }

            runConfig.baseUrl = "/" + (version || "");


            files.each(function (file) {
                var path = file.$.path.replace(/\.[^.]+$/, "");

                if (file.isXaml()) {
                    runConfig.xamlClasses.push(file.$.path.replace(/\.xml$/i, ""));
                    runConfig.paths[path] = "data:" + file.$.content;
                } else {
                    // TODO: use base64 after release of requirejs 2.1.9 which supports data urls
                    runConfig.paths[path] = "data:text/javascript," + file.$.content + "\n//";
                }

            });

            if (doc.document) {
                doc = doc.document;
            }

            doc.open();
            doc.write(start.replace(/\$\{version\}/g, version));

            wnd.onload = function () {
                wnd.window.rAppid.bootStrap("app/App.xml", null, null, runConfig, function (err) {
                    err && console.error(err);
                });
            };

            doc.close();

        },

        eql: function(a, b){
            return a === b;
        }

    });

});