var $ = require("jquery");

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

var ace = require('ace-builds/src-noconflict/ace');
require('ace-builds/src-noconflict/ext-language_tools');
require("ace-builds/src-noconflict/mode-plain_text");
require("ace-builds/src-noconflict/mode-python");
require("ace-builds/src-noconflict/mode-javascript");
require("ace-builds/src-noconflict/mode-markdown");
require("ace-builds/src-noconflict/mode-html");
require("ace-builds/src-noconflict/mode-css");
require("ace-builds/src-noconflict/mode-sh");

/*$.each(config.languages, function(key, val) {
    let mode = "ace-builds/src-noconflict/mode-"+val;
    require(mode);
});*/

import './style.scss';

import * as config from './config'
import * as utilities from './utilities'
import * as model from './model'
import * as view from './view'
import * as uploader from './uploader'
import * as requirements from './requirements'
import * as editor from './editor'
import * as packager from './packager'

console.log("main");
$(document).ready(function () {
    console.log("main ready");
    
    // Inizializzazione
    editor.init();
    uploader.init();
    requirements.init();
    packager.init();

    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    // Gestione loading
    $(document).on({
        ajaxStart: function() { $("body").addClass("loading"); },
        ajaxStop: function() { $("body").removeClass("loading"); }    
    });

});
