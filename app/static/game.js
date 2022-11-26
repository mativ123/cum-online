var point = 10000;

var upgrades = {
    click1: {
        n: 0,
        per: 1,
        baseprice: 10,
        pricescale: 1.1,
    },

    click2: {
        n: 0,
        per: 100,
        baseprice: 100,
        pricescale: 1.1,
    },

    auto1: {
        n: 0,
        per: 1,
        baseprice: 100,
        pricescale: 1.2,
    },

    auto2: {
        n: 0,
        per: 10,
        baseprice: 3000,
        pricescale: 1.5,
    },
};

var clickList = [upgrades.click1, upgrades.click2];
var autoList = [upgrades.auto1, upgrades.auto2];

const calcPrice = (upgrade) => upgrade.baseprice * Math.pow(upgrade.pricescale, upgrade.n);
const calcPer = (obj) => {
    var res = 0;
    for(var i = 0; i<obj.length; i += 1)
    {
        res += obj[i].n * obj[i].per;
    }
    return res;
};

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
            current = upgrades.click1;
            if(point >= calcPrice(current))
            {
                point -= calcPrice(current);
                current.n += 1;
                document.getElementById("perclick").innerHTML = `Per click: ${calcPer(clickList) + 1}`;
                document.getElementById("click1").innerHTML = `upgrade: per click stat - price: ${Math.floor(calcPrice(current))}`;
            } else
            {
                document.getElementById('error').innerHTML = "Error:you dont have enough for that"
                setTimeout(() => {document.getElementById('error').innerHTML = ""}, 3000);
            }
            break;
        case 1:
            current = upgrades.click2;
            if(point >= calcPrice(current))
            {
                point -= calcPrice(current);
                current.n += 1;
                document.getElementById("perclick").innerHTML = `Per click: ${calcPer(clickList) + 1}`;
                document.getElementById("click2").innerHTML = `upgrade: per click stat - price: ${Math.floor(calcPrice(current))}`;
            } else
            {
                document.getElementById('error').innerHTML = "Error:you dont have enough for that"
                setTimeout(() => {document.getElementById('error').innerHTML = ""}, 3000);
            }
            break;
        case 2:
            current = upgrades.auto1;
            if(point >= calcPrice(current))
            {
                point -= calcPrice(current);
                current.n += 1;
                document.getElementById("prSecond").innerHTML = `Per second: ${calcPer(autoList)}`;
                document.getElementById("auto1").innerHTML = `upgrade: auto income - price: ${Math.floor(calcPrice(current))}`;
            } else
            {
                document.getElementById('error').innerHTML = "Error:you dont have enough for that"
                setTimeout(() => {document.getElementById('error').innerHTML = ""}, 3000);
            }
            break;
        case 3:
            current = upgrades.auto2;
            if(point >= calcPrice(current))
            {
                point -= calcPrice(current);
                current.n += 1;
                document.getElementById("prSecond").innerHTML = `Per second: ${calcPer(autoList)}`;
                document.getElementById("auto2").innerHTML = `upgrade: auto income - price: ${Math.floor(calcPrice(current))}`;
            } else
            {
                document.getElementById('error').innerHTML = "Error:you dont have enough for that"
                setTimeout(() => {document.getElementById('error').innerHTML = ""}, 3000);
            }
            break;
        default:
            console.log('not cock');
            break;
    }
}

setInterval(function update()
{
    point += calcPer(autoList) / 100;
    document.getElementById("points").innerHTML = `Points: ${Math.floor(point)}`;
}, 10);
