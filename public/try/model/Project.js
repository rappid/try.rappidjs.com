define(["js/data/Model", "js/data/Collection", "try/model/File", "js/core/List"], function(Model, Collection, File, List) {

    return Model.inherit("try.model.Project", {

        schema: {
            files: Collection.of(File)
        },

        defaults: {
            files: List
        }

    });
});