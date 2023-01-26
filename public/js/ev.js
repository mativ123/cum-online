function cum() {
    fetch('/cum', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        // body: JSON.stringify({"n": 1}),
    })
        .then((res) => res.json())
        .then((data) => {
            document.getElementById("points").innerHTML = data["n"];
        });
}

function upgrade(n) {
    fetch('/upgrade', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"n": n})
    })
        .then((res) => res.json())
        .then((data) => {
            document.getElementById("points").innerHTML = data["n"];
        });
}
