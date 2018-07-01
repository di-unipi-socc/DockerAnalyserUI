import * as config from './config'
import * as utilities from './utilities'
import * as model from '../common/model'
import * as settings from '../common/settings'
import * as view from './view'

var formats = [{
    name: "CSV",
    action: function() {
        alert("CSV Export");    
    },
}, {
    name: "JSON",
    action: function() {
        alert("JSON Export");    
    },
},{
    name: "XML",
    action: function() {
        alert("XML Export");    
    },
}];

// Cosa esporto? Le immagini che ho scaricato fino a questo momento?
// Possibilità di esportare solo determinati record? Ad esempio, solo i risultati della ricerca?
// Possibilità di esportare dati aggregati? Grafici?

// https://www.codevoila.com/post/30/export-json-data-to-downloadable-file-using-javascript

var to_json = function(data) {
    let dataStr = JSON.stringify(data);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    let exportFileDefaultName = 'data.json';
    
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function parseJSONToCSVStr(jsonData) {
    if(jsonData.length == 0) {
        return '';
    }
    
    let keys = Object.keys(jsonData[0]);
    
    let columnDelimiter = ',';
    let lineDelimiter = '\n';
    
    let csvColumnHeader = keys.join(columnDelimiter);
    let csvStr = csvColumnHeader + lineDelimiter;
    
    jsonData.forEach(item => {
        keys.forEach((key, index) => {
            if( (index > 0) && (index < keys.length-1) ) {
                csvStr += columnDelimiter;
            }
            csvStr += item[key];
        });
        csvStr += lineDelimiter;
    });

    return encodeURIComponent(csvStr);
}

function exportToCsvFile(jsonData) {
    let csvStr = parseJSONToCSVStr(jsonData);
    let dataUri = 'data:text/csv;charset=utf-8,'+ csvStr;
    
    let exportFileDefaultName = 'data.csv';
    
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

var init = function() {
    view.exporter.setup_formats(formats);
};

export {
    init,
    to_json
}
