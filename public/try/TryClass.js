define(["js/core/Application", "js/core/Bindable", "js/core/History"], function(Application, Bindable, History) {

    return Application.inherit({

        defaults: {
            context: Bindable,

            /***
             * @codeBehind
             * @type js.core.Injection
             */
            injection: null,

            moduleLoaded: false,

            /***
             * @codeBehind
             */
            moduleLoader: null
        },

        inject: {
            history: History
        },

        start: function() {
            this.$.history.set("useState", this.runsInBrowser() && ("onpopstate" in window));
            this.$.injection.addInstance("context", this.$.context);

            this.callBase();
        },

        loadRunModule: function(routeContext) {
            var moduleLoader = this.$.moduleLoader,
                self = this,
                runsInBrowser = self.runsInBrowser();


            if (runsInBrowser) {
                // don't wait for module loaded complete to show awesome loader
                routeContext.callback();
            }

            moduleLoader.loadModule("run", function (err) {
                self.set("moduleLoaded", true);

                if (!runsInBrowser) {
                    // node rendering, wait for module loaded and pass loading state
                    routeContext.callback(err);
                }
            }, routeContext);

        }.async()

    });
});
