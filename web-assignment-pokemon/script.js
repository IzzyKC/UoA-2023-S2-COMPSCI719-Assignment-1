window.addEventListener("load", function(){

    // Your client-side JavaScript here

    // All data from the server must be accessed via AJAX fetch requests.
    
    //variable for total pokemon count
    var totalPokemonCount;
    //variable for current pokemon detail
    var currentpokemonDetail;
    //varibale for current pokemon type info
    //var currentPokemonTypeInfo;
    //TODO delete var

    //dispaly all pokemon on left sidebar
    displayAllPokemon();

    //initilaise page
    initialisePage();

    async function displayAllPokemon() {
        //get all-pokemon container
        const allPokemons = document.querySelector("#all-pokemon");
        //fetch all pokemon information from endpoint:trex-sandwich.com
        let allPokemonResponseObj = await fetch(" https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon");
        //Use the fetch API response.json() method to get a JSON object from the response
        let allPokemonArray = await allPokemonResponseObj.json();
        //console allPokemon information
        console.log(allPokemonArray);
        //loop to display all pokemons on the left sidebar
        totalPokemonCount = allPokemonArray.length;
        for(let i = 0; i < allPokemonArray.length; i++) {
            const tRow = document.createElement("tr");
            const tCol = document.createElement("td");
            tCol.setAttribute("id", `id-${allPokemonArray[i].dexNumber}`);
            tCol.innerText = allPokemonArray[i].name;
            tRow.appendChild(tCol);
            allPokemons.appendChild(tRow);
            //add click event listener for each pokemon
            tCol.addEventListener("click", displaySinglePokemonDetail);
        }

    }

    async function initialisePage() {
        //first load/refresh:a random Pokemon should be loaded as the selected Pokemon
        let randomPokemonResponseObj = await fetch("https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/random");
        //Use the fetch API response.json() method to get a JSON object from the response
        let randomPokemonDetail = await randomPokemonResponseObj.json();
        //console random pokemon detail
        console.log(randomPokemonDetail);
        currentpokemonDetail = randomPokemonDetail;
        updatePokemondetail();

    }

    async function displaySinglePokemonDetail(event) {
        //get dexNumber of selected pokemon
        const pokedex = event.target.id.slice(3);
        //console log dexNumber
        console.log(pokedex);
        //fetch selected pokemon detail from endpoint:https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/:dexNumber
        let singlePokemonresponseObj = await fetch(`https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/${pokedex}`);
        //check response status
        if (singlePokemonresponseObj.status === 404) {
            alert("Not Found - the ID we were searching for doesn'texist");
            return;
        }
        //Use the fetch API response.json() method to get a JSON object from the response
        let singlePokemonDetail = await singlePokemonresponseObj.json();
        //console log single pokemon detail
        console.log(singlePokemonDetail);
        currentpokemonDetail = singlePokemonDetail;
        updatePokemondetail();
        
    }
  
    function updatePokemondetail() {
        //display name
        document.querySelector("#name").innerText = currentpokemonDetail.name;

        //display image
        const imgContainer = document.querySelector("#img-container");
        //clear imgContainer
        imgContainer.innerHTML = "";
        const img = document.createElement("img");
        img.src = currentpokemonDetail.imageUrl;
        img.alt = currentpokemonDetail.name;
        img.title = currentpokemonDetail.name;
        imgContainer.appendChild(img);

        //display dexNumber
        document.querySelector("#pokedex").innerText = currentpokemonDetail.dexNumber;

        //display description
        document.querySelector("#description").innerText = currentpokemonDetail.dexEntry;

        //displayTypeInfo
        displayPokemonTypeInfo();
    }

    function displayPokemonTypeInfo() {
        //update offense info
        updateOffenseInfo();
    }

    async function updateOffenseInfo(){
        //fetch offense info by pokemon type
        //if no pokemon type, return
        if(currentpokemonDetail.types == undefined || currentpokemonDetail.types.length === 0){
            return;
        }
        //fetch offense info for each type
        //update pokemon name
        document.querySelector("#selectedokemon").innerText = currentpokemonDetail.name;
        //update ppokemon types
        document.querySelector("#typelist").innerText = currentpokemonDetail.types.toString();
        currentpokemonDetail.types.forEach(type => updateOffenseInfoByType(type));

    }

    async function updateOffenseInfoByType(type){
        //get offense type info container
        const offenseInfo = document.querySelector("#offense");
        //clear previous info
        offenseInfo.innerHTML = "";
        //fetch type info 
        let offenseInfoResponseObj = await fetch(`https://cs719-a01-pt-server.trex-sandwich.com/api/types/${type}`);
        //Use the fetch API response.json() method to get a JSON object from the response
        let offenseInfoJson = await offenseInfoResponseObj.json();
        //console log offense info
        console.log(offenseInfoJson);
        //create table for type info
        const offenseInfoTable = document.createElement("table");
        //table head
        const tHead = document.createElement("thead");
        //tHead.setAttribute("text-align", "center");
        const thRow1 = document.createElement("tr");
        const thCell11 = document.createElement("th");
        thCell11.innerHTML = `${type} type attacks:`;
        thCell11.setAttribute("colspan", 2);
        thRow1.appendChild(thCell11);
        tHead.appendChild(thRow1);
        const thRow2 = document.createElement("tr");
        const thCell21 = document.createElement("th");
        thCell21.innerText = "Defending type";
        const thCell22 = document.createElement("th");
        thCell22.innerText = "Damage dealt";
        thRow2.appendChild(thCell21);
        thRow2.appendChild(thCell22);
        tHead.appendChild(thRow2);
        offenseInfoTable.appendChild(tHead);
        //table body
        const tBody = document.createElement("tbody");
        offenseInfoJson.offenseDamageMultipliers.forEach(function(info){
            const tbRow = document.createElement("tr");
            const tbCol1 = document.createElement("td"); 
            const tbCol2 = document.createElement("td"); 
            tbCol1.innerText = info.type;
            tbCol2.innerText = multiplierMapToString(info.multiplier);
            tbRow.appendChild(tbCol1);
            tbRow.appendChild(tbCol2);
            tBody.appendChild(tbRow);
        });
        offenseInfoTable.appendChild(tBody);
        //append table to offense info div
        offenseInfo.appendChild(offenseInfoTable);
    }

    function multiplierMapToString(multiplier) {
        switch(multiplier) {
            case 0 :
                return "No damage";
            case 0.25 :
                return "Quarter damage";
            case 0.5 :
                return "Half damage";
            case 1 :
                return "Normal damage";
            case 2 :
                return "Double damage";
            case 4 :
                return "Quadruple damage";
            default:
                return "can't map multiplier to a string"   
        }

    }




});