
var vars = {
    action_btn_class: "btn btn-sm action_button",
    uploaded_editing_class: "uploaded_editing",
    base_zip_name: "deploy-package-",
    page_size: 50,
    concurrent_calls: 10,
    max_chart_groups: 5,
    not_acceped_fields: [null, undefined, "undefined", "null", "array", "date_string"],
};

var selectors = {
    endpoint_modal_id: "#endpoint_modal",
    endpoint_url_input: "#endpoint_url",
    endpoint_form: "#set_endpoint_form",
    results_container: "#results_container",
    results_not_ready: "#results_not_ready",
    results_list: "results_list",
    results_list_id: "#results_list",
    num_images_id: "#num_images",
    endpoint_set_button: "#set_endpoint",
    custom_search_form: "#custom_search",
    custom_search_form_select: "#custom_search_select",
    custom_search_form_subfield: "#custom_search_subfield",
    custom_search_form_all: "#custom_search_all",
    custom_search_form_free: "#custom_search_free",
    custom_search_form_free_input: "#add_custom_input",
    custom_search_form_clear: "#custom_search_clear",
    results_search_form: "#results_search",
    add_chart_form: "#add_chart",
    export_menu: ".export-dropdown-menu",
    error_container: ".error-container",
    confirm_modal_id: "#confirm_modal",
    confirm_msg_id: "#confirm_msg",
    confirm_button_id: "#confirm_button",
};

/*var selectors = {
    endpoint_modal_id: "#endpoint_modal",
    endpoint_url_input: "#endpoint_url",
    endpoint_form: "#set_endpoint_form",
    results_container: "#results_container",
    results_list: "results_list",
    results_list_id: "#results_list",
    num_images_id: "#num_images",
    endpoint_set_button: "#set_endpoint",
    refresh_button: "#refresh",
    custom_search_form: "custom_search",
    custom_search_form_select: "custom_search_select",
    custom_search_form_add: "custom_search_add",
    custom_search_form_add_all: "custom_search_add_all",
    results_search_form: "results_search",
    results_search_form_id: "#results_search",
    results_search_button: "results_search_button",
    add_chart_form: "#add_chart",
    export_menu: ".export-dropdown-menu",
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
};*/

var urls = {
    images: "http://neri.di.unipi.it:4000/api/images",  // "http://127.0.0.1:8000/suggestions/images",
    stats: "http://neri.di.unipi.it:4000/stats/",
    search: "http://neri.di.unipi.it:4000/search/",  // https://github.com/di-unipi-socc/DockerAnalyser/blob/master/storage/README.md
    compose: {
        build: "http://127.0.0.1:8000/compose/build", 
        up: "http://127.0.0.1:8000/compose/up",
        stop: "http://127.0.0.1:8000/compose/stop"
    }
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

var graphs = {
    attributes: {
        label: "Attribute",
        options: [],
    },
    types: {
        label: "Type",
        options: [
            {value: "bar", label: "Bar"}, 
            {value: "horizontalBar", label: "Horizontal Bar"}, 
            {value: "pie", label: "Pie"}, 
            {value: "doughnut", label: "Doughnut"}, 
        ]
    }, 
    approx: {
        label: "Approximation",
        options: [
            {value: "ranges", label: "Ranges"}, 
            {value: "others", label: "Others"}, 
        ]
    }
}

export {
    vars,
    selectors,
    urls,
    msgs,
    graphs
}