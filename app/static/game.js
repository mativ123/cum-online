async function httpGetAsync(daurl)
{
    const response = await fetch(daurl);
    if(response.ok)
    {
        return await response.json();
    }
}

function updateData()
{
    fetch("/api/update").then((res) => {
        res.json().then((json) => {
            document.getElementById("points").innerHTML = `Cum[mL]: ${Math.floor(json["points"])}`;
            document.getElementById("click1").innerHTML = `upgrade: per click stat - price: ${Math.floor(json["click1p"])}`;
            document.getElementById("click2").innerHTML = `upgrade: per click stat - price: ${Math.floor(json["click2p"])}`;
            document.getElementById("auto1").innerHTML = `upgrade: auto income - price: ${Math.floor(json["auto1p"])}`;
            document.getElementById("auto2").innerHTML = `upgrade: auto income - price: ${Math.floor(json["auto2p"])}`;
            document.getElementById("perclick").innerHTML = `Per click: ${json["perClick"]}`;
            document.getElementById("prSecond").innerHTML = `Per second: ${json["perSecond"]}`;
        });
    });

    setTimeout(updateData, 10);
}

updateData()

function main()
{
    fetch('/api/click', {
        method:  "POST",
        headers: {"Content-Type": "application/json"},
    })
}

function upgrade(n)
{
    fetch('/api/upgrade', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"n": n}),
    })
}

setInterval(function auto(){
    fetch("/api/auto", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
    })
}, 1000);

setInterval(function save()
{
    console.log("save :)");
    fetch("/api/save", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
    })
}, 5000);