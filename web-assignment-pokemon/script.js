window.addEventListener("load", function(){

    // Your client-side JavaScript here

    // All data from the server must be accessed via AJAX fetch requests.
    
    //variable for total pokemon count
    var totalPokemonCount;
    //variable for current pokemon detail
    var currentpokemonDetail;
    //conatant of type info table column count
    const tableInfoColumnCount = 2;
    //const of offense table header names
    const headerNames_OffenseInfo = ["Defending type","Damage dealt"];
    //const of offense table header names
    const headerNames_DefenseInfo = ["Attacking type","Damage received"];

    //dispaly all pokemon on left sidebar
    displayAllPokemon();

    //initilaise page
    initialisePage();

    
    function addSelectedPokemonClass(selectedPokemon) {
        if(selectedPokemon == null) {
            return;
        }
        //remove previous selected class
        const pokemons = document.querySelectorAll("#all-pokemon td"); 
        pokemons.forEach(function(pokemon) {
            pokemon.classList.remove("pokeSelected");  
        });
        //add selected pokemon classlist
        selectedPokemon.classList.add("pokeSelected");
    }

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
        //add selected pokemon css class
        console.log(document.querySelector("#id-"+currentpokemonDetail.dexNumber));
        addSelectedPokemonClass(document.querySelector("#id-"+currentpokemonDetail.dexNumber));
        updatePokemondetail();
        
    }

    async function displaySinglePokemonDetail(event) {
        //add selected pokemon css class
        addSelectedPokemonClass(event.target);
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
        img.id = "pokeimg";
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
        //update pokemon name
        document.querySelector("#selectedokemon").innerText = currentpokemonDetail.name;
        //update pokemon types
        document.querySelector("#typelist").innerText = currentpokemonDetail.types.toString();
        //update offense info
        updateOffenseInfo();
        //update defense Info
        updateDefenseInfo();
    }

    async function updateOffenseInfo() {
        //if no pokemon type, return
        if(currentpokemonDetail.types == undefined || currentpokemonDetail.types.length === 0){
            return;
        }
        //update offense info by pokemon type
        currentpokemonDetail.types.forEach(type => updateOffenseInfoByType(type));

    }

    async function updateOffenseInfoByType(type){
        //get offense type info container
        const offenseInfo = document.querySelector("#offense");
        //clear previous info
        offenseInfo.innerHTML = "";
        //fetch offense info by type
        let offenseInfoResponseObj = await fetch(`https://cs719-a01-pt-server.trex-sandwich.com/api/types/${type}`);
        //Use the fetch API response.json() method to get a JSON object from the response
        let offenseInfoJson = await offenseInfoResponseObj.json();
        //console log offense info
        console.log(offenseInfoJson);
        const headerNamesArray = [[`${type} type attacks:`], headerNames_OffenseInfo];
        //display offense info in a table
        displayTypeInfoInTable(offenseInfo, headerNamesArray, offenseInfoJson.offenseDamageMultipliers);

    }
    
    async function updateDefenseInfo() {
        //get defense info container
        const defenseInfo = document.querySelector("#defense");
        //clear previous info
        defenseInfo.innerHTML = "";
        //fetch defense info by dexNumber
        const dexNumber = currentpokemonDetail.dexNumber;
        let defenseInfoResponseObj = await fetch(`https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/${dexNumber}/defense-profile`);
        //Use the fetch API response.json() method to get a JSON object from the response
        let defenseInfoJson = await defenseInfoResponseObj.json();
         //console log defense info
         console.log(defenseInfoJson);
         //display defense info in a table
         displayTypeInfoInTable(defenseInfo, [headerNames_DefenseInfo], defenseInfoJson);
    }

    function multiplierMapToString(multiplier) {
        //switch concept from COMPSCI-718
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

    function displayTypeInfoInTable(container, headerNamesArray, typeInfoMultipliers){
         //create table for type info
         const infoTable = document.createElement("table");
         //create table head element
         const tHead = document.createElement("thead");
         //create header
         headerNamesArray.forEach(function(headerNames) {
            createTypeInfoHeaderRow(tHead, headerNames);
         });
         // append thead to table
         infoTable.appendChild(tHead);
         //create table body element
         const tBody = document.createElement("tbody");
         createTypeInfoTableContent(tBody, typeInfoMultipliers);
        //append tbody to table
        infoTable.appendChild(tBody);
         //append table to offense info div
         container.appendChild(infoTable);

    }

    function createTypeInfoHeaderRow(tHead, headerNames) {
        const thRow = document.createElement("tr");
        for(let i = 0; i < headerNames.length; i++){
            const thCell = document.createElement("th");
            thCell.innerText = headerNames[i];
            if(headerNames.length < tableInfoColumnCount) {
                thCell.setAttribute("colspan", tableInfoColumnCount);
            }
            thRow.appendChild(thCell);
        }
        tHead.appendChild(thRow);

    }

    function createTypeInfoTableContent(tBody, infoMultipliers){
        infoMultipliers.forEach(function(info){
            const tbRow = document.createElement("tr");
            const tbCol1 = document.createElement("td"); 
            const tbCol2 = document.createElement("td"); 
            tbCol1.innerText = info.type;
            tbCol2.innerText = multiplierMapToString(info.multiplier);
            tbRow.appendChild(tbCol1);
            tbRow.appendChild(tbCol2);
            tBody.appendChild(tbRow);
        });

    }

});