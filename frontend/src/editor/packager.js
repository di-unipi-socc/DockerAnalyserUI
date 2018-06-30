import * as config from './config'
import * as utilities from './utilities'
import * as model from '../common/model'
import * as vutils from '../common/viewutils'
import * as modal from '../common/modals'
import * as view from './view'
import * as editor from './editor'
import * as uploader from './uploader'
import * as requirements from './requirements'

var JSZip = require("jszip");
var FileSaver = require('file-saver');

var module_basename = "package";
var actions = [{
        name: "import",
        title: "Upload Package",
        icon: "upload",
        style: "info",
        modal: config.selectors.uploads_modal,
        action: function() {
            $("#"+config.selectors.upload_form).hide();
            $("#"+config.selectors.upload_package_form).show();
        },
    }, {
        name: "export",
        title: "Export Package",
        icon: "download",
        style: "info",
        modal: config.selectors.export_modal,
        action: null,
    }, {
        name: "reset",
        title: "Reset Work Area",
        icon: "trash-alt",
        style: "danger",
        modal: null,
        action: function() {
            view.confirm(config.msgs.confirm_reset, reset);
        },
    }
];

/**
 * Checks if the analysis.py source code is valid. 
 * @param {string} content the python source code
 * @returns {boolean} true if code is valid, false otherwise
 */
var validate = function(content, callback) {
    /*let def_idx = content.indexOf("def analysis");
    if (def_idx < 0)
        return false;
    return true;*/
    $.getJSON(config.urls.code_validate, {"code": JSON.stringify(content)})
        .done(function(data) {
            var errors = data.errors;
            if (errors.length > 0) {
                let full_error_msg = errors.join("<br>");
                errors.push(full_error_msg);
                modal.error(config.selectors.export_modal, config.msgs.error_validation);
            } else {
                callback();
            }
        })
        .fail(function() {
            modal.error(config.selectors.export_modal, config.msgs.error_server);
        });
};

/**
 * Returns to the initial state.
 */
var reset = function() {
    uploader.reset();
    requirements.reset();
    editor.init();
};

/**
 * Creates a zip with all files.
 */
var create_zip = function(callback) {
    let zip = new JSZip();
    let zip_name = config.vars.base_zip_name + utilities.normalise($("#"+config.selectors.export_name).val());
    let folder = zip.folder(zip_name);
    let files = model.get_items();
    let error = false;
    let analysis_content;
    $.each(files, function(key, values){
        let file_content = values.content;
        if (values.editor)
            file_content = values.editor.getValue();
        let options = {};
        if (!values.type.match('text.*'))
            options["binary"] = true;
        folder.file(key, file_content, options);
        if (key == config.analysis_file.name)
            analysis_content = file_content;
    });
    validate(analysis_content, function(){
        zip.generateAsync({type: "blob"}).then(function(content) {
            callback(content, zip_name);
        });
    });
};

/**
 * Exports all files in a .zip file.
 */
var export_zip = function() {
    create_zip(function(content, zip_name) {
        FileSaver.saveAs(content, zip_name+".zip");
    });
};

/**
 * Resets the work area and uploads a full package provided in a .zip file.
 */
var upload_package = function() {
    var uploaded_files = $("#"+config.selectors.upload_package_input).prop("files");  // FileList object
    var uploaded_file = uploaded_files[0];

    // Package validation: it must be a .zip file
    var zip_type = uploaded_file.type;
    if (zip_type != "application/zip") {
        moda.error(config.selectors.uploads_modal, config.msgs.error_wrong_type);
        return;
    }
    var zipname = uploaded_file.name; 
    var reader = new FileReader();

    reader.onload = (function(current_file) {
        return function(event) {
            reset();
            let file_content = event.target.result;
            // Apertura zip e lettura contenuto
            var new_zip = new JSZip();
            new_zip.loadAsync(file_content)
                .then(function(zip) {
                    zip.forEach(function (relativePath, file){
                        if (!file.dir) {
                            let filename = utilities.get_filename(relativePath);
                            let file_type = utilities.get_filetype(filename);
                            if (utilities.is_editable(file_type)) {
                                file.async("string").then(function(content) {
                                    uploader.add_uploaded_file(filename, file_type, content, true, true);
                                });
                            } else {
                                file.async("binarystring").then(function(content) {
                                    uploader.add_uploaded_file(filename, file_type, content, false, true);
                                });
                            }
                        }
                    });                            
                });
        };
    })(uploaded_file);
    reader.readAsBinaryString(uploaded_file);
};

/**
 * Initialises the package manager.
 */
var init = function() {
    view.packager.setup_export_modal();
    vutils.setup_action_buttons(module_basename, actions);

    $("#"+config.selectors.export_form).submit(function(event) {
        event.preventDefault();
        requirements.generate_file();
        export_zip();
    });

    $("#"+config.selectors.upload_package_form).submit(function(event) {
        event.preventDefault();
        view.confirm(config.msgs.confirm_upload_zip, upload_package, null);
    });

    view.setup_confirm_modal();
};

export {
    init
};
