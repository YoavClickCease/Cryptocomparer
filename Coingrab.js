function callAPIForAll() {
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/list",
        type: 'GET',
        success: function (res) {
            data = res;
            loadCoins();
        }
    });
}
/*
function CallAPIForOne() {
    searchterm = document.getElementById("searchTerm").value;
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/" + searchterm,
        type: 'GET',
        success: function (res) {
            data = res;
            var array = [];
            array.push(data);
            data = array;
            document.getElementById("searchTerm").value="";
            document.getElementById("searchTerm").focus();
            coincounter=0;
            return loadCoins();

        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText;
            alert('Error - ' + errorMessage);
        }
    })
}*/

function loadCoins() {
    document.getElementById("panel").innerHTML = "";
    let name;
    let symbol;
    for (i = 0; i < data.length; i++) {
        name = data[i].id;
        name = name.toUpperCase();
        symbol = data[i].symbol;
        symbol = symbol.toUpperCase();

        let coinCard = document.createElement("div");
        coinCard.id = "coinCard";
        let panel = document.getElementById("panel");
        panel.appendChild(coinCard);


        let nameArea = document.createElement("div");
        let symbolArea = document.createElement("div");

        coinCard.appendChild(symbolArea);
        symbolArea.id = "symbolArea";
        symbolArea.innerHTML = symbol;

        coinCard.appendChild(nameArea);
        coinCard.setAttribute("class", name);
        coinCard.setAttribute("name",symbol);
        nameArea.id = "nameArea";
        nameArea.innerText = name

        

        let moreInfo = document.createElement("button");
        moreInfo.setAttribute("class", "btn btn-lg btn-info")
        moreInfo.id = "moreInfo";
        moreInfo.innerText = "More Info";
        coinCard.appendChild(moreInfo);

        moreInfo.onclick = extrainfo;

        //creating the toggle button
        let toggleBTNLabel = document.createElement("label");
        toggleBTNLabel.setAttribute("class", "switch");

        let toggleBTN = document.createElement("input");
        toggleBTN.setAttribute("type", "checkbox");

        toggleBTNSpan = document.createElement("span");
        toggleBTNSpan.setAttribute("class", "slider round")

        toggleBTNLabel.appendChild(toggleBTN);
        toggleBTNLabel.appendChild(toggleBTNSpan);
        coinCard.appendChild(toggleBTNLabel);

        toggleBTNSpan.onclick = coinSelected;

    }
}

function extrainfo() {

    //identify which "more info button " was clicked on
    var source = event.target;
    let parent = source.parentElement;
    parent.lastChild.style.visibility ="hidden";
    let cover = document.createElement("div");
    cover.setAttribute("class", "cover");
    parent.prepend(cover);
    let chosen = parent.getAttribute("class");
    console.log(parent.lastChild);
    
    getinfo();

    let backbtn=document.createElement("button");
    backbtn.setAttribute("class","btn btn-lg btn-warning")
    backbtn.id="backbtn";
    backbtn.innerText="Back";
    cover.appendChild(backbtn);

    backbtn.onclick=removeCover;


    function getinfo() {
        chosen=chosen.toLowerCase();
        //if less than 2 minutes have passed then draw from Local storage
        if (Math.floor((new Date() - currentTime)/60000) < 2){
            let cacheReturned=localStorage.getItem(chosen);
            //if you draw null, it means it's a new coin, create a new entry for it
            if (!cacheReturned){
                $.ajax({
                    url: "https://api.coingecko.com/api/v3/coins/" + chosen,
                    type: 'GET',
                    success: function (res) {
        
                        let image=document.createElement("img");
                        image.setAttribute("src",res.image.small);
                        image.setAttribute("class","img");
                        cover.appendChild(image);
        
                        let currencyArea=document.createElement("div");
                        currencyArea.id="currencyArea";
                        let currencyHolder={
                            USD : res.market_data.current_price.usd,
                            EUR : res.market_data.current_price.eur,
                            ILS : res.market_data.current_price.ils,
                            pic : res.image.small
                        }
            
                        currencyArea.innerHTML=`
                        USD ($) : ${currencyHolder.USD}
                        EUR (€) : ${currencyHolder.EUR}
                        ILS (₪) : ${currencyHolder.ILS}
                        `;
                        cover.appendChild(currencyArea);
                        
    
                        currencyHolder=JSON.stringify(currencyHolder);
                        let cacheSave=currencyHolder;
                        localStorage.setItem(chosen, cacheSave);
    
                    },
                    error: function (xhr, status, error) {
                        var errorMessage = xhr.status + ': ' + xhr.statusText;
                        alert('Error - ' + errorMessage);
                    }
                })
                currentTime =  new Date();
            }
            //if you drew values from the local storage update the panel.
            else {
                cacheReturned=JSON.parse(cacheReturned);
                console.log(cacheReturned);

                let image=document.createElement("img");
                image.setAttribute("src",cacheReturned.pic);
                image.setAttribute("class","img");
                cover.appendChild(image);
            
                let currencyArea=document.createElement("div");
                currencyArea.id="currencyArea";
                            
                
                currencyArea.innerHTML=`
                USD ($) : ${cacheReturned.USD}
                EUR (€) : ${cacheReturned.EUR}
                ILS (₪) : ${cacheReturned.ILS}
                `;
                cover.appendChild(currencyArea);
                
        }
        }
        //if more than 2 minutes have passed

        else  {
            $.ajax({
                url: "https://api.coingecko.com/api/v3/coins/" + chosen,
                type: 'GET',
                success: function (res) {
    
                    let image=document.createElement("img");
                    image.setAttribute("src",res.image.small);
                    image.setAttribute("class","img");
                    cover.appendChild(image);
    
                    let currencyArea=document.createElement("div");
                    currencyArea.id="currencyArea";
                    let currencyHolder={
                        USD : res.market_data.current_price.usd,
                        EUR : res.market_data.current_price.eur,
                        ILS : res.market_data.current_price.ils,
                        pic : res.image.small
                    }
        
                    currencyArea.innerHTML=`
                    USD ($) : ${currencyHolder.USD}
                    EUR (€) : ${currencyHolder.EUR}
                    ILS (₪) : ${currencyHolder.ILS}
                    `;
                    cover.appendChild(currencyArea);
                    

                    currencyHolder=JSON.stringify(currencyHolder);
                    let cacheSave=currencyHolder;
                    localStorage.setItem(chosen, cacheSave);

                },
                error: function (xhr, status, error) {
                    var errorMessage = xhr.status + ': ' + xhr.statusText;
                    alert('Error - ' + errorMessage);
                }
            })
            currentTime =  new Date();
        }





        

    }

}

function coinSelected() {
    clicked = event.target;
    if (clicked.parentElement.parentElement.hasAttribute("selected")) {
        coincounter--;
        clicked.parentElement.parentElement.removeAttribute("selected");
    }

    else {
        coincounter++;
        if (coincounter>5) {
        $('html, body').animate({scrollTop:0}, 'slow');
        modalPopUp(clicked);
    } 
        clicked.parentElement.parentElement.setAttribute("selected", "selected");
    }

}

