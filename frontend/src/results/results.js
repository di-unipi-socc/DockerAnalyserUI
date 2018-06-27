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
    name: "play",
    title: "Start Analyser",
    icon: "play",
    style: "info",
    modal: null,
    action: function() {
        docker_build();
        docker_up();
    },
}, {
    name: "stop",
    title: "Stop Analyser",
    icon: "stop",
    style: "danger",
    modal: null,
    action: function() {
        docker_stop();
    },
}, {
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

var status = {
    endpoint: config.urls.images,
    images: [],
    count: 0,
    current: 0,
    pages: 0,
    current_page: 1,
    limit: config.vars.page_size,
    max_calls: config.vars.concurrent_calls,
    attributes: {}
};

var show_results_overview = function(attribute, container_id) {
    api.get_stats(attribute, function(min, max, avg, output) {
        let container = $(container_id);
        container.empty();
        container.append("<li><strong>Min</strong>: " + utilities.format_number(min) + "</li>");
        container.append("<li><strong>Max</strong>: " + utilities.format_number(max) + "</li>");
        container.append("<li><strong>Average</strong>: " + utilities.format_number(avg) + "</li>");
    });
};

var results_overview = function() {
    show_results_overview("star_count", "#stars_results ul");
    show_results_overview("pull_count", "#pulls_results ul");
};

var add_images = function(imgs) {
    if (imgs != null && imgs != undefined && imgs.length > 0) {
        $.merge(status.images, imgs);
        status.current = status.current + imgs.length;
    } else {
        console.log("Problem with images");
        console.log(imgs);
    }
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
        }
    });
};

/* Carico i dati della prima pagina */
var load_images = function() {
    console.log("LOAD IMAGES");
    if (typeof $.when.all === 'undefined') {
        $.when.all = function (deferreds) {
            return $.Deferred(function (def) {
                $.when.apply($, deferreds).then(
                    function () {
                        def.resolveWith(this, [Array.prototype.slice.call(arguments)]);
                    },
                    function () {
                        def.rejectWith(this, [Array.prototype.slice.call(arguments)]);
                    });
            });
        }
    }

    var params = {limit: status.limit, page: status.current_page};
    $.getJSON(status.endpoint, params).done(function(data) {
        console.log("LOADING IMAGES");
        if (data.count > 0) {
            status.pages = data.pages;
            if (status.current > 0 && data.count > status.count) {
                // Se il numero di immagini e' aumentato
                // Rimuovo le vecchie immagini facenti parte dell'ultima pagina
                // Potrei anche fare una verifica e rimuoverle solo se l'ultima pagina non era piena
                let overflow = status.count % limit;
                if (overflow > 0)
                    status.images.splice(0, status.limit*(status.pages-1));  // Modifica l'array iniziale
            }
            status.count = data.count;
            add_images(data.images);
            model.set_attributes(data.images[0]);
            graphs.set_charts_attribute_list();
            search.set_search_attribute_list();
            //view.search.setup_search_form();
            /****
            //let keys = Object.keys(data.images[0]);
            view.results.show_total(status.count);
            //view.results.show_results(data.images);
            view.results.show_example_image(data.images[0]);
            $.each(data.images, function(idx, image){
                status.images.push(image);
            });
            ****/
            let deferreds = [];
            for (let i=status.current_page+1; i<=status.pages; i++) {
                params.page = i;
                deferreds.push($.getJSON(status.endpoint, params));
            }

            $.when.all(deferreds).then(function(results) {
                console.log("Resolved objects");
                $.each(results, function(idx, result) {
                    add_images(result[0].images);
                });
                results_overview();
                view.results.show_total(status.images.length);
                //view.results.show_results(status.images);
                //show_graph("pie", "star_count");
                //show_graph("pie", "pull_count");
                //show_graph("pie", "creator");
            });
        }
    })
    .fail(function() {
        view.show_error(config.msgs.error_generic);
    });
};

var docker_build = function() {
    console.log("building");
    $(config.selectors.docker_up_button).show();
    /*create_zip(function(content, zip_name) {
        $.getJSON(config.urls.compose.build, {"package": content})
            .done(function(data) {
                $(config.selectors.docker_build_up).show();
            })
            .fail(function() {
                view.show_error(config.msgs.error_generic);
            });
    });*/
};

var docker_up = function() {
    // Dovrebbe lanciare la build in automatico??
    console.log("up");
    window.location.href = "results.html";
    /*$.getJSON(config.urls.compose.up)
        .done(function(data) {
            window.location.href = "results.html";
            //document.location.href = "results.html";
        })
        .fail(function() {
            view.show_error(config.msgs.error_generic);
        });*/
};

var docker_stop = function() {
};

var set_endpoint = function(url) {
    //status.endpoint = url;
    load_first_page();
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
    search.init(config.selectors.results_container);
    graphs.init(config.selectors.results_container);
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
    
    load_first_page();
    results_overview();
    exporter.init();
};

export {
    init
}
