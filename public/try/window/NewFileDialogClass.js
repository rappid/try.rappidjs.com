define(["xaml!js/ui/Dialog", "raw!try/templates/Class.template", "raw!try/templates/Xaml.template", "try/entity/File"], function (Dialog, ClassTemplate, XamlTemplate, File) {

    var templateMap = {
        Model: {
            namespace: "app.model",
            parentClassName: "js.core.Model",
            isXaml: false
        },

        Component: {
            namespace: "app.view",
            parentClassName: "js.ui.View",
            isXaml: true
        },

        Module: {
            namespace: "app.module",
            parentClassName: "js.core.Module",
            isXaml: true
        }
    };

    return Dialog.inherit("try.window.NewDialogClass", {

        defaults: {
            title: "Create new file",
            className: null,
            parentClassName: null,
            isXaml: null
        },

        ctor: function () {
            this.callBase();
            this.loadTemplate("Component")
        },

        confirmDialog: function () {

            var files = [],
                file;

            if (this.$.isXaml) {

                // code behind file
                file = new File({
                    path: this.$.className.replace(/\./g, "/") + "Class.js"
                });

                file.set("content", replace(ClassTemplate, {
                    "{ImportNamespace}": this.$.parentClassName.replace(/\./g, "/"),
                    "{fqClassName}": this.$.className + "Class",
                    "{ImportClass}": this.$.parentClassName.split(".").pop() || "Foo"
                }));

                files.push(file);

                // xaml file
                file = new File({
                    path: this.$.className.replace(/\./g, "/") + ".xml"
                });

                var foo = this.$.className.split(".");

                file.set("content", replace(XamlTemplate, {
                    "{prefix}": foo[foo.length - 2].toLowerCase(),
                    "{parentClass}": foo[foo.length - 1] + "Class",
                    "{parentNamespace}": this.$.className.replace(/\.[^.]+$/, "")
                }));

                files.push(file);




            } else {
                // just a javascript file
                file = new File({
                    path: this.$.className.replace(/\./g, "/") + ".js"
                });

                file.set("content", replace(ClassTemplate, {
                    "{ImportNamespace}": this.$.parentClassName.replace(/\./g, "/"),
                    "{fqClassName}": this.$.className,
                    "{ImportClass}": this.$.parentClassName.split(".").pop() || "Foo"
                }));

                files.push(file);
            }


            this.close(files);


            function replace(search, replacements) {
                var ret = search;

                for (var key in replacements) {
                    if (replacements.hasOwnProperty(key)) {
                        ret = ret.split(key).join(replacements[key])
                    }
                }

                return ret;
            }
        },

        loadTemplate: function (type) {

            var template = templateMap[type];
            if (template) {
                this.set({
                    className: template.namespace + "." + type,
                    parentClassName: template.parentClassName,
                    isXaml: template.isXaml
                });
            }

        }

    });
});