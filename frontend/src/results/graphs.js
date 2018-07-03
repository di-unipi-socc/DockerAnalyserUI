import * as config from './config'
import * as utilities from './utilities'
import * as vutils from '../common/viewutils'
import * as model from '../common/model'
import * as view from './view'
import * as api from './api'

var setup_charts_form = function() {
    let form = $(config.selectors.add_chart_form);
    //let form = $("<fieldset />").attr("class", "form-group");
    //let legend = $("<legend />").html("CHART BUILDER");
    //form.append(legend);
    $.each(config.graphs, function(key, vals) {
        let id = "select_" + key;
        let select = $("<select />").attr({"name": id, "id": id, "class": "custom-select", "required": "required"});
        let option = $("<option />").attr({"value": ""}).html(vals.label+":");
        select.append(option);
        $.each(vals.options, function(idx, val) {
            option = $("<option />").attr({"value": val.value}).html(val.label);
            select.append(option);
        });
        form.append(select);
    });
    let input = $("<input />").attr({"type": "submit", "class": "btn btn-info", "value": "Create"});
    form.append(input);
    //form_container.append(form);
    form.submit(function(event) {
        event.preventDefault();
        // Inserire validazione?
        show_graph($("#select_types").val(), $("#select_attributes").val(), $("#select_approx").val());
    });
};

var set_charts_attribute_list = function() {
    let select = $("#select_attributes");
    let attribute_names = model.get_attribute_names();
    let attributes = model.get_attributes();
    attribute_names.sort();
    $.each(attribute_names, function(idx, val) {
        let type = attributes[val];
        if (type == "object" || type == "array")
            return true;  // continue; per ora escludiamo array e oggetti
        let option = $("<option />").attr({"value": val}).html(val);
        select.append(option);
    });
};

// Aggiunge un grafico
var show_graph = function(type, attribute, approx) {
    api.get_stats(attribute, function(min, max, avg, output) {
        let id = "graph_container_" + attribute + "_" + approx;
        let card = view.results.get_chart_card(id, type, attribute, approx);
        $("#graph_container").append(card);
        view.charts.chart(type, "#"+id, output, attribute, approx);
        vutils.fix_height(config.vars.step);
    });
};

var init = function(container) {
    setup_charts_form();
};

export {
    init,
    set_charts_attribute_list
}
