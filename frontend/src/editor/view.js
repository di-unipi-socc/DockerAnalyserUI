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

var editor = {
    show_first_tab: function() {
        $(config.selectors.tab_container_id+" li:first-child a").tab("show");
    },
    add_tab: function(filename) {
        let basename = get_basename(filename);
        let li = $("<li />").attr("class", "nav-item");
        let a_attributes = {
            "class": "nav-link",
            "data-toggle": "tab",
            "role": "tab",
            "id": basename+"-tab",
            "href": "#"+basename,
            "aria-controls": basename
        };
        let a = $("<a />").attr(a_attributes);
        a.html(filename);
        li.append(a);
        $(config.selectors.tab_container_id).append(li);
        a.tab("show");
    },
    remove_tab: function(filename) {
        let basename = get_basename(filename);
        let tab_id = basename+"-tab";
        //$("#"+tab_id).tab("dispose");
        $("#"+tab_id).parent().remove();
        $("#"+basename).remove();
    },
    add_content: function(filename, type, content) {
        let basename = get_basename(filename);
        let div_attributes = {
            "class": "tab-pane fade", 
            "role": "tabpanel",
            "id": basename, 
            "aria-labelledby": basename+"-tab",
            "position": "relative"
        };
        let editor_id = "editor_" + basename;
        let div = $("<div />").attr(div_attributes);
        let div2 = $("<div />").attr({"id": editor_id, "class": "ace_editor"});
        div.append(div2);
        $(config.selectors.tab_content_container_id).append(div);

        let editor = ace.edit(editor_id);
        //editor.setTheme("ace/theme/twilight");
        let language = utilities.identify_language(type);
        editor.session.setMode("ace/mode/"+language);
        editor.$blockScrolling = Infinity;
        editor.setOptions({
            enableBasicAutocompletion: true,
            //enableSnippets: true,
            enableLiveAutocompletion: false
        });
        if (filename == config.req_file.name)
            editor.setReadOnly(true);
        editor.setValue(content, 1);
        return editor;
    },
    add_element: function(filename, type, content) {
        let editor = this.add_content(filename, type, content);
        this.add_tab(filename);
        return editor;
    },
};

var uploader = {
    add_item: function(filename, edit_button, remove_button) {
        let basename = get_basename(filename);
        let tr = $("<tr />").attr("id", "uploaded_"+basename+"_container");
        let td_name = $("<td />").attr("id", "uploaded_"+basename).html(filename);
        let td_action1 = $("<td />");
        if (edit_button)
            td_action1.append(edit_button);
        let td_action2 = $("<td />").append(remove_button);
        tr.append(td_name);
        tr.append(td_action1);
        tr.append(td_action2);
        $(config.selectors.uploaded_list_id).append(tr);
    },
    remove_item: function(filename) {
        let basename = get_basename(filename);
        $("#uploaded_"+basename+"_container").remove();
    },
    set_editing: function(filename, edit_button) {
        let basename = get_basename(filename);
        $("#uploaded_"+basename).addClass(config.vars.uploaded_editing_class);
        edit_button.remove();
    },
    empty: function() {
        $(config.selectors.uploaded_list_id).empty();
    },
    hide_modal: function() {
        $(config.selectors.uploads_modal).modal("hide");
    },
};

var requirements = {
    add_item: function(name, version, versions_button, remove_button) {
        let tr = $("<tr />").attr("id", "req_"+name);
        let versions_id = name + "_ver_list";
        let last_version = $("<span />").attr("id", versions_id)
        let last_version_txt = $("<span />").attr("id", versions_id+"_txt").html(version);
        let last_version_input = $("<input />").attr({"type": "hidden", "id": versions_id+"_selected", "value": version});
        last_version.append(last_version_txt);
        last_version.append(last_version_input);
        let td_name = $("<td />").html(name);
        let td_version = $("<td />").append(last_version);
        let td_action1 = $("<td />").append(versions_button);
        let td_action2 = $("<td />").append(remove_button);
        tr.append(td_name);
        tr.append(td_version);
        tr.append(td_action1);
        tr.append(td_action2);
        $(config.selectors.req_container_id).append(tr);
    },
    remove_item: function(name) {
        $("#req_"+name).remove();
    },
    show_modal: function() {
        $(config.selectors.req_modal_id).modal("show");
    },
    empty_modal_container: function() {
        $(config.selectors.req_search_results_id).empty();
    },
    add_modal_item: function(name, version, action_buttons) {
        let versions_id = name + "_ver";
        let tr = $("<tr />");
        let last_version = $("<span />").attr("id", versions_id).html(version);
        let last_version_input = $("<input />").attr({"type": "hidden", "id": versions_id+"_selected", "value": version});
        last_version.append(last_version_input);
        let td_name = $("<td />").html(name);
        let td_version = $("<td />").append(last_version);
        let td_actions = $("<td />")
        $.each(action_buttons, function(idx, action_button){
            td_actions.append(action_buttons);
        });
        tr.append(td_name);
        tr.append(td_version);
        tr.append(td_actions);
        $(config.selectors.req_search_results_id).append(tr);
    },
    replace_versions: function(name, versions, last_version, in_list, callback) {
        let versions_id = name + "_ver";
        if (in_list)
            versions_id = versions_id + "_list";
        var select_name = versions_id + "_selected";
        var version_select = $("<select />").attr({"name": select_name, "id": select_name});
        $.each(versions, function(idx, ver) {
            let option = $("<option />").html(ver);
            if (ver == last_version)
                option.attr("selected", "selected");
            version_select.append(option);
        });
        $("#"+versions_id).empty();
        $("#"+versions_id).append(version_select);
        if (callback) {
            $(version_select).change(function() {
                callback($(this).val());
            });
        }
    },
    replace_selected_version: function(name, version) {
        let versions_id = name + "_ver_list";
        var select_name = versions_id + "_selected";
        $("#"+versions_id+"_txt").html(version);
        $("#"+select_name).val(version);
    },
    preview: function(lines) {
        $(config.selectors.req_preview_div).html(lines.join("<br>"));
    }
};

export {
    show_error,
    confirm,
    get_text_button,
    get_button,
    setup_action_buttons,
    editor,
    requirements,
    uploader,
};
