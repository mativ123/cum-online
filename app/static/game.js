var point = 0;

var upgrades = {
    click1: {
        n: 0,
        per: 1,
        baseprice: 10,
        pricescale: 1.1,
        button: "click1",
    },

    click2: {
        n: 0,
        per: 100,
        baseprice: 100,
        pricescale: 1.1,
        button: "click2",
    },

    auto1: {
        n: 0,
        per: 1,
        baseprice: 100,
        pricescale: 1.2,
        button: "auto1",
    },

    auto2: {
        n: 0,
        per: 10,
        baseprice: 3000,
        pricescale: 1.5,
        button: "auto2",
    },
};
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
            point = json["points"];
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

setInterval(function update()
{
    document.getElementById("points").innerHTML = `Cum[mL]: ${Math.floor(point)}`;
}, 10);

setInterval(function auto(){
    fetch("/api/auto", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
    })
}, 1000);

function save()
{
    console.log('din mor');
    fetch("/api/save", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
    })
}
