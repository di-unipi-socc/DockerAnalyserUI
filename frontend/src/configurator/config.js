var form_fields = [{
    "name": "crawler",
    "title": "Crawler",
    "items": [
        {
            "name": "si",
            "label": "Sample Images",
            "help": "Total number of images to crawl",
            "type": "number",
            "default": 50
        }, {
            "name": "fp",
            "label": "From Page",
            "help": "Start crawling form this page",
            "type": "number",
            "default": 1
        }, {
            "name": "ps",
            "label": "Page Size",
            "help": "Consider pages like having this size",
            "type": "number",
            "default": 100
        }, {
            "name": "random",
            "label": "Method",
            "help": "Crawl images randomly or sequentially",
            "type": "radio",
            "default": "False",
            "values": [{
                "value": "False", 
                "label": "Random"
            }, {
                "value": "True",
                "label": "Sequential"
            }]
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
            "help": "The minimum number of stars that an image must have",
            "type": "number",
            "default": 3
        }, {
            "name": "min-pulls",
            "label": "Minimum Pulls",
            "help": "The minimum number of pulls that an image must have",
            "type": "number",
            "default": 0
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
    ]}, {
    "name": "scanner",
    "title": "Scanner",
    "items": [
        {
            "name": "replicas",
            "label": "Replicas",
            "help": "Number of parallel scanners to run",
            "type": "number",
            "default": 5
        }
    ]},
]

var selectors = {
    config_form: "#config_form"
}

export {
    form_fields,
    selectors
}