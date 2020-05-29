import simpleAJAX from "./simple_ajax";

const api = {
    http: null,
    prefix: '/api/v1',

    init: () => {
        api.http = new simpleAJAX;
    },

    post: (uri, data, options) => {

        if(options === undefined) {
            options = {};
        }
        if(options.error === undefined) {
            options.error = () => {};
        }
        if(options.success === undefined) {
            options.success = () => {};
        }

        api.http.post(api.prefix + uri, data, function (err, response) {
            if(err) {
                options.error(err);
            }
            else {
                options.success(response);
            }
        });

    }

};

export default api;
