define(["js/data/Model", "js/data/Collection", "try/entity/File", "js/core/List"], function(Model, Collection, File, List) {

    return Model.inherit("try.model.Project", {

        schema: {
            files: [File]
        },

        defaults: {
            files: List
        },

        createFile: function() {
            return this.createEntity(File);
        }
    });
});