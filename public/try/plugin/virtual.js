define([], function() {

    return {
        version: "0.1.0",

        load: function(name, parentRequire, load, config) {

            var content,
                url = parentRequire.toUrl(name),
                match = /^([^!]+)!.+$/.exec(name);

            if (match) {

                // load with additional loader plugin
                if (match[1] === "xaml") {
                    window.getVirtualFile(name + ".xml").$.content;

                    parentRequire(["xaml!data])
                } else {
                    throw new Error("Not supported plugin with virtual file system");
                }

            } else {
                // javascript
                content = window.getVirtualFile(url.replace(/^\.\//, "")).$.content;
            }




        }

    }

});