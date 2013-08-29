define(["srv/auth/AuthorizationProvider"], function (AuthorizationProvider) {

    var getValidator = /^\/api\/projects\/[^/]{24}$/,
        postValidator = /^\/api\/projects$/;

    return AuthorizationProvider.inherit({

        isResponsibleForAuthorizationRequest: function (context, authorizationRequest) {

            var method = (authorizationRequest.$.method || "").toUpperCase(),
                path = context.request.urlInfo.path;

            if (authorizationRequest.$.type === "RestResource") {

                if (method === "GET" && getValidator.test(path)) {
                    return true;
                }

                if (method === "POST" && postValidator.test(path)) {
                    return true;
                }

            }

            return false;

        },

        _isAuthorized: function (context, authorizationRequest) {
            // throw no error, because if we responsible for this request, we'll allow it
        }

    });

});