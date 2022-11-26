var point = 0;
var upgradeExtra = 1;
var upg1cost = 10;
var upg2cost = 100;
var upg3cost = 3000;
var autopoint = 0;
var smooth = 0;
var ekstraclick = 1
var bonus1 = new Boolean(false);

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

        console.log("ekstraclick:" + ekstraclick)
        upgradeExtra += ekstraclick;
        point -= upg1cost
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
    point -= upg2cost;
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
        point -= upg3cost;
        autopoint += 10;
        upg3cost *= 1.5;
        document.getElementById("upgrade3").innerHTML = "upgrade: better auto income - price: " + Math.floor(upg3cost);
        update();
        }else{
            document.getElementById('error').innerHTML = "Error: you dont have enough for that"
            setTimeout(() => {document.getElementById('error').innerHTML = ""}, 3000);
        }
}

function aUpgrade3()
{
    if (point >= upg4cost){
        point -= upg4cost;
        autopoint += 100;
        upg4cost *= 1.4;
        document.getElementById("upgrade4").innerHTML = "upgrade: better auto income - price: " + Math.floor(upg4cost);
        update();
        }else{
            document.getElementById('error').innerHTML = "Error: you dont have enough for that"
            setTimeout(() => {document.getElementById('error').innerHTML = ""}, 3000);
        }
}

function doubleclick()
{
    if(point >= 550){
    document.getElementById("bonus1").remove();
    ekstraclick *= 2
    upgradeExtra *= 2
    point -= 550
    document.getElementById("points").innerHTML = "Points: " + Math.floor(point); 
    document.getElementById("perclick").innerHTML = "Per click " + Math.floor(upgradeExtra);
    }else {
        document.getElementById('error').innerHTML = "Error: you dont have enough for that"
        setTimeout(() => {document.getElementById('error').innerHTML = ""}, 3000);
    }
}

setInterval(function update()
{
        smooth = autopoint / 100
        point += smooth
        document.getElementById("points").innerHTML = "Points: " + Math.floor(point); 
        document.getElementById("prSecond").innerHTML = "Per second: " + Math.floor(autopoint);
       
}, 10);
