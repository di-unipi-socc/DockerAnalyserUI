var $ = require("jquery");

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './style.scss';

import * as config from './config'
import * as utilities from './utilities'
import * as model from './model'
import * as view from './view'
import * as results from './results'

console.log("main");
$(document).ready(function () {
    console.log("main ready");

    results.init();

    // Gestione loading
    $(document).on({
        ajaxStart: function() { $("body").addClass("loading"); },
        ajaxStop: function() { $("body").removeClass("loading"); }    
    });

});
