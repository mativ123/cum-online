function cum(i) {
    fetch('/', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"n": i + 1}),
    });
}
