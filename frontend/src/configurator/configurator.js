import * as config from './config'
import * as model from '../common/model'
import * as view from './view'

// La validazione viene già fatta dal form, ma andrebbe ripetuta
var save_configuration = function() {
    let configuration = {};
    $.each(config.form_fields, function(i, values) {
        configuration[values.name] = {};
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
            configuration[values.name][item.name] = value;
        });
    });
    console.log(configuration);
    model.update_configuration(configuration);
}

var init = function() {
    model.init_configuration(config.form_fields);
    view.configurator.setup_form();
    $(config.selectors.config_form).submit(function(event) {
        event.preventDefault();
        save_configuration();
    });
}

export {
    init
}