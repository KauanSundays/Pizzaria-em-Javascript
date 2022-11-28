let carrinho = [];//tudo que adicionar no array é o carrinho de compras
let modalQt = 1;//Reset para 1 pizza
let modalKey = 0; //

const seleciona = (el)=> {
    return document.querySelector(el); //el de elemento
}; //Aqui ele esta substituindo o document.querySelector(el) por seleciona

const selecTodos = (el)=> document.querySelectorAll(el);
//Aqui ele esta substituindo o document.querySelectorAll(el) por selecTodos

//listagem DAS PIZZAS
pizzaJson.map((pizza, index)=>{ /*Mapeou usando o map, Criou uma função como uma arrow function, recebendo 2 parametros,
sendo eles:
    o item em especifico, o outro é o numero de array(index)
*/ let pizzaItem = seleciona('.models .pizza-item').cloneNode(true);
/*ele clonou o item pizza-item com a funcao cloneNode*/
//Agora necessario preencher as informacoes 
    pizzaItem.setAttribute('data-key', index);
    //aqui mostrara qual pizza foi clicada, qual esta selecionada no momento

    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name;
    //Entrou na div pizza-item--name adicionou no HTML a pizza.name, onde tem o Json com a string a ser adicionada
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}`;
    //Fixando em 2 algarismos depois da virgula
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{//e de evento
        e.preventDefault();
        //aqui ele tira tudo que estava padrao ao clicar no sinal de mais
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        //seleciona usando o key, assim ele atualiza para a pizza atual
        modalQt = 1;//Reset para 1 pizza
        modalKey = key;//aqui ela diz qual é a pizza e manda pra uma variavel

        seleciona('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        seleciona('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        seleciona('.pizzaBig img').src = pizza.img;
        seleciona('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        //aqui nao pode esquecer do price, ele está puxando da Json
        seleciona('.pizzaInfo--size.selected').classList.remove('selected');
        selecTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {//ForEach == para cada um dos itens
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });//resetando para sempre ser grande ao clicar

        seleciona('.pizzaInfo--qt').innerHTML = modalQt;//Reset para 1 pizza
        //tamanhos
            


        seleciona('.pizzaWindowArea').style.opacity = 0;
        seleciona('.pizzaWindowArea').style.display = 'flex';
        //Entao no caso ao clicar ele irá:
        //selecionar div pizzaWindowArea entrar no style e no display virará flex
        setTimeout(()=> {
            seleciona('.pizzaWindowArea').style.opacity = 1;
        },200)
        //aqui em 200 miliseg ele vai de 0 a 100

    });

    seleciona('.pizza-area').append(pizzaItem);
//append adiciona um conteudo, no inner ele troca
});

//eventos dentro do modal
function fecharModal() { //Fechar o modal
    seleciona('.pizzaWindowArea').style.opacity = 0; //Coloca a opacidade em zero
    setTimeout(()=>{
        seleciona('.pizzaWindowArea').style.display = 'none'; //faz o modal ficar none
    },500); //depois de meio segundo
};

selecTodos('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=> {
    item.addEventListener('click', fecharModal);
    //selecionou todos os botoes de cancelar o modal, o cancelButton e o mobile
    //forEach seleciona todos os "Itens" e declarando o nome como item, 
    //item.adicione na lista de eventos ao clicar faça a FUNÇÃO fecharModal;
    //ao clicar em algum desses botoes, irá executar uma função que faz o modal ficar none
});

//BOTOES MENOS E MAIS PIZZAS
//MENOS
seleciona('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
    modalQt--;
    seleciona('.pizzaInfo--qt').innerHTML = modalQt;
    }
//SE FOR MAIS DO QUE 1 PODE DIMINUIR, CASO CONTRARIO NAO ESTÁ AUTORIZADO A DIMINUIR
});
seleciona('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    seleciona('.pizzaInfo--qt').innerHTML = modalQt;
});
//PODE ADICIONAR QUANTAS QUISER

selecTodos('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=> {
        seleciona('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
    //cliquei em um item em especifico? ele vai remover o selected
    //e vai adicionar o selected no item que eu clicar
});


//BOTAO ADICIONAR AO CARRINHO
seleciona('.pizzaInfo--addButton').addEventListener('click', () => {
    //quado clicar devemos saber o que foi reunido pelo cliente
    //qual é o tamanho da pizza
    let size = parseInt(seleciona('.pizzaInfo--size.selected').getAttribute('data-key'));//retirando la do html que especifica o tamanho da pizza por data-key class
    //FILTRO SE JA ADICIONOU A MESMA PIZZA ANTES
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = carrinho.findIndex((item)=> item.identifier == identifier);
    //identifier vai identificar se o item que está sendo adicionado ja foi adicionar anteriormente
    if(key > -1) {
        carrinho[key].qt += modalQt;
    } else {
        carrinho.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    };
    fecharModal();
    updateCarrinho();
    //Ao clicar em adicionar para o carrinho ele irá fechar automatico
});

seleciona('.menu-openner').addEventListener('click', () => {
    if (carrinho.length > 0 ) {
        seleciona('aside').style.left = 0;
    }
});

seleciona('.menu-closer').addEventListener('click', () => {
    seleciona('aside').style.left = '100vh';
});



//FUNÇÃO QUE ATUALIZA O CARRINHO
function updateCarrinho() {
    seleciona('.menu-openner span').innerHTML = carrinho.length;
    //contagem do carrinho no mobile, atualiza em tempo real

    if (carrinho.length > 0 ) {
        seleciona('aside').classList.add('show');
        //verifique no css a class show
        seleciona('.cart').innerHTML = '';
//está zerando para nao adicionar mais do que foi selecionado

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for (let i in carrinho) {
            let pizzaItem = pizzaJson.find((item)=>item.id == carrinho[i].id);
/*Find esta retornando todos os dados do item na pizzaJson*/

            subtotal += pizzaItem.price * carrinho[i].qt;
//subtotal é o preco da pizza selecionada * a quantidade de pizzas
            let carrinhoItem = seleciona('.models .cart--item').cloneNode(true);           
/*Como se estivesse importando a div cart item para o script.js */


            let pizzaSizeName;
            switch(carrinho[i].size) {
                case 0:
                    pizzaSizeName = 'Peq.';
                    break;
                case 1:
                    pizzaSizeName = 'Méd.';
                    break;
                case 2:
                    pizzaSizeName = 'Grande';
                    break;
            }


            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            //template para adicionar 2 strings que vem de Json

            carrinhoItem.querySelector('img').src = pizzaItem.img;

            carrinhoItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            carrinhoItem.querySelector('.cart--item--qt').innerHTML = carrinho[i].qt;
            
//BOTOES DE MAIS E MENOS NO MENU SUAS PIZZAS
            carrinhoItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(carrinho[i].qt > 1 ) {
                    carrinho[i].qt--;
                } else {//tendo mais que 1 pode ser retirado ainda
                    carrinho.splice(i,1);
                };//se nao tiver nada do item ele apagará o item
                updateCarrinho();
            });
//adicionando evento no click
            carrinhoItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                carrinho[i].qt++;
                updateCarrinho();
            });
//FIM DOS BOTOES DE MAIS E MENOS NO MENU SUAS PIZZAS


            seleciona('.cart').append(carrinhoItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        seleciona('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        seleciona('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        seleciona('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        seleciona('aside').classList.remove('show');
        seleciona('aside').style.left = '100vh';
        //removeu todos os itens do carrinho?? fechar o carrinho automaticamente
        
    };
};