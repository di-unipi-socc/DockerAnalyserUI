import * as config from './config'
import * as settings from '../common/settings'
import * as vutils from '../common/viewutils'
import * as model from '../common/model'
import * as view from './view'

var module_basename = "config";
var actions = [{
    name: "reset",
    title: "Reset Last Configuration",
    icon: "undo",
    style: "danger",
    modal: null,
    action: function() {
        get_configuration();
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


// La validazione viene già fatta dal form, ma per scrupolo andrebbe ripetuta
var save_configuration = function() {
    $.each(config.form_fields, function(i, values) {
        let configuration = {
            service: values.name,
            command: values.command,
            args: {}
        };
        $.each(values.items, function(j, item) {
            let value = null;
            if (item.type == "radio")
                value = $(config.selectors.config_form + " input[name=" + item.name + "]:checked").val();
            else if (item.type == "checkbox")
                value = $(config.selectors.config_form + " #" + item.name).is(":checked");
            else {
                value = $(config.selectors.config_form + " #" + item.name).val();
                if (item.type == "number")
                    value = parseInt(value, 10);
            }
            configuration["args"][item.name] = value;
        });
        post_configuration(configuration);
    });
};

var post_configuration = function(data) {
    $.post(settings.urls.compose.config, JSON.stringify(data))
        .done(function(response) {
            if (response.err == 0) {
                vutils.show_info(settings.msgs.info_config, config.vars.step_id);
                get_configuration();    // Reload configuration to check success
            } else
                view.show_error(response.msg);
        })
        .fail(function(xhr, status, error) {
            view.show_error(settings.msgs.error_server);
        });
}

var get_configuration = function() {
    $.getJSON(settings.urls.compose.config)
        .done(function(response) {
            $(config.selectors.config_form).show();
            if (response.err == 0)
                view.configurator.setup_form(response, save_configuration);
            else
                view.show_error(response.msg);
            vutils.fix_height(config.vars.step);
        })
        .fail(function() {
            view.show_error(settings.msgs.error_server);
            $(config.selectors.config_form).hide();
        }); 
};

var refresh = function() {
    vutils.clean_messages(config.vars.step_id);
    get_configuration();
};

var init = function() {
    vutils.setup_action_buttons(module_basename, actions);
    //get_configuration();
};

export {
    init,
    refresh,
    save_configuration
}