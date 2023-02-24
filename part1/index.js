const promises = $("#promises-list");
const asyncAwait = $("#async-await-list");


const URL = "http://numbersapi.com";


function createLi(str) {
    return `<li class="list-group-item">${str}</li>`
}

async function getFavNumAsync(num) {
    const data = await $.getJSON(`${URL}/${num}?json`);
    console.log(data);
}


function getFavNumPromise(num) {
    axios.get(`${URL}/${num}?json`)
        .then( resp => {
            console.log(resp.data)
            const newLi = createLi(resp.data.text)
            promises.append($(newLi))
        })
        .catch( err => console.log(err));
}





async function getNumberFactsAsync(...nums) {
    const data = await $.getJSON(`${URL}/${nums}?json`); // returns data object { num1: "fact", num2: "fact"}
    for (const fact in data) {
        let newLi = createLi(data[fact]);
        asyncAwait.append($(newLi));
    }
}
getNumberFactsAsync(3,4,5,77,192,32);




function getNumberFactsPromise(...nums) {
    axios.get(`${URL}/${nums}?json`)
        .then( resp => {
            for (const fact in resp.data) {
                let newLi = createLi(resp.data[fact]);
                promises.append($(newLi));
            }
        })
        .catch( err => console.log(err));
}
getNumberFactsPromise(66,77,99);






function getFourFavAsync(num) {

    const inpStr = String(num);
    const arr = Array.from({length: 4}, () => num);

    arr.forEach( async d => {
        let data = await $.getJSON(`${URL}/${d}?json`); // returns data object { num1: "fact}
        let newLi = createLi(data.text);
        asyncAwait.append($(newLi));
    
    });

    
}
getFourFavAsync(10)






function getFourFavPromise(num) {

    const inpStr = String(num);
    const arr = Array.from({length: 4}, () => num);

    arr.forEach( async d => {
        axios.get(`${URL}/${d}?json`)
        .then( resp => {
            const newLi = createLi(resp.data.text)
            promises.append($(newLi))
        })
        .catch( err => console.log(err));
    });
}
getFourFavPromise(100)

