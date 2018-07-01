import * as config from './config'
import * as modal from '../common/modals'
import * as vutils from '../common/viewutils'
import * as forms from '../common/forms'

var show_error = function(msg) {
    vutils.show_error(msg, config.vars.step_id);
}

var status = {
    setup_icons: function(services, start, stop) {
        let container = $(config.selectors.status_icons);
        container.empty();
        let all_started = true;
        let all_stopped = true;
        $.each(services, function(idx, item) {
            let div = $("<div />").attr("class", "service_container");
            let display = $("<div />").attr("class", "service_display rounded");
            let details = $("<div />").attr("class", "service_details");
            let name = $("<div />").attr("class", "service_name").html(item.service);
            let action = $("<div />").attr("class", "service_action");
            let icon_play = $("<i />").attr("class", "fas fa-play service_start");
            let icon_stop = $("<i />").attr("class", "fas fa-stop service_stop");
            if (item.is_running) {
                all_stopped = false;
                div.addClass("service_up");
                display.addClass("btn btn-outline-success");
            } else {
                all_started = false;
                div.addClass("service_down");
                display.addClass("btn btn-outline-danger");
            }
            let icon_info = $("<i />").attr("class", "fas fa-info service_info");
            display.click(function() {
                status.show_status_details(item);
            })
            icon_play.click(function() {
                start(item.service);
            });
            icon_stop.click(function() {
                stop(item.service);
            });
            action.append(icon_info);
            details.append(icon_play);
            details.append(icon_stop);
            display.append(name);
            display.append(action);
            //details.append(icon_info);
            div.append(display);
            div.append(details);
            container.append(div);
            // If all are running, there's no point in using the start button
            if (all_started)
                $("#manage_start").addClass("disabled");
            else
                $("#manage_start").removeClass("disabled");
            // If all are stopped, there's no point in using the stop button
            if (all_stopped) {
                $("#manage_stop").addClass("disabled");
                $("#manage_scale").addClass("disabled");
            } else {
                $("#manage_stop").removeClass("disabled");
                $("#manage_scale").removeClass("disabled");
            }
        });
    },
    show_status_details: function(service) {
        $("#"+config.selectors.service_detail_div).empty();
        $("#"+config.selectors.service_detail_div).append(vutils.display_object(service, 0));
        modal.show(config.selectors.service_detail_modal);
    },
    setup_service_modal: function() {
        let body = modal.setup(config.selectors.service_detail_modal, "Service Details", null, null, true);
        let div = $("<div />").attr({"id": config.selectors.service_detail_div});
        body.append(div);
    }
}

var manage = {
    setup_scale_modal: function() {
        let body = modal.setup(config.selectors.scale_modal, "Scale Scanners", null, null, false);
        let form = forms.get_form(config.selectors.scale_form, true);
        let input = forms.get_input.text(config.selectors.scale_amount, "Number of Scanners", true);
        input.val(config.vars.scale_default);
        let submit = forms.get_button.submit(config.selectors.scale_form + "_button", "Scale");
        form.append(input);
        form.append(submit);
        body.append(form);
    },
}

export {
    show_error,
    status,
    manage
}