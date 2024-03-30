//following code for given 9 goties
const containerForGreenGoti = document.querySelector(".forGreenStorage");
const containerForRedGoti = document.querySelector(".forRedStorage");
for (let i = 0; i < 9; i++) {
  const redGoti = document.createElement("div");
  redGoti.classList.add("elementForRedStorage");
  containerForRedGoti.appendChild(redGoti);
}
for (let i = 0; i < 9; i++) {
  const greenGoti = document.createElement("div");
  greenGoti.classList.add("elementForGreenStorage");
  containerForGreenGoti.appendChild(greenGoti);
}

//following code given for colering of gotis
const fRedGivGot = document.querySelectorAll(".elementForRedStorage"); // mean:-for red given goties
const fGreenGivGot = document.querySelectorAll(".elementForGreenStorage"); //mean:-for green given goties
let rI = 8; //iterator for red goties
let gI = 8; //iterators for green goties
let count = 0;
const gotiStands = document.querySelectorAll(".goti-stand");
let turn = true;
gotiStands.forEach((gs, index) => {
  gs.addEventListener("click", function () {
    if (!this.clicked) {
      if (turn === true) {
        gs.style.background = "#05f545";
        gs.style.pointerEvents = "none";
        deleteBox(turn);
        count++;
        if (count === 18) boxDisabl();
        turn = false;
      } else {
        gs.style.background = "red";
        gs.style.pointerEvents = "none";
        deleteBox(turn);
        count++;
        if (count === 18) boxDisabl();
        turn = true;
      }
    }
  });
});

const boxDisabl = () => {
  for (let butt of gotiStands) {
    butt.disabled = true;
    butt.pointerEvents = "none";
  }
};

function deleteBox(turn1) {
  if (turn1) {
    fGreenGivGot[gI].parentNode.removeChild(fGreenGivGot[gI]);
    gI--;
  } else {
    fRedGivGot[rI].parentNode.removeChild(fRedGivGot[rI]);
    rI--;
  }
}
