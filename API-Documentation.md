# https://cs719-a01-pt-server.trex-sandwich.com API Documentation

We have provided an API hosted on `trex-sandwich.com` containing information about various Pokemon (e.g. "Pikachu", "Mewtwo") and their types (e.g. "Electric", "Psychic). You can obtain the information from the following endpoints. All endpoints return JSON data.


## Endpoint #1: Getting a list of Pokemon
**URL:** `https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon`

This endpoint will return a JSON array of all Pokemon on the server. Each object in the array will contain the Pokemon's `dexNumber` (essentially a unique ID for that Pokemon) and `name`.

For example, upon a call to <https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon>, JSON of the following form will be returned:

```json
[
    {
        "dexNumber": 1,
        "name": "Bulbasaur"
    },
    {
        "dexNumber": 2,
        "name": "Ivysaur"
    },
    {
        "dexNumber": 3,
        "name": "Venusaur"
    },
]
```

The actual JSON array returned will contain **151** entries, rather than just three - you see this by browsing to the above URL in your browser (though the code you write should handle *any nuumber* of entries being returned).


## Endpoint #2: Getting detailed info about a single Pokemon
**URL:** `https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/:dexNumber`

This endpoint will return JSON representing detailed information regarding a single pokemon with the given dex number (replace `:dexNumber` in the above URL with a number corresponding to a particular Pokemon).

For example, a call to <https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/149> will return the following JSON:

```json
{
    "dexNumber": 149,
    "name": "Dragonite",
    "imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/149.png",
    "types": [
        "Dragon",
        "Flying"
    ],
    "dexEntry": "This Pokémon is known as the Sea Incarnate. Figureheads that resemble Dragonite decorate the bows of many ships."
}
```

In addition to the Pokemon's `dexNumber` and `name`, we also get back its `imageUrl` (which can be used directly in an `<img>`'s `src` attribute to display the Pokemon), an array of its `types` (which could contain any number of values), and its `dexEntry` (essentially flavour text / interesting info about that species).

*Note:* If requesting a Pokemon that doesn't exist, a `404` error response will be returned instead of JSON. If using JavaScript, we could check for this case as shown here. You *probably* won't need to do that in this assignment.

```js
const response = await fetch('https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/1000000'); // There aren't 1 million Pokemon species... Yet!!

if (response.status === 200) {
    // Everything is OK, Pokemon JSON has been returned successfully
}
else if (response.status === 404) {
    // 404 means "Not Found" - the ID we were searching for doesn't exist.
}
```


## Endpoint #3: Getting detailed info about a single *random* Pokemon
**URL:** `https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/random`

This endpoint will return data in the same format as Endpoint #3 above, but will return data about a *random* Pokemon, rather than one that you choose. Navigate to <https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/random> in a browser a few times to see this in action.


## Endpoint #4: Getting info about a Pokemon Type (e.g. Psychic, Electric, etc.)
**URL:** `https://cs719-a01-pt-server.trex-sandwich.com/api/types/:typeName`

This endpoint returns JSON with information about a given type. By replacing `:typeName` in the above URL with a particular type name (*case insensitive*), we will receive info about that type.

For example, a call to <https://cs719-a01-pt-server.trex-sandwich.com/api/types/Grass> will return the following JSON:

```json
{
    "name": "Grass",
    "offenseDamageMultipliers": [
        { "type": "Normal", "multiplier": 1 },
        { "type": "Fighting", "multiplier": 1 },
        { "type": "Flying", "multiplier": 0.5 },
        { "type": "Poison", "multiplier": 0.5 },
        { "type": "Ground", "multiplier": 2 },
        { "type": "Rock", "multiplier": 2 },
        { "type": "Bug", "multiplier": 0.5 },
        { "type": "Ghost", "multiplier": 1 },
        { "type": "Steel", "multiplier": 0.5 },
        { "type": "Fire", "multiplier": 0.5 },
        { "type": "Water", "multiplier": 2 },
        { "type": "Grass", "multiplier": 0.5 },
        { "type": "Electric", "multiplier": 1 },
        { "type": "Psychic", "multiplier": 1 },
        { "type": "Ice", "multiplier": 1 },
        { "type": "Dragon", "multiplier": 0.5 },
        { "type": "Dark", "multiplier": 1 },
        { "type": "Fairy", "multiplier": 1 }
    ],
    "defenseDamageMultipliers": [
        { "type": "Normal", "multiplier": 1 },
        { "type": "Fighting", "multiplier": 1 },
        { "type": "Flying", "multiplier": 2 },
        { "type": "Poison", "multiplier": 2 },
        { "type": "Ground", "multiplier": 0.5 },
        { "type": "Rock", "multiplier": 1 },
        { "type": "Bug", "multiplier": 2 },
        { "type": "Ghost", "multiplier": 1 },
        { "type": "Steel", "multiplier": 1 },
        { "type": "Fire", "multiplier": 2 },
        { "type": "Water", "multiplier": 0.5 },
        { "type": "Grass", "multiplier": 0.5 },
        { "type": "Electric", "multiplier": 0.5 },
        { "type": "Psychic", "multiplier": 1 },
        { "type": "Ice", "multiplier": 2 },
        { "type": "Dragon", "multiplier": 1 },
        { "type": "Dark", "multiplier": 1 },
        { "type": "Fairy", "multiplier": 1 }
    ]
}
```

Along with the type's `name`, the returned data contains info about the effectiveness of the given type versus all other types, from both an offensive (`offenseDamageMultipliers`) and defensive (`defenseDamageMultipliers`) perspective.

For example, according to the data above:
- Grass types will *deal* double damage to Water types (`offensiveDamageMultipliers` "Water" multiplier = `2`) and half damage to Fire types (`offensiveDamageMultipliers` "Fire" multiplier = `0.5`).
- Grass types will *take* double damage from Fire types (`defensiveDamageMultipliers` "Fire" multiplier = `2`) and half damage from Water types (`defensiveDamageMultipliers` "Water" multiplier = `0.5`).


## Endpoint #5. Getting info about a Pokemon's "defensive profile"
**URL:** `https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/{:dexNumber}/defense-profile`

Pokemon can have multiple types. Therefore, knowing the defensive profile of a single type (see `defensiveDamageMultipliers` above) is often not enough information to determine how much damage a particular species of Pokemon will take from an attack of a given type. Therefore, we have provided an additional API endpoint which will return information similar to above, but will consider *all* of a given Pokemon's types. We can get defensive profile information for a single Pokemon by replacing `:dexNumber` in the above URL with a Pokemon's dex number.

For example, a call to <https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/94/defense-profile> will return the following JSON:

```json
[
    { "type": "Normal", "multiplier": 0 },
    { "type": "Fighting", "multiplier": 0 },
    { "type": "Flying", "multiplier": 1 },
    { "type": "Poison", "multiplier": 0.25 },
    { "type": "Ground", "multiplier": 2 },
    { "type": "Rock", "multiplier": 1 },
    { "type": "Bug", "multiplier": 0.25 },
    { "type": "Ghost", "multiplier": 2 },
    { "type": "Steel", "multiplier": 1 },
    { "type": "Fire", "multiplier": 1 },
    { "type": "Water", "multiplier": 1 },
    { "type": "Grass", "multiplier": 0.5 },
    { "type": "Electric", "multiplier": 1 },
    { "type": "Psychic", "multiplier": 2 },
    { "type": "Ice", "multiplier": 1 },
    { "type": "Dragon", "multiplier": 1 },
    { "type": "Dark", "multiplier": 2 },
    { "type": "Fairy", "multiplier": 0.5 }
]
```

The data above is the defensive profile for Gengar (Dex number #94), a Ghost *and* Poison type Pokemon. Gengar receives double damage from Psychic type attacks ("Psychic" multiplier = `2`), half damage from Grass attacks ("Grass" multiplier = `0.5`), quarter damage from Poison attacks ("Poison" multiplier = `0.25`), and no damage at all from Fighting attacks ("Fighting" multiplier = `0`)!

![](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/94.png)