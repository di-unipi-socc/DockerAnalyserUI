var form_fields = [{
    "name": "crawler",
    "title": "Crawling Options",
    "items": [
        {
            "name": "si",
            "label": "Sample Images",
            "placeholder": "All",
            "help": "Total number of images to crawl",
            "type": "number",
            "default": null
        }, {
            "name": "fp",
            "label": "From Page",
            "placeholder": "From Page",
            "help": "Start crawling form this page",
            "type": "number",
            "default": 1
        }, {
            "name": "ps",
            "label": "Page Size",
            "placeholder": "Page Size",
            "help": "Consider pages like having this size",
            "type": "number",
            "default": 100
        }, {
            "name": "policy",
            "label": "Policy",
            "help": "Start from images with a higher number of stars or pulls",
            "type": "radio",
            "default": "stars_first",
            "values": [{
                "value": "stars_first", 
                "label": "Stars First"
            }, {
                "value": "pulls_first",
                "label": "Pulls First"
            }]
        }, {
            "name": "min-stars",
            "label": "Minimum Stars",
            "placeholder": "Minimum Stars",
            "help": "The minimum number of stars that an image must have",
            "type": "number",
            "default": 0
        }, {
            "name": "min-pulls",
            "label": "Minimum Pulls",
            "placeholder": "Minimum Pulls",
            "help": "The minimum number of pulls that an image must have",
            "type": "number",
            "default": 0
        }, {
            "name": "random",
            "label": "Random",
            "help": "Crawl images randomly instead of sequentially",
            "type": "checkbox",
            "default": false
        }, {
            "name": "only-official",  // Valid if set
            "label": "Only Official",
            "help": "Crawl only the official images",
            "type": "checkbox",
            "default": false
        }, {
            "name": "only-automated",  // Valid if set
            "label": "Only Automated",
            "help": "Crawl only images automatically created from a GitHub repository",
            "type": "checkbox",
            "default": false
        }, 
    ]}, 
    /*{
    "name": "scanner",
    "title": "Scanner Configuration",
    "items": [
        {
            "name": "replicas",
            "label": "Replicas",
            "help": "Number of parallel scanners to run",
            "type": "number",
            "default": 5
        }
    ]}, */
]


var vars = {
    step: 1,
    step_id: "config",
}

var selectors = {
    config_form: "#config_form"
}

export {
    form_fields,
    vars,
    selectors
}