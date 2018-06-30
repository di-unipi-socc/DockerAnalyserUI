var vars = {
    step: 2,
    step_id: "manage",
}

var selectors = {
}

var urls = {
    compose: {
        build: "http://127.0.0.1:8000/compose/build", 
        config: "http://127.0.0.1:8000/compose/config",
        up: "http://127.0.0.1:8000/compose/up",
        stop: "http://127.0.0.1:8000/compose/stop",
        status: "http://127.0.0.1:8000/compose/status"
    }
};

export {
    vars,
    selectors,
    urls
}