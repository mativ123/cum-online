var point = 10000;
var upgradeExtra = 1;
var upg1cost = 10;
var upg2cost = 100;
var upg3cost = 3000;
var autopoint = 0;
var smooth = 0;

function main()
{
    document.getElementById("perclick").innerHTML = "Per click " + upgradeExtra;
    point += upgradeExtra;
    document.getElementById("points").innerHTML = "Points: " + Math.floor(point); 
    document.getElementById("upgrade1").innerHTML = "upgrade: per click stat - price: " + Math.floor(upg1cost)

}


function upgrade()
{
    if (point >= upg1cost)
    {
    upgradeExtra = upgradeExtra + 1;
    point = point - upg1cost
    upg1cost *= 1.1
    document.getElementById("points").innerHTML = "Points: " + Math.floor(point); 
    document.getElementById("perclick").innerHTML = "Per click " + Math.floor(upgradeExtra);
    document.getElementById("upgrade1").innerHTML = "upgrade: per click stat - price: " + Math.floor(upg1cost)
    }else{
        document.getElementById('error').innerHTML = "Error:you dont have enough for that"
        setTimeout(() => {document.getElementById('error').innerHTML = ""}, 3000);

    }
    
}


function autoupgrade()
{
    if (point >= upg2cost){
    point = point - upg2cost;
    autopoint += 1;
    upg2cost *= 1.2;
    document.getElementById("upgrade2").innerHTML = "upgrade: auto income - price: " + Math.floor(upg2cost);
    update();
    }else{
        document.getElementById('error').innerHTML = "Error: you dont have enough for that"
        setTimeout(() => {document.getElementById('error').innerHTML = ""}, 3000);
    }
    
}

function aUpgrade2()
{
    if (point >= upg3cost){
        point = point - upg3cost;
        autopoint += 10;
        upg3cost *= 1.5;
        document.getElementById("upgrade3").innerHTML = "upgrade: better auto income - price: " + Math.floor(upg3cost);
        update();
        }else{
            document.getElementById('error').innerHTML = "Error: you dont have enough for that"
            setTimeout(() => {document.getElementById('error').innerHTML = ""}, 3000);
        }
}

setInterval(function update()
{
        console.log("Du burde få 1 per sekund")
        console.log(smooth= autopoint / 100)
        console.log(point = point + smooth)
        document.getElementById("points").innerHTML = "Points: " + Math.floor(point); 
        document.getElementById("prSecond").innerHTML = "Per second: " + autopoint;
       
}, 10);
