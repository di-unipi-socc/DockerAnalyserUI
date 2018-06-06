
var vars = {
    action_btn_class: "btn btn-sm action_button",
    uploaded_editing_class: "uploaded_editing",
    base_zip_name: "deploy-package-",
}

var selectors = {
    endpoint_modal_id: "#endpoint_modal",
    endpoint_url_input: "#endpoint_url",
    endpoint_form: "#set_endpoint_form",
    results_container: "#results_container",
    results_list: "#results_list",
    num_images_id: "#num_images",
    endpoint_set_button: "#set_endpoint",
    upload_package_id: "#upload_package_form",
    uploaded_show_list: "#upload_edit",
    uploaded_list_len: "#uploads_length",
    req_add_form_id: "#add_requirement_form",
    req_container_id: "#requirements_list",
    req_search_results_id: "#requirements_search_results",
    req_modal_id: "#requirements_modal",
    req_show_list: "#requirements_edit",
    req_list_len: "#requirements_length",
    export_name: "#export_title",
    export_form_id: "#export_form",
    error_container: ".error-container",
    confirm_modal_id: "#confirm_modal",
    confirm_msg_id: "#confirm_msg",
    confirm_button_id: "#confirm_button",
};

var urls = {
    images: "http://127.0.0.1:8000/suggestions/images",
};

var msgs = {
    error_generic: "An error occurred",
    error_no_results: "No results found",
    error_file_exists: "File Exists",
    error_wrong_type: "Wrong File Type",
    error_req_not_found: "Libraries not found: ",
    error_validation: "Validation Error. Please check your analysis.py. code",
    confirm_upload_zip: "Be aware that uploading a new package you will overwrite your current work!",
    confirm_remove_file: "You modified this file, if you remove it your work will be lost!",
    confirm_clear_requirements: "All inserted requirements will be removed!",
    confirm_clear_uploads: "All uploaded files will be removed",
    confirm_reset: "All your current work will be lost!",
};

export {
    vars,
    selectors,
    urls,
    msgs
}