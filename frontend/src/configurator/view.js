import * as config from './config'

var forms = {
    add_fieldset: function(label, container) {
        let fieldset = $("<fieldset />").attr({"class": "container"});
        let legend = $("<legend />").html(label);
        fieldset.append(legend);
        if (container)
            $(container).append(fieldset);
        return fieldset;
    },
    add_field: function(field, container) {
        let div = $("<div />").attr({"class": "row"});
        let is_checkbox = (field.type == "checkbox");
        //let is_number = (type == "number");
        let input_class = "col-sm-4";
        let label_class = "col-sm-2";
        let help_class =  "col-sm-6";
        if (is_checkbox) {
            input_class = "col-sm-6";
            label_class = "";
        }
        let input_container = $("<div />").attr({"class": input_class});
        let label = $("<label />").attr({
            "for": field.name,
            "class": is_checkbox ? " form-check-label" : label_class + " colon", 
        });
        label.html(field.label);
        
        if (field.type == "radio") {
            div.append(label);
            $.each(field.values, function(idx, values) {
                let radio_container = $("<div />").attr({"class": "form-check form-check-inline"});
                let id = field.name + idx;
                let input = $("<input />").attr({
                    "type": "radio",
                    "name": field.name,
                    "id": id,
                    "class": "form-check-input", 
                    "value": values.value
                });
                let lbl = $("<label />").attr({
                    "for": id,
                    "class": "form-check-label", 
                }).html(values.label);
                if (values.value == field.default)
                    input.attr("checked", "checked");
                radio_container.append(input);
                radio_container.append(lbl);
                input_container.append(radio_container);
            });
        } else {
            let input = $("<input />").attr({
                "type": field.type,  // text, number, checkbox
                "name": field.name,
                "id": field.name,
                "class": is_checkbox ? "form-check-input" : "form-control form-control-sm", 
                "placeholder": field.label
            });    
            if (is_checkbox) {
                input.attr("value", "t");
                if (field.default == true)
                    input.attr("checked", "checked");
                input_container.addClass("form-check checkbox-row");
                input_container.append(input);
                input_container.append(label);
            } else {
                input.attr("value", field.default);
                input_container.append(input);
                div.append(label);
            }
        }
        let help_container = $("<div />").attr({"class": help_class});
        let help = $("<small />").attr({"class": "form-text text-muted"}).html(field.help);
        help_container.append(help);
        div.append(input_container);
        div.append(help_container);
        if (container)
            $(container).append(div);
        return div;
    },
    get_submit_button: function(id, value) {
        return $("<input />").attr({"type": "submit", "class": "btn btn-info", "value": value, "id": id});
    }
}

var configurator = {
    setup_form: function() {
        let form = $(config.selectors.config_form);
        form.empty();
        $.each(config.form_fields, function(i, values) {
            let fieldset = forms.add_fieldset(values.title, form);
            $.each(values.items, function(j, item) {
                forms.add_field(item, fieldset);
            });
        });
        let submit_button = forms.get_submit_button("update_config", "Update Configuration");
        let clear_button = forms.get_submit_button("default_config", "Reset Defaults");
        clear_button.click(function(event) {
            event.preventDefault();
            configurator.setup_form()
        });
        form.append(clear_button);
        form.append(submit_button);
    }
}

export {
    forms,
    configurator
}