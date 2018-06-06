import * as config from './config'
import * as model from './model'
import * as view from './view'

var $ = require("jquery");

/**
 * Adds a new file to the editor or overwrites an existing file content.
 * @param {string} filename name of the file
 * @param {string} type file mime type
 * @param {string} content file content
 */
var add_item = function(filename, type, content) {
    let item = model.get_item(filename);
    if (item && item.editor != null) {
        // If the file is already open, its content gets overwritten
        item.editor.setValue(content, 1);
    } else {
        // Create new editor and update model with editor reference
        let editor = view.editor.add_element(filename, type, content);
        model.update_item(filename, {"editor": editor, "content": content});
        let item = model.get_item(filename);
    }
};

/**
 * If present, removes a specific file from the editor.
 * @param {string} filename name of the file
 */
var remove_item = function(filename) {
    let item = model.get_item(filename); 
    if (item) { // Superfluo?
        view.editor.remove_tab(filename);
        view.editor.show_first_tab();
    }
};

/**
 * Initialises the editor loading the analysis file.
 */
var init = function() {
    let file = config.analysis_file;
    model.add_item(file.name, file.type, file.content, false, true);
    add_item(file.name, file.type, file.content);
};

/**
 * Removes all open editors. UNUSED
 */
var reset = function() {
    var files = model.get_items();
    $.each(files, function(filename, values) {
        if (values.editor) {
            remove_item(filename);
        }
    });
};

export {
    init, 
    add_item,
    remove_item
};
