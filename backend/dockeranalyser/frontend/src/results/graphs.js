import * as config from './config'
import * as vutils from '../common/viewutils'
import * as model from '../common/model'
import * as view from './view'
import * as api from '../common/images_api'

var set_charts_attribute_list = function() {
    let select = $(config.selectors.chart_attributes_select);
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
    select.change(function(event) {
        let val = select.val();
        let type = attributes[val];
        if (type != "number") {
            $("#option_approx_ranges").hide();
            $("#select_approx").val("others");
        } else
            $("#option_approx_ranges").show();
    });
};

// Aggiunge un grafico
var show_graph = function(type, attribute, approx, is_open) {
    api.get_stats(attribute, function(min, max, avg, output) {
        let id = "graph_container_" + attribute +  "_" + type + "_" + approx;
        let card = view.results.get_chart_card(id, type, attribute, approx, is_open);
        $(config.selectors.graph_container).append(card);
        view.charts.chart(type, "#"+id, output, attribute, approx);
        vutils.fix_height(config.vars.step);
    });
};

var refresh = function() {
    $(config.selectors.graph_container).empty();
    $.each(model.get_charts(), function(idx, item) {
        show_graph(item.type, item.attribute, item.approx, item.open);
    });
}

var init = function(container) {
    view.charts.setup_charts_form(show_graph);
};

export {
    init,
    refresh,
    set_charts_attribute_list
}
