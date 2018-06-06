import * as config from './config'
import * as utilities from './utilities'
import * as model from './model'

var $ = require("jquery");

/**
 * Shows a general error message.
 * @param {string} msg the error message
 */
var show_error = function(msg) {
    let div = $("<div />").attr({"role": "alert", "class": "alert alert-danger alert-dismissible fade show"});
    let close_button = $("<button />").attr({"type": "button", "class": "close", "data-dismiss": "alert", "aria-label": "Close"});
    let close_icon = $("<span />").attr("aria-hidden", "true").html("&times;");
    close_button.append(close_icon);
    div.append(msg);
    div.append(close_button);
    $(config.selectors.error_container).append(div);
};

/**
 * Shows a confirmation modal with the message provided.
 * If the user confirms, it calls the callback provided with the values provided.
 * @param {string} msg file mime type
 * @param {function} callback file mime type
 * @param {Object} values file mime type
 */
var confirm = function(msg, callback, values) {
    $(config.selectors.confirm_msg_id).html(msg);
    $(config.selectors.confirm_modal_id).modal("show");
    $(config.selectors.confirm_button_id).unbind("click");  // Removing previous bindings
    $(config.selectors.confirm_button_id).click(function() {
        callback(values);
    });
};

/**
 * Returns a new button with the provided text.
 * It can be an "info" button or a "danger" button. Info is the default.
 * @param {string} txt text to show inside the button
 * @param {boolean} error if it's requested a "danger" button
 */
var get_text_button = function(txt, error) {
    let button_attributes = {
        type: "button",
        class: config.vars.action_btn_class
    }
    let button = $("<button />").attr(button_attributes).html(txt);
    if (error)
        button.addClass("btn-outline-danger");
    return button;
};

var get_button = function(icon, style) {
    let button_attributes = {
        type: "button",
        class: config.vars.action_btn_class
    }
    let button = $("<button />").attr(button_attributes);
    button.addClass("btn-outline-"+style);
    let i = $("<i />").attr("class", "fas fa-"+icon);
    button.append(i);
    return button;
};

var create_action_button = function(basename, values) {
    let button_attributes = {
        "type": "button",
        "class": "btn btn-outline-"+values.style,
        "id": basename+"_"+values.name,
        "data-toggle": "tooltip",
        "data-placement": "bottom",
        "title": values.title,
    }
    let icon = $("<i />").attr("class", "fas fa-"+values.icon);
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

/**
 * Returns a string variant of the filename, removing spaces and special 
 * characters, so it can be more easily used as an ID for DOM elements.
 * @param {string} filename the complete file name
 * @returns {string} the normalised file name
 */
var get_basename = function(filename) {
    return utilities.normalise(filename);
};

var results = {
    show_total: function(num) {
        $(config.selectors.num_images_id).html(num);
    },
    show_results: function(items) {
        console.log("showing results");
        $.each(items, function(idx, item) {
            console.log(idx);
            let div = $("<div />").attr({"class": "card"});
            let header_id = "header_"+idx;
            let body_id = "body_"+idx;
            let header_container = $("<div />").attr({"class": "card-header", "id": header_id});
            let header = $("<h5 />").attr({"class": "mb-0"});
            let button = $("<button />").attr({
                "class": "btn btn-link image-id", 
                "data-toggle": "collapse",
                "data-target": "#"+body_id,
                "aria-expanded": "false",
                "aria-controls": body_id,
            });
            button.html('<i class="fas fa-caret-right"></i><i class="fas fa-caret-down"></i> ' + item["_id"]);
            header.append(button);
            header_container.append(header);
            let body_container = $("<div />").attr({
                "id": body_id,
                "class": "collapse",
                "aria-labelledby": header_id,
            });
            let body = $("<div />").attr({"class": "card-body"});
            $.each(item, function(key, val) {
                let el = $("<div />").html("<strong>" + key + ":</strong> " + val);
                body.append(el);
            });
            body_container.append(body);
            div.append(header_container);
            div.append(body_container);
            $(config.selectors.results_list).append(div);
        });
        $(config.selectors.results_container).show();
    },
    show_endpoint_modal: function() {
        $(config.selectors.endpoint_modal_id).modal("show");
    },
    hide_endpoint_modal: function() {
        $(config.selectors.endpoint_modal_id).modal("hide");
    },
};

export {
    show_error,
    confirm,
    get_text_button,
    get_button,
    setup_action_buttons,
    results,
};
