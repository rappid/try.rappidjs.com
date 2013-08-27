define(["js/core/Module"], function(Module) {

    return Module.inherit({

        defaults: {
            context: null,
            project: "{context.project}"
        },

        inject: {
            context: "context"
        }

    });

});