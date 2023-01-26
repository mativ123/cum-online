function cum() {
    fetch('/cum', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"n": 1}),
    })
        .then((res) => res.json())
        .then((data) => {
            document.getElementById("points").innerHTML = data["n"];
        });
}
