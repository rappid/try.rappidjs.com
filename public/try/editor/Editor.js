define(["require", "js/ui/View", "CodeMirror"], function(require, View, CodeMirror) {

    return View.inherit({
        defaults: {
            content: "",
            mode: null
        },

        _commitContent: function(content, oldContent, options) {
            var editor = this.$codeMirror;

            if (options && options.initiator === "doc") {
                return;
            }

            if (editor && editor.doc) {
                editor.doc.setValue(content || "");
            }
        },

        _commitMode: function(mode) {

            if (mode) {
                var self = this;
                require([this.baseUrl("try/lib/mode/" + mode + "/" + mode + ".js")], function() {
                    if (self.$codeMirror) {
                        self.$codeMirror.setOption("mode", mode);
                    }
                }, function(err) {
                    console.error(err);
                });
            }

        },

        _onDomAdded: function() {
            this.callBase();

            if (this.$added) {
                return;
            }

            var el = this.$el,
                self = this;

            this.$codeMirror = CodeMirror(function(element) {
                el.appendChild(element);
            }, {
                value: this.$.content,
                lineNumbers: true,
                mode: this.$.mode
            });

            this.$codeMirror.doc.on("change", function(doc) {
                self.set("content", doc.getValue(), {
                    initiator: "doc"
                });
            });

            this.$added = true;

        }
    });

});