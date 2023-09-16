document.addEventListener("DOMContentLoaded", function () {
  //let myChance = new Chance();
  //console.log(myChance.first({ gender: "female" }));
  let letraEscolhida;
  let palavraAdivinha = "";
  let arr = [];
  let pai = document.querySelector(".guess-word");
  let indexes = [];
  let bodyparties = document.querySelectorAll(".figure-part");
  let errorscount = 0;
  let errorsElement = document.querySelector(".errorsp");
  let messageElement = document.querySelector(".message");
  // O jogador pode errar até 6, mais que 6 = game over;
  // Adicionar essa condição;

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
        messageElement.innerHTML = "Você perdeu :(";
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

  //Start o game
  document.querySelector("#play").addEventListener("click", async function () {
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
    //palavraAdivinha = myChance.first({ gender: "female" });
    //palavraAdivinha = palavraAdivinha.toUpperCase();

    await fetch("https://api.openai.com/v1/completions", {
      method: "POST",

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + "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",
      },

      body: JSON.stringify({
        model: "text-davinci-003",
        prompt:
          "Me diga uma palavra aleatória da língua portuguesa, tudo em maiúsculo sem o ponto final.",
        max_tokens: 2048,
        temperature: 0.5,
      }),
    })
      .then((resposta) => resposta.json())
      .then((dados) => {
        console.log(dados);
        palavraAdivinha = dados.choices[0].text;
      })
      .catch((erro) => {
        console.log(erro);
      });

    errorscount = 0;
    errorsElement.innerHTML = "0";
    bodyparties[0].style.display = "none";
    bodyparties[1].style.display = "none";
    bodyparties[2].style.display = "none";
    bodyparties[3].style.display = "none";
    bodyparties[4].style.display = "none";
    bodyparties[5].style.display = "none";
    document.querySelector(".history-letters").innerHTML = "";
    palavraAdivinha = palavraAdivinha.trim();
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
