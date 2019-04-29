function createModal2() {
    let modal = document.createElement("div");
    modal.id = "modal";
    document.body.style.overflow = "hidden";
    document.body.prepend(modal);
    modal.innerHTML = `
    <button class="btn btn-lg btn-warning" id="backbtn2" onclick="removeCover()">Back</button>`;
}

function graphs() {
    createModal2();
    let chartcontainer = document.createElement("div");
    chartcontainer.id = "chartContainer";
    chartcontainer.style.width="100%";
    document.getElementById("modal").appendChild(chartcontainer);
    let freezebtn=document.createElement("button");
    freezebtn.setAttribute("class","btn btn-lg btn-info");
    freezebtn.innerText="Freeze Automatic Update";
    freezebtn.id="freezebtn";
    document.getElementById("modal").prepend(freezebtn);
    freezebtn.onclick=stopIt;
    
    let selectedarray = $("div[selected]");
    let dataPoints = [];
    let temp = [];
    let coinNameArray = [];
    let valueArray = [];
    let graphArray0=[]
    let graphArray1=[]
    let graphArray2=[]
    let graphArray3=[]
    let graphArray4=[]
    let queriesString = "";

    for (let i = 0; i < selectedarray.length; i++) {
        temp[i] = selectedarray[i].childNodes[0].innerText;
        queriesString += temp[i];
        queriesString += ",";
    }
    queriesString = queriesString.substring(0, queriesString.length - 1);
    queriesString = queriesString.toUpperCase();

    stop=setInterval(populateGraph,2000);
    


    function populateGraph() {
        $.ajax({
            url: "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + queriesString + "&tsyms=USD",
            type: 'GET',
            success: function (res) {
                if (res.Message==="fsyms param is empty or null."){
                    alert("You haven't picked any coins.")
                    document.getElementById("backbtn2").click();
                    return;
                }
                else if (res.Response === "Error") {
                    alert("The coin you've picked has no value data in the API's database");
                    document.getElementById("backbtn2").click();
                    let toRemove=$("[selected=selected]")[0];
                    toRemove.removeAttribute("selected");
                    toRemove.lastChild.click();
                    coincounter--;
                    return;
                }
                
                //create an array of selected coins and their value in $, each coin in a sub array of its own;
                //value 0 of sub array is name of selected coin
                //value 1 of sub array is the conversion value in $;
                dataPoints = Object.keys(res).map((key) => [key, res[key]]);
                
                
                for (let i = 0; i < dataPoints.length; i++) {
                    coinNameArray[i] = dataPoints[i][0];
                    valueArray[i] = dataPoints[i][1].USD;
                }
                graphArray0.push({
                    y:valueArray[0],
                    name: coinNameArray[0]
                })

                graphArray1.push({
                    y:valueArray[1],
                    name: coinNameArray[1]
                })

                graphArray2.push({
                    y:valueArray[2],
                    name: coinNameArray[2]
                })

                graphArray3.push({
                    y:valueArray[3],
                    name: coinNameArray[3]
                })

                graphArray4.push({
                    y:valueArray[4],
                    name: coinNameArray[4]
                })
            }
        });
        //actually draw the graphs
        let chart = new CanvasJS.Chart("chartContainer", {
            theme: "dark2", // "light2", "dark1", "dark2"
            animationEnabled: true, // change to true		
            title: {
                text: queriesString + " to USD"
            },
            axisX: {
                title: "Time",
                titleFontSize: 24,

            },
            axisY: {
                title: "Coin Value",
                titleFontSize: 24,
                prefix: "$"
            },
            toolTip:{
                content: "{name}: {y}"
            },
            data: [{
                // Change type to "bar", "area", "spline", "pie",etc.
                type: "line",
                dataPoints: graphArray0,
                name: graphArray0.name,
                
            },
            {
                type: "line",
                dataPoints: graphArray1,
                name: graphArray1.name,
              
            },
            {
                type: "line",
                dataPoints: graphArray2,
                name: graphArray2.name,
                
            },
            {
                type: "line",
                dataPoints: graphArray3,
                name: graphArray3.name,
                
            },
            {
                type: "line",
                dataPoints: graphArray4,
                name: graphArray4.name,
                
            },

        ]
        });
        chart.render();
    }
}