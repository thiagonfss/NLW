function populateUfs(){
    const ufSelect = document.querySelector("select[name=uf]")
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json() ) //função anonima que retorna que armazena os dados em JSON
    .then( states => {
        for( const state of states){
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }//lista todos os estados 
    } )

}
populateUfs()

function getcities (event){
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufvalue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufvalue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then( res => res.json() ) //função anonima que retorna que armazena os dados em JSON
    .then( cities => {
        for( const city of cities){
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }//lista todos os estados 
        citySelect.disabled = false
    } )
 
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getcities)

// Itens de coleta

const itemstoCollect = document.querySelectorAll(".items-grid li")
for (const item of itemstoCollect){
    item.addEventListener("click", handleSelectedItem)
}



const collectedItems = document.querySelector("input[name=items]")

//array qye guarda os itens selecionados
let selectedItems=[]

function handleSelectedItem(event){
        //adicionar ou remover uma classe com JS
        const itemLi = event.target

        itemLi.classList.toggle("selected")

        const itemId = event.target.dataset.id

    //verificar se existem itens selecionados 
        const alreadySelected =  selectedItems.findIndex( item=> { //nele eu busco o index do array[0,1,2,3,4,5] /arrow function
            const itemfound = item == itemId // returna verdadeiro ou falso
            return itemfound
        } )

        //se tiver selecionado
    if (alreadySelected>=0){
        //tem que desmacar
        const filteredItems = selectedItems.filter(item =>{
            const itemIsDiferent = item != itemId
            return itemIsDiferent
        }) 
        
        selectedItems = filteredItems
    //Se não estiver selecionado
    } else{
        //adicionar a seleção
        selectedItems.push(itemId)
    }
    //atualizar o hidden com os itens selecionados
    collectedItems.value = selectedItems
}
