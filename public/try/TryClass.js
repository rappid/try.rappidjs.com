define(["js/core/Application", "js/core/Bindable", "js/core/History"], function(Application, Bindable, History) {

    return Application.inherit({

        defaults: {
            context: Bindable,

            /***
             * @codeBehind
             * @type js.core.Injection
             */
            injection: null
        },

        inject: {
            history: History
        },

        start: function() {
            this.$.history.set("useState", true);
            this.$.injection.addInstance("context", this.$.context);

            this.callBase();
        }

    });
});
