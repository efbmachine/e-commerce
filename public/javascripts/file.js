let urlBase = 'https://glovo241.herokuapp.com'
let local = 'http://localhost:3000'


async function getNumberItem(cart) {
    url = `${urlBase}/getCart/${cart}`
    let res = await get(url)
    let response = await res.json()
    console.log(response.number)
    cart = document.getElementById('shopCartNumber')
    cart.innerHTML = response.number

    console.log(response.name)
}



async function get(url){

    return await fetch(url,{
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'applicatio/json'
        },
        redirect: 'follow',
        reffererPolicy: 'no-refferrer'
    })

}

async function post(url,data){

    return await fetch(url,{
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omi
        headers: {
            'Content-Type': 'applicatio/json'
        },
        redirect: 'follow',
        reffererPolicy: 'no-refferrer',
        body: JSON.stringify(data)
    });


}

async function fillDisplayCategories(){
    let div = document.getElementById('displayCategories')
    if(div.innerHTML!=''){
        div.innerHTML = ''
        div.className = ''
        return 'done'
    }
    let cat = await get(`${urlBase}/api/getCat/Alimentaire`)
    let result = await cat.json()
    console.log('result:',result)
    div.className = 'selection'
    div.innerHTML = `<p><b> Rayons </b></p><br>`
    let newDiv = document.createElement('div')
    newDiv.className = 'flex-container'
    result.subcats.forEach((item, i) => {
        newDiv.innerHTML += `<a href='/category/Alimentaire/${item._id}'>
                            <div class='box'>
                                <p>${item.name}</p>
                            </div>
                          </a>`
    });
    div.appendChild(newDiv)


}
