var point = 10000;

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

var clickList = [upgrades.click1, upgrades.click2];
var autoList = [upgrades.auto1, upgrades.auto2];

const calcPrice = (upgrade) => upgrade.baseprice * Math.pow(upgrade.pricescale, upgrade.n);

function calcPer(obj)
{
    var res = 0;
    for(var i = 0; i<obj.length; i += 1)
    {
        res += obj[i].n * obj[i].per;
    }
    return res;
}

function upClick(clicked)
{
    if(point >= calcPrice(clicked))
    {
        point -= calcPrice(clicked);
        clicked.n += 1;
        document.getElementById("perclick").innerHTML = `Per click: ${calcPer(clickList) + 1}`;
        document.getElementById(clicked.button).innerHTML = `upgrade: per click stat - price: ${Math.floor(calcPrice(clicked))}`;
    } else
    {
        document.getElementById('error').innerHTML = "Error:you dont have enough for that"
        setTimeout(() => {document.getElementById('error').innerHTML = ""}, 3000);
    }
}

function upAuto(clicked)
{
    if(point >= calcPrice(clicked))
    {
        point -= calcPrice(clicked);
        clicked.n += 1;
        document.getElementById("prSecond").innerHTML = `Per second: ${calcPer(autoList)}`;
        document.getElementById(clicked.button).innerHTML = `upgrade: auto income - price: ${Math.floor(calcPrice(clicked))}`;
    } else
    {
        document.getElementById('error').innerHTML = "Error:you dont have enough for that"
        setTimeout(() => {document.getElementById('error').innerHTML = ""}, 3000);
    }
}

function main()
{
    point += calcPer(clickList) + 1;
    document.getElementById("points").innerHTML = `Points: ${Math.floor(point)}`;
}

function upgrade(n)
{
    switch(n)
    {
        case 0:
            upClick(upgrades.click1);
            break;
        case 1:
            upClick(upgrades.click2);
            break;
        case 2:
            upAuto(upgrades.auto1);
            break;
        case 3:
            upAuto(upgrades.auto2);
            break;
        default:
            console.log('not cock');
            break;
    }
}

setInterval(function update()
{
    point += calcPer(autoList) / 100;
    document.getElementById("points").innerHTML = `Cum[mL]: ${Math.floor(point)}`;
}, 10);
