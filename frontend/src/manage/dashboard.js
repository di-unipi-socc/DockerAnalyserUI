import * as config from './config'
import * as model from '../common/model'
import * as vutils from '../common/viewutils'
import * as view from './view'

var module_basename = "manage";
var actions = [{
    name: "build",
    title: "Build",
    icon: "docker",
    base_class: "fab",
    style: "info",
    modal: null,
    action: function() {
        docker_build();
    },
}, {
    name: "start",
    title: "Start Analyser",
    icon: "play",
    style: "info",
    modal: null,
    action: function() {
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
    name: "scale",
    title: "Scale Scanners",
    icon: "arrows-alt-v ",
    style: "info",
    modal: config.selectors.scale_modal,
    action: function() {
        docker_scale();
    },
}];

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
    console.log("called up");
    $.getJSON(config.urls.compose.up)
        .done(function(data) {
            console.log("up ok");
            $("#results_start").hide();
            $("#results_stop").show();
            $("#results_build").hide();
        })
        .fail(function() {
            view.show_error(config.msgs.error_generic);
        });
};

var docker_stop = function() {
    console.log("called stop");
    $.getJSON(config.urls.compose.stop)
        .done(function(data) {
            console.log("stop ok");
            $("#results_stop").hide();
            $("#results_start").show();
            $("#results_build").show();
        })
        .fail(function() {
            view.show_error(config.msgs.error_generic);
        });  
};

// GET /compose/status
var docker_status = function() {
    $.getJSON(config.urls.compose.status)
        .done(function(data) {
            console.log("status ok");
            console.log(data);
        })
        .fail(function() {
            view.show_error(config.msgs.error_generic);
        }); 
};

// GET /up?service=scanner&scale=3
var docker_scale = function() {
};

var init = function() {
    vutils.setup_action_buttons(module_basename, actions);
};

export {
    init
}
