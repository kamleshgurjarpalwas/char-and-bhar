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

//following code given for coloering of gotis
const fRedGivGot = document.querySelectorAll(".elementForRedStorage"); // mean:-for red given goties
const fGreenGivGot = document.querySelectorAll(".elementForGreenStorage"); //mean:-for green given goties
let rI = 8; //iterator for red goties
let gI = 8; //iterators for green goties
let count = 0;
const gotiStands = document.querySelectorAll(".goti-stand");

let turn = true;
let turn1 = false; //yha per turn1 ka kaam hai ki yadi bhar banne per jab oposition ki goti khane ke bad anya gotiya click event ko nhi sune
gotiStands.forEach((gs, index) => {
  gs.addEventListener("click", function () {
    if (!this.clicked) {
      if (turn1 === false) {
        console.log("uper waala daba hai");
        if (turn === true) {
          gs.style.background = "blue";
          gs.style.pointerEvents = "none";
          deleteBox(turn);
          count++;
          if (count === 18) boxDisabl();
          checkWinner();
          turn = false;
        } else {
          gs.style.background = "red";
          gs.style.pointerEvents = "none";
          deleteBox(turn);
          count++;
          if (count === 18) boxDisabl();
          checkWinner();
          turn = true;
        }
      }
    }
  });
});

const winPattern = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9, 10, 11],
  [12, 13, 14],
  [15, 16, 17],
  [18, 19, 20],
  [21, 22, 23],
  [0, 9, 21],
  [3, 10, 18],
  [6, 11, 15],
  [1, 4, 7],
  [16, 19, 22],
  [8, 12, 17],
  [5, 13, 20],
  [2, 14, 23],
];

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

const checkWinner = () => {
  for (let winBox of winPattern) {
    let colour1 = gotiStands[winBox[0]].style.background;
    let colour2 = gotiStands[winBox[1]].style.background;
    let colour3 = gotiStands[winBox[2]].style.background;
    if (colour1 === colour2 && colour2 === colour3 && colour1 === "blue") {
      gotiWhichEatable(colour1);
    }
    if (colour1 === colour2 && colour2 === colour3 && colour1 === "red") {
      console.log("red yes");
      gotiWhichEatable(colour1);
    }
  }
};

const gotiWhichEatable = (comingColour) => {
  turn1 = true; //yha true islliye kiya hai jab etable per click kiya ja sake
  if (comingColour === "red") {
    for (let eatBox of gotiStands) {
      if (eatBox.style.background === "blue") {
        eatBox.classList.add("eatable-goti");
      }
      for (let nonEatableBox of winPattern) {
        let colour1 = gotiStands[nonEatableBox[0]].style.background;
        let colour2 = gotiStands[nonEatableBox[1]].style.background;
        let colour3 = gotiStands[nonEatableBox[2]].style.background;
        if (colour1 === colour2 && colour2 === colour3 && colour1 === "blue") {
          gotiStands[nonEatableBox[0]].classList.remove("eatable-goti");
          gotiStands[nonEatableBox[1]].classList.remove("eatable-goti");
          gotiStands[nonEatableBox[2]].classList.remove("eatable-goti");
        }
      }
    }
    doClickableForEatableGoti();
  } else {
    for (let eatBox of gotiStands) {
      if (eatBox.style.background === "red") {
        eatBox.classList.add("eatable-goti");
      }
      for (let nonEatableBox of winPattern) {
        let colour1 = gotiStands[nonEatableBox[0]].style.background;
        let colour2 = gotiStands[nonEatableBox[1]].style.background;
        let colour3 = gotiStands[nonEatableBox[2]].style.background;
        if (colour1 === colour2 && colour2 === colour3 && colour1 === "red") {
          gotiStands[nonEatableBox[0]].classList.remove("eatable-goti");
          gotiStands[nonEatableBox[1]].classList.remove("eatable-goti");
          gotiStands[nonEatableBox[2]].classList.remove("eatable-goti");
        }
      }
    }
    doClickableForEatableGoti();
  }
};

const doClickableForEatableGoti = () => {
  //yha function khane layak goti ko clickable banayega
  const eatablegoti = document.querySelectorAll(".eatable-goti");
  for (let butt of eatablegoti) {
    butt.disabled = false;
    butt.style.pointerEvents = "auto";
  }
  eatingGoti();
};

const eatingGoti = () => {
  const eatingGoti = document.querySelectorAll(".eatable-goti");
  {
    eatingGoti.forEach((e, index) => {
      e.addEventListener("click", function () {
        if (turn1 === true) {
          e.classList.remove("eatable-goti");
          e.style.backgroundColor = "white";
          console.log("niche wala daba hai");
          normalLeftGotis();
          turn1 = false;
        }
      });
    });
  }
};

//below function for normalization of eatable goties
const normalLeftGotis = () => {
  const toNormal = document.querySelectorAll(".eatable-goti");
  for (let x of toNormal) {
    x.classList.remove("eatable-goti");
    x.disabled = true;
    x.style.pointerEvents = "none";
  }
};
