import * as config from './config'
import * as utilities from './utilities'
import * as model from '../common/model'
import * as vutils from '../common/viewutils'
import * as view from './view'
import * as search from './search'
import * as graphs from './graphs'
import * as api from './api'
import * as exporter from './exporter'

var module_basename = "results";
var actions = [{
    name: "refresh",
    title: "Refresh",
    icon: "sync",
    style: "info",
    modal: null,
    action: function() {
        refresh();
    },
}, {
    name: "export",
    title: "Export",
    icon: "download",
    style: "info",
    modal: null,
    action: function() {
    },
}];

var show_results_overview = function(attribute, container_id) {
    api.get_stats(attribute, function(min, max, avg, output) {
        let container = $(container_id);
        container.empty();
        container.append("<li><strong>Min</strong>: " + utilities.format_number(min) + "</li>");
        container.append("<li><strong>Max</strong>: " + utilities.format_number(max) + "</li>");
        container.append("<li><strong>Average</strong>: " + utilities.format_number(avg) + "</li>");
        vutils.fix_height(config.vars.step);
    });
};

var results_overview = function() {
    show_results_overview("star_count", "#stars_results ul");
    show_results_overview("pull_count", "#pulls_results ul");
};

var load_first_page = function() {
    api.get_page(1, function(images, count, pages) {
        $(config.selectors.results_container).show();
        $(config.selectors.results_not_ready).hide();
        view.results.show_total(count);
        if (count > 0) {
            model.set_attributes(images[0]);
            graphs.set_charts_attribute_list();
            search.set_search_attribute_list();
            $("#"+config.selectors.sample_image_div).append(view.results.show_object(images[0], 0));
        }
        vutils.fix_height(config.vars.step);
    });
};

var refresh = function() {
    // Reload first page, to get new total
    load_first_page();
    // Reload pull and stars stats
    results_overview();
    // Reload charts
    // Search form stays as it is
    // We use the first image as template, so it cannot be changed
};

var init = function() {
    $(config.selectors.results_container).hide();
    vutils.setup_action_buttons(module_basename, actions);
    //$("#results_stop").hide();
    view.results.setup_scale_modal();
    search.init(config.selectors.results_container);
    graphs.init(config.selectors.results_container);
    
    load_first_page();
    results_overview();
    exporter.init();
};

export {
    init
}
