const drawCardBtn = $("#draw-card-btn");
const newDeckBtn = $("#new-deck-btn")
const deckCards = $("#deck-of-cards");

const URL = "https://deckofcardsapi.com/api/deck";

let g_deckId;

function setDeckId(val){
    g_deckId = val
}


drawCardBtn.on("click", async () => {
    await displayCardsDeck();
})

// Request single card from a newly shuffled deck
async function drawSingleCard() {
    const resp = await axios.get(`${URL}/new/draw`);
    const { deck_id:deckId, cards } = resp.data;
    const {image, suit, value } = cards[0];
    
    console.log(deckId);
    console.log(image);
    console.log(suit);
    console.log(value);

}


function drawSingleCardPromise() {
    axios.get(`${URL}/new/draw`)
        .then( resp => {
            const { deck_id:deckId, cards } = resp.data;
            const {image, suit, value } = cards[0];
            
            console.log(deckId);
            console.log(image);
            console.log(suit);
            console.log(value);
        })
}


// Draw Two Cards From Same Deck

async function drawTwoCards() {
    const { data:firstCard } = await axios.get(`${URL}/new/draw`);
    const { deck_id:deckId } = firstCard;

    const { data:secondCard } = await axios.get(`${URL}/${deckId}/draw`);

    const cards = [firstCard, secondCard].map(c => {
        const {image, suit, value} = c.cards[0]
        return {suit, value, image}
    })

    console.log(cards);

    return cards
}


function drawTwoCardsPromise() {
    let firstCard;

    axios.get(`${URL}/new/draw`)
        .then(resp => {
            const { deck_id, cards } = resp.data;
            firstCard = cards[0]
            return axios.get(`${URL}/${deck_id}/draw`)
        })
        .then(resp => {
            const secondCard = resp.data.cards[0]
            console.log(firstCard, secondCard);
        })
        .catch(err =>console.log(err))
}


// HTML Page

async function displayCardsDeck() {
    let card;
    
    if (g_deckId) {
        // IF there is a g_deckId, draw from the OLD deck
        res = await _getDeckData(g_deckId);
        card = res;
    } else {
        // ELSE send a request to cards api and draws a card from a NEW deck
        res = await _getDeckData();
        // Gets Deck Id and sets it as the g_deckId variable
        setDeckId(res.deckId);
        card = res;
    }
    // res = {deck: {image, suit, value, code}, deckId: '', card_left: <num>}

    const imgHTML = `<img src=${res.deck.image} 
                style="transform: translate(${Math.random() * 60 - 20}px, ${Math.random() * 60 - 30}px) rotate(${Math.random() * 180 - 30}deg)"/>`

    console.log(`Cards Remaining: ${res.card_left || 51}`);
    // Displays card on page
    deckCards.append($(imgHTML));

    if (res.card_left === 0) {
        drawCardBtn.hide();
        newDeckBtn.show();
    }
}


newDeckBtn.on("click", async () => {
    deckCards.empty();
    newDeckBtn.hide();
    drawCardBtn.show();
    g_deckId = null;
    await displayCardsDeck()
})


async function _getDeckData(deck=null) {
    if (deck) {
        const { data } = await axios.get(`${URL}/${deck}/draw`);
        return {deck: data.cards[0], deckId: data.deck_id, card_left: data.remaining}
    } else {
        const { data } = await axios.get(`${URL}/new/draw`)
        return {deck: data.cards[0], deckId: data.deck_id}
    }
}


function _getDeckDataPromises(deck=null) {
    let output = null;
    
    if (deck) {
        axios.get(`${URL}/${deck}/draw`)
            .then( res => {
                const data = res.data;
                console.log(data);

            })
            .catch( err => console.log(err))
    } else {
        axios.get(`${URL}/new/draw`)
            .then( res => {
                const data = res.data;
                console.log(data);
            })
            .catch( err => console.log(err))
    }  

}