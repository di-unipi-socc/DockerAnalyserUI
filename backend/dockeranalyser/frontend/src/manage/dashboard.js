import * as config from './config'
import * as modal from '../common/modals'
import * as settings from '../common/settings'
import * as vutils from '../common/viewutils'
import * as view from './view'
import * as packager from '../editor/packager'
import * as api from '../common/images_api'

var module_basename = "manage";
var actions = [{
    name: "build",
    title: "Build",
    icon: "docker",
    base_class: "fab",
    style: "info",
    modal: null,
    action: function() {
        upload_package();
    },
}, {
    name: "start",
    title: "Start All Services",
    icon: "play",
    style: "info",
    modal: null,
    action: function() {
        docker_up();
    },
}, {
    name: "stop",
    title: "Stop All Services",
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
    action: null
}, {
    name: "drop",
    title: "Remove All Images",
    icon: "trash-alt",
    style: "danger",
    modal: null,
    action: function() {
        vutils.confirm(settings.msgs.confirm_drop_images, drop_images);
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
}];

var interval = null;

var upload_package = function() {
    packager.create_zip(function(content, filename) {
        var data = new FormData();
        data.append("deploy-package", content);
        $.ajax({
            url: settings.urls.compose.upload,
            type: "POST",
            enctype: "multipart/form-data",
            processData: false,  // Important!
            contentType: false,
            cache: false,
            data: data,
            success: function(response) {
                console.log("SUCCESS: ", response);
                if (response.err == 0)
                    docker_build();
            },
            error: function(e) {
                console.log("ERROR:", e.responseText);
            }
        });
    });
};

var docker_command = function(url, service, callback) {
    let data = {};
    if (service)
        data["service"] = service;
    $.getJSON(url, data)
        .done(function(response) {
            if (response.err == 0)
                if (callback)
                    callback(response);
            else 
                view.show_error(response.msg);
        })
        .fail(function() {
            view.show_error(settings.msgs.error_generic);
        });  
};

var docker_up = function(service) {
    docker_command(settings.urls.compose.up, service, function(response) { docker_status(); });
};

var docker_stop = function(service) {
    docker_command(settings.urls.compose.stop, service, function(response) { docker_status(); });
};

var docker_build = function() {
    docker_command(settings.urls.compose.build, "scanner", function() {
        vutils.show_info(settings.msgs.info_build, config.vars.step_id);
        docker_status();
    });
};

var docker_logs = function(service) {
    docker_command(settings.urls.compose.logs, service, function(data) {
        view.status.show_logs(data.services[0].log);
    });
};

var docker_status = function() {
    view.manage.show_refresh_time();
    load_first_page();
    $.getJSON(settings.urls.compose.status)
        .done(function(response) {
            vutils.show_body(config.vars.step_id);
            if (response.err == 0)
                view.status.setup_icons(response.services, docker_up, docker_stop, docker_logs);
            else 
                view.show_error(response.msg);
        })
        .fail(function() {
            // Server is not responding of Interval Server Error
            view.show_error(settings.msgs.error_server);
            vutils.hide_body(config.vars.step_id);
        }); 
};

var docker_scale = function(service, scale) {
    let data = {service: service, scale: scale};
    $.getJSON(settings.urls.compose.scale, data)
        .done(function(response) {
            console.log("scale ok");
            if (response.err != 0)
                view.show_error(response.msg);
            else {
                vutils.show_info(settings.msgs.info_scale, config.vars.step_id);
                docker_status();
            }
        })
        .fail(function() {
            view.show_error(settings.msgs.error_generic);
        });
};

var drop_images = function() {
    $.getJSON(settings.urls.images.drop)
        .done(function(response) {
            if (response.err != 0)
                view.show_error(response.msg);
            else {
                view.manage.show_total(0);
                vutils.show_info(settings.msgs.info_drop, config.vars.step);
            }
        })
        .fail(function() {
            view.show_error(settings.msgs.error_generic);
        });
}

var load_first_page = function() {
    api.get_page(1, function(images, count, pages) {
        view.manage.show_total(count);
    });
};

var refresh = function() {
    vutils.clean_messages(config.vars.step_id);
    docker_status();
    //if (interval == null)
    //    interval = setInterval(function(){ refresh(); }, config.vars.reload_timeout*1000);
}

var stop_refresh = function() {
    if (interval != null)
        clearInterval(interval);
    interval = null;
}

var init = function() {
    refresh();
    vutils.setup_action_buttons(module_basename, actions);
    view.status.setup_service_modal();
    view.status.setup_logs_modal();
    view.manage.setup_scale_modal();
    $("#"+config.selectors.scale_form).submit(function(event) {
        event.preventDefault();
        modal.hide(config.selectors.scale_modal);
        docker_scale("scanner", $("#"+config.selectors.scale_amount).val());
    });
};

export {
    init,
    refresh,
    stop_refresh,
}
