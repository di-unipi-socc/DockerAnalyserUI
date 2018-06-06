var $ = require("jquery");

var files = {};

/**
 * Adds a file to the list or overwrites an existing file.
 * @param {string} filename name of the file
 * @param {string} type file mime type
 * @param {string} content file content
 * @param {boolean} uploaded true if the file has been uploaded by the user
 * @param {boolean} overwrite true in case the file should be overwritten if already present
 */
var add_item = function(filename, type, content, uploaded, overwrite) {
    if (files.hasOwnProperty(filename)) {
        if (overwrite) {
            files[filename].type = type;
            files[filename].content = content;
            files[filename].uploaded = uploaded;
        }
        return;
    }
    // Files gets added or overwritten
    files[filename] = {
        type: type,
        content: content, 
        uploaded: uploaded,
        editor: null
    };
};

/**
 * Removes and existing file.
 * @param {string} filename name of the file
 */
var remove_item = function(filename) {
    delete files[filename];
};

/**
 * Updates one or more attributes of an existing file.
 * Only updates the specified attributes. 
 * Valid attribute names are: type, content, uploaded, editor
 * @param {string} filename name of the file
 * @param {Object} values object containing the new values for each attribute
 */
var update_item = function(filename, values) {
    if (files.hasOwnProperty(filename)) {
        $.each(values, function(key, val) {
            files[filename][key] = val;
        });
    }
};

/**
 * If present, returns all attributes of a specific file.
 * @param {string} filename name of the file
 * @returns {Object} the corresponding file object or null if not found
 */
var get_item = function(filename) {
    if (files.hasOwnProperty(filename))
        return files[filename];
    return null;
};

/**
 * Exports all files.
 * @returns {Object} all current files
 */
var get_items = function() {
    return files;
}

/**
 * Returns to an empty state. UNUSED
 */
var reset = function() {
    files = {};
};

export {
    add_item,
    get_items,
    remove_item,
    update_item,
    get_item,
    reset
};
