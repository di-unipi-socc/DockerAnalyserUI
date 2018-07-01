import * as config from './config'
import * as model from '../common/model'
import * as settings from '../common/settings'
import * as vutils from '../common/viewutils'
import * as view from './view'
import * as packager from '../editor/packager'

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

var upload_package = function() {
    console.log("building");
    packager.create_zip(function(content, filename) {
        $.ajax({
            url: settings.urls.compose.upload,
            type: "POST",
            enctype: "multipart/form-data",
            processData: false,  // Important!
            contentType: false,
            cache: false,
            success: function(response) {
                console.log("SUCCESS: ", response);
            },
            error: function(e) {
                console.log("ERROR:", e.responseText);
            }
        });

        $.post(settings.urls.compose.upload, {"deploy-package": content})
            .done(function(response) {
                console.log("post success");
                console.log(response);
            })
            .fail(function(xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                console.log(err.Message);
            });
    });
    //$(config.selectors.docker_up_button).show();
    /*create_zip(function(content, zip_name) {
        $.getJSON(settings.urls.compose.build, {"package": content})
            .done(function(response) {
                $(config.selectors.docker_build_up).show();
            })
            .fail(function() {
                view.show_error(settings.msgs.error_generic);
            });
    });*/
};

var docker_build = function() {
    console.log("building");
    $(config.selectors.docker_up_button).show();
    /*create_zip(function(content, zip_name) {
        $.getJSON(settings.urls.compose.build, {"package": content})
            .done(function(response) {
                $(config.selectors.docker_build_up).show();
            })
            .fail(function() {
                view.show_error(settings.msgs.error_generic);
            });
    });*/
};

//up?service=scanner&scale=3
var docker_up = function(service) {
    let data = {};
    if (service)
        data["service"] = service;
    $.getJSON(settings.urls.compose.up, data)
        .done(function(response) {
            docker_status();
        })
        .fail(function() {
            view.show_error(settings.msgs.error_generic);
        });
};

var docker_stop = function(service) {
    $.getJSON(settings.urls.compose.stop)
        .done(function(response) {
            if (response.err == 0)
                docker_status();
            else 
                view.show_error(response.msg);
        })
        .fail(function() {
            view.show_error(settings.msgs.error_generic);
        });  
};

// GET /compose/status
var docker_status = function() {
    $.getJSON(settings.urls.compose.status)
        .done(function(response) {
            if (response.err == 0)
                view.status.setup_icons(response.services, docker_up, docker_stop);
            else 
                view.show_error(response.msg);
        })
        .fail(function() {
            view.show_error(settings.msgs.error_server);
        }); 
};

// GET /up?service=scanner&scale=3
var docker_scale = function(service, scale) {
    console.log("called up");
    let data = {service: service, scale: scale};
    $.getJSON(settings.urls.compose.scale, data)
        .done(function(response) {
            console.log("scale ok");
            if (response.err != 0)
                view.show_error(response.msg);
        })
        .fail(function() {
            //view.show_error(settings.msgs.error_generic);
        });
};

var init = function() {
    vutils.setup_action_buttons(module_basename, actions);
    docker_status();
    view.status.setup_service_modal();
    view.manage.setup_scale_modal();
    $("#"+config.selectors.scale_form).submit(function(event) {
        event.preventDefault();
        docker_scale("scanner", $("#"+config.selectors.scale_amount).val());
    });
    
};

export {
    init
}
