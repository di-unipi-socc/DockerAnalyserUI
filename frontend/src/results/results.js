import * as config from './config'
import * as utilities from './utilities'
import * as model from './model'
import * as view from './view'

var $ = require("jquery");

var endpoint;

var load_images = function() {
    $.getJSON(endpoint).done(function(data) {
        let count = data.count;
        if (count > 0) {
            //let keys = Object.keys(data.images[0]);
            view.results.show_total(count);
            view.results.show_results(data.images);
        }
    })
    .fail(function() {
        view.show_error(config.msgs.error_generic);
    });
};

var set_endpoint = function(url) {
    endpoint = url;
    load_images();
};

var init = function() {
    $(config.selectors.results_container).hide();
    $(config.selectors.endpoint_form).submit(function(event) {
        event.preventDefault();
        let url = $(config.selectors.endpoint_url_input).val();
        url = config.urls.images;
        set_endpoint(url);
        view.results.hide_endpoint_modal();
    });
    $(config.selectors.endpoint_set_button).click(function(){
        view.results.show_endpoint_modal();
    });
};

export {
    init
}
