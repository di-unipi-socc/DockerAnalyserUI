import * as config from './config'

/**
 * Normalises a string removing spaces and special characters.
 * @param {string} str the string you want to normalise
 * @returns {string} the normalised string
 */
export function normalise(str) {
    return str.replace(/[^a-z0-9_\-]/gi, "").toLowerCase();
}

/**
 * Made to be used by the sort function, compares two objects based on their upload_time filed.
 * This fileld should contain a timestamp in the form: "2000-01-01T00:00:00"
 * Objects are ordered from the newest to the oldest.
 * Usage example: versions.sort(version_compare)
 * @param {Object} a an object with and upload_time field
 * @param {Object} b an object with and upload_time field
 * @returns {number} depends on which one is older
 */
export function version_compare(a, b){
    if (a == null || b == null)
        return b;
    return Date.parse(b["upload_time"]) - Date.parse(a["upload_time"]);
}

/**
 * Extracts the file name, given its full path.
 * @param {string} path full path to the file
 * @returns {string} the file name
 */
export function get_filename(path) {
    let filename = path.split("/");
    if (filename.length > 1)
        filename = filename[filename.length-1];
    else
        filename = filename[0];
    return filename;
}
