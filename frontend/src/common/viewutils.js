var get_main_box = function(id, title) {
    let div = $("<div />").attr({"id": id, "class": "border rounded results_container_box"});
    if (title) {
        let h3 = $("<h3 />").html(title);
        div.append(h3);
    }
    return div;
};

/**
 * Shows a general error message.
 * @param {string} msg the error message
 */
var generate_error = function(msg) {
    let div = $("<div />").attr({"role": "alert", "class": "alert alert-danger alert-dismissible fade show"});
    let close_button = $("<button />").attr({"type": "button", "class": "close", "data-dismiss": "alert", "aria-label": "Close"});
    let close_icon = $("<span />").attr("aria-hidden", "true").html("&times;");
    close_button.append(close_icon);
    div.append(msg);
    div.append(close_button);
    return div;
};

var show_error = function(msg, step_id) {
    let error = generate_error(msg);
    let container = $("#step-" + step_id + " .error-container");
    container.empty();
    container.append(error);
}

var get_close_button = function(dismiss) {
    let button = $("<button />").attr({"type": "button", "class": "close", "data-dismiss": dismiss, "aria-label": "Close"});
    let icon = $("<span />").attr({"aria-hidden": "true"}).html("&times;");
    button.append(icon);
    return button;
};

var get_help_icon = function(txt) {
    let help_icon = $("<i/>").attr({
        "class": "fas fa-question-circle help_icon",
        "data-toggle": "popover",
        "data-placement": "right", 
        "data-content": txt
    });
    return help_icon;
}

var create_action_button = function(basename, values) {
    let button_attributes = {
        "type": "button",
        "class": "btn btn-outline-"+values.style,
        "id": basename+"_"+values.name,
        "data-toggle": "tooltip",
        "data-placement": "bottom",
        "title": values.title,
    }
    let base_class = values.base_class;
    if (!base_class)
        base_class = "fas";  // solid
    let icon = $("<i />").attr("class", base_class + " fa-" + values.icon);
    let button = $("<button />").attr(button_attributes);
    button.append(icon);
    if (values.modal)
        button.click(function(){ $(values.modal).modal("show"); });
    if (values.action)
        button.click(function(){ values.action(); });
    return button;
}

var setup_action_buttons = function(basename, actions) {
    var section_selector = "#"+basename+"_actions";
    var container = $(section_selector);
    $.each(actions, function(idx, action) {
        let button = create_action_button(basename, action);
        container.append(button);
    });
}

var display_object = function(item, lv) {
    let cnt = $("<div />");
    $.each(item, function(key, val) {
        // Non mostriamo i campi che iniziano con un underscore
        if (key[0] == "_")
            return true;  // continue
        // Se il campo contiene un oggetto, lo rappresentiamo ricorsivamente
        if ($.type(val) == "object")
            val = display_object(val, lv+1);
        let k = $("<strong />").html(key + ": ");
        let el = $("<div />");
        for (let i=0; i<lv; i++) {
            let space = $("<div />").attr("class", "space");
            el.append(space);
        }
        el.append(k);
        if ($.type(val) != "object")
            val = ""+val;
        el.append(val);
        cnt.append(el);
    });
    return cnt;
};

var fix_height = function(idx) {
    let main = $('#smartwizard');
    let nav = main.children('ul');
    let steps = $("li > a", nav);
    let container = $('#smartwizard_container');
    let page = $(steps.eq(idx).attr("href"), main);
    let height = page.outerHeight();
    container.finish().animate({ minHeight: height }, 400, function(){});
}

export {
    get_main_box,
    generate_error,
    show_error,
    get_close_button,
    get_help_icon,
    create_action_button,
    setup_action_buttons, 
    display_object,
    fix_height
}