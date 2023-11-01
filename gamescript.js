document.addEventListener("DOMContentLoaded", function () {
  let letraEscolhida;
  let palavraAdivinha;
  let arr = [];
  let pai = document.querySelector(".guess-word");
  let indexes = [];
  let bodyparties = document.querySelectorAll(".figure-part");
  let errorscount = 0;
  let errorsElement = document.querySelector(".errorsp");
  let messageElement = document.querySelector(".message");
  let fileData = "";

  fetch("ime.usp.br_pf_dicios_br-sem-acentos.txt")
    .then(function (full) {
      //console.log(full);
      //let a = full.text();
      //console.log(a);
      return full.text();
    })
    .then(function (full) {
      //console.log(full);
      fileData = full.split("\n");
      //console.log(fileData);
    });

  //Função para desenhar na tela traços, de acordo com o tamanho da palavra.
  function drawLines(qtd) {
    if (arr == "") {
      for (let i = 0; i < qtd; i++) {
        arr.push("_");
      }
    }
    pai.innerHTML = arr.join("");
  }

  /* Verifica se letra existe em palavra a ser adivinhada:
  / Caso positivo, adiciona no array indexes
  / a posição desta(s), podendo ser uma ou mais posições 
  / verificaar possível atualização
  */
  function checkLetra(letraEscolhida) {
    let checked = false;

    for (let i = 0; i < palavraAdivinha.length; i++) {
      if (palavraAdivinha[i] == letraEscolhida) {
        indexes.push(i);
        document.getElementById(letraEscolhida).classList.add("correct");
        checked = true;
      }
    }

    if (indexes.length == palavraAdivinha.length) {
      messageElement.innerHTML = "Você ganhou :D";
      resetGame();
    }

    if (checked == false) {
      document.getElementById(letraEscolhida).classList.add("incorrect");
      errorscount = errorscount + 1;
      document.querySelector(".history-letters").append(letraEscolhida);
      errorsElement.innerHTML = errorscount;

      if (errorscount > 6) {
        messageElement.innerHTML =
          "Você perdeu :( a palavra era: " + palavraAdivinha;
        resetGame();
      }

      for (let i = 0; i < errorscount; i++) {
        bodyparties[i].style.display = "block";
      }
    }

    checked = false;
    console.log(indexes);
  }

  /* Revela a letra na(s) posição(ões) encontrada(s):
  / Percorre o array de posições e adiciona no array pai,
  / na mesma posição do array filho, a letra que se encontra,
  / em tal posição */
  function revelarLetra() {
    for (let i = 0; i < indexes.length; i++) {
      arr[indexes[i]] = palavraAdivinha[indexes[i]];
    }
    console.log(arr);
    pai.innerHTML = arr.join("");
  }

  /*
  //Captura qual letra foi clicada
  document.querySelector("#keys").addEventListener("submit", function (item) {
    setLetraEscolhida(item.submitter.value);
    console.log(item);
    console.log(getLetraEscolhida());
    checkLetra(getLetraEscolhida());
    revelarLetra();
  });
  */

  /********************************************************************************************************** */

  document.querySelectorAll(".gm-btn").forEach(function (element) {
    element.addEventListener("click", function () {
      letraEscolhida = element.id;
      console.log(letraEscolhida);
      checkLetra(letraEscolhida);
      revelarLetra();
    });
  });

  //Starta o game
  document.querySelector("#play").addEventListener("click", function () {
    let a = document.querySelectorAll(".gm-btn");
    a.forEach(function (element) {
      element.classList.remove("disabled");
      element.classList.remove("end-game");
      element.classList.remove("correct");
      element.classList.remove("incorrect");
    });
    messageElement.innerHTML = "";
    indexes = [];
    arr = [];

    const randomIndex = Math.floor(Math.random() * fileData.length);
    console.log("A palavra é: " + fileData[randomIndex]);

    palavraAdivinha = fileData[randomIndex].toUpperCase().trim();

    errorscount = 0;
    errorsElement.innerHTML = "0";
    bodyparties[0].style.display = "none";
    bodyparties[1].style.display = "none";
    bodyparties[2].style.display = "none";
    bodyparties[3].style.display = "none";
    bodyparties[4].style.display = "none";
    bodyparties[5].style.display = "none";
    document.querySelector(".history-letters").innerHTML = "";
    console.log("play", palavraAdivinha);
    drawLines(palavraAdivinha.length);
  });

  //Reseta todo o jogo para o início
  function resetGame() {
    let a = document.querySelectorAll(".gm-btn");
    a.forEach(function (element) {
      element.classList.add("end-game");
    });
  }
});
