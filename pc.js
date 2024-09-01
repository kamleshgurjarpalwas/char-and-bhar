const gotiStand = document.querySelectorAll(".goti-stand");
const redGoti = document.querySelectorAll(".redGoti");
const greenGoti = document.querySelectorAll(".greenGoti");

let turn = true; // true for redGoti's turn, false for greenGoti's turn
let count = 0; //counting of how many goties walked
let dancing = false; //mean abhi goti ko khaya nhi ja skta
let eatSucc = true;

//below both variable apply after the 18
let sourceInd;
let dest;

// Initialize drag event listeners based on the initial turn
// initializeDragEventListeners();

redGoti.forEach((p) => {
  if (turn === true) p.addEventListener("dragstart", dragStart);
});

greenGoti.forEach((p) => {
  if (turn === false) p.addEventListener("dragstart", dragStart);
});

gotiStand.forEach((s, index) => {
  s.addEventListener("drop", (e) => drop(e, index)); //yha per e event banakar pass ki gai hai
  s.addEventListener("dragover", allowDrop);
});

function dragStart(e) {
  let parentEle = e.target.parentElement;
  console.log(parentEle);

  let parentId;

  if (parentEle && parentEle.id) {
    let parentId = parentEle.id;
    console.log(parentId); // Log the parent's ID
    sourceInd = parentId.slice(4)-1;
  }


  e.dataTransfer.setData("text", e.target.id);
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e, index) {
  e.preventDefault();

  const data = e.dataTransfer.getData("text");
  const draggedElement = document.getElementById(data);

  console.log(data);

  const target1 = e.target;
  if (
    target1.classList.contains("goti-stand") &&
    target1.childElementCount === 0 &&
    count < 18
  ) {
    target1.appendChild(draggedElement);
    draggedElement.style.pointerEvents = "none";
    turn = !turn;
    count++;
    checkBhar(index);
    selfMoveablePlaceRemoveing();
    if (count >= 18 && eatSucc) gotiWhereMoveable(turn);
  } else if (
    target1.classList.contains("goti-stand") &&
    target1.childElementCount === 0 &&
    isRightDest(index)
  ) {
    target1.appendChild(draggedElement);
    draggedElement.style.pointerEvents = "none";
    turn = !turn;
    count++;
    checkBhar(index);
    selfMoveablePlaceRemoveing();
    if (eatSucc) gotiWhereMoveable(turn);
  }
  /* else if (
    target1.classList.contains("goti-stand") &&
    target1.childElementCount === 0 &&
    count >= 18
  )*/
  updateDragEventListeners();
}

function updateDragEventListeners() {
  redGoti.forEach((p) => {
    p.removeEventListener("dragstart", dragStart);
    if (turn && !p.classList.contains("dancing-box") && !dancing && eatSucc) {
      p.addEventListener("dragstart", dragStart);
    }
  });

  greenGoti.forEach((p) => {
    p.removeEventListener("dragstart", dragStart);
    if (!turn && !p.classList.contains("dancing-box") && !dancing && eatSucc) {
      p.addEventListener("dragstart", dragStart);
    }
  });
}

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

const gotiRepalceAble = [
  [1, 9],
  [0, 2, 4],
  [1, 14],
  [4, 10],
  [1, 3, 5, 7],
  [4, 13],
  [7, 11],
  [4, 6, 8],
  [7, 12],
  [0, 10, 21],
  [3, 9, 11, 18],
  [6, 10, 15],
  [8, 13, 17],
  [5, 12, 14, 20],
  [2, , 13, 23],
  [11, 16],
  [15, 17, 19],
  [12, 16],
  [10, 19],
  [16, 18, 20, 22],
  [13, 19],
  [9, 22],
  [19, 21, 23],
  [14, 22],
];

function checkBhar(index) {
  for (let winBox of winPattern) {
    if (winBox.includes(index)) {
      const firstChild1 = gotiStand[winBox[0]].firstElementChild;
      const firstChild2 = gotiStand[winBox[1]].firstElementChild;
      const firstChild3 = gotiStand[winBox[2]].firstElementChild;

      if (
        firstChild1 &&
        firstChild2 &&
        firstChild3 &&
        firstChild1 &&
        getComputedStyle(firstChild1).backgroundColor ===
          getComputedStyle(firstChild2).backgroundColor &&
        getComputedStyle(firstChild2).backgroundColor ===
          getComputedStyle(firstChild3).backgroundColor
      ) {
        hilightEtableGoti(getComputedStyle(firstChild3).backgroundColor);
      }
    }
  }
}

function hilightEtableGoti(winColor) {
  if (winColor === "rgb(255, 0, 0)") {
    for (let stand of gotiStand) {
      const inSideGoti = stand.firstElementChild;
      if (
        inSideGoti &&
        getComputedStyle(inSideGoti).backgroundColor === "rgb(0, 0, 255)" //we cannot store getComputedStyle into in any const
      ) {
        inSideGoti.classList.add("dancing-box");
      }
    }
    for (let nonEatableBox of winPattern) {
      const child1 = gotiStand[nonEatableBox[0]].firstElementChild;
      const child2 = gotiStand[nonEatableBox[1]].firstElementChild;
      const child3 = gotiStand[nonEatableBox[2]].firstElementChild;
      if (
        child1 &&
        child2 &&
        child3 &&
        getComputedStyle(child1).backgroundColor ===
          getComputedStyle(child2).backgroundColor &&
        getComputedStyle(child2).backgroundColor ===
          getComputedStyle(child3).backgroundColor &&
        getComputedStyle(child3).backgroundColor === "rgb(0, 0, 255)"
      ) {
        child1.classList.remove("dancing-box");
        child2.classList.remove("dancing-box");
        child3.classList.remove("dancing-box");
      }
    }
  } else {
    for (let stand of gotiStand) {
      const inSideGoti = stand.firstElementChild;
      if (
        inSideGoti &&
        getComputedStyle(inSideGoti).backgroundColor === "rgb(255, 0, 0)" //we cannot store getComputedStyle into in any const
      ) {
        inSideGoti.classList.add("dancing-box");
      }
    }

    for (let nonEatableBox of winPattern) {
      const child1 = gotiStand[nonEatableBox[0]].firstElementChild;
      const child2 = gotiStand[nonEatableBox[1]].firstElementChild;
      const child3 = gotiStand[nonEatableBox[2]].firstElementChild;
      if (
        child1 &&
        child2 &&
        child3 &&
        getComputedStyle(child1).backgroundColor ===
          getComputedStyle(child2).backgroundColor &&
        getComputedStyle(child2).backgroundColor ===
          getComputedStyle(child3).backgroundColor &&
        getComputedStyle(child3).backgroundColor === "rgb(255, 0, 0)"
      ) {
        child1.classList.remove("dancing-box");
        child2.classList.remove("dancing-box");
        child3.classList.remove("dancing-box");
      }
    }
  }
  eatSucc = !eatSucc;
  dancing = !dancing;
  doClickableForEatableGoti();
}

function doClickableForEatableGoti() {
  //yha function khane layak goti ko clickable banayega
  const eatablegoti = document.querySelectorAll(".dancing-box");
  for (let div of eatablegoti) {
    div.style.pointerEvents = "auto";
    // div.draggable = false;
    // div.removeEventListener("dragstart", dragStart);
  }
  eatablegoti.forEach((s) => {
    s.addEventListener("click" || "touch", (e) => {
      if (!eatSucc) removeEtableChild(e);
    });
  });
}

function removeEtableChild(e) {
  e.preventDefault();
  const deletingElement = e.target;
  deletingElement.remove();
  dancing = !dancing;
  const eatablegoti = document.querySelectorAll(".dancing-box");
  for (let ele of eatablegoti) {
    ele.style.pointerEvents = "none";
    ele.classList.remove("dancing-box");
  }
  eatSucc = !eatSucc;
  if (count >= 18) gotiWhereMoveable(turn);
  updateDragEventListeners();
}

function gotiWhereMoveable(baji) {
  let it = 0;
  const red = "rgb(255, 0, 0)"; // Define the color red
  const green = "rgb(0, 0, 255)"; // Define the color green
  if (baji) {
    for (let emptySpaceArr of gotiRepalceAble) {
      const ele = gotiStand[it++].firstElementChild;

      if (ele && getComputedStyle(ele).backgroundColor === red) {
        for (let emptySpace of emptySpaceArr) {
          if (gotiStand[emptySpace].childElementCount === 0) {
            ele.style.pointerEvents = "auto";
            gotiStand[emptySpace].style.backgroundColor = "rgb(254 183 183)";
          }
        }
      }
    }
  }

  if (!baji) {
    for (let emptySpaceArr of gotiRepalceAble) {
      const ele = gotiStand[it++].firstElementChild;
      if (ele && getComputedStyle(ele).backgroundColor === green) {
        for (let emptySpace of emptySpaceArr) {
          if (gotiStand[emptySpace].childElementCount === 0) {
            ele.style.pointerEvents = "auto";
            gotiStand[emptySpace].style.backgroundColor = "rgb(147 147 255";
          }
        }
      }
    }
  }
}

function selfMoveablePlaceRemoveing() {
  console.log("selfMoveablePlaceRemoveing");
  for (ele of gotiStand) ele.style.backgroundColor = "";
}

function isRightDest(index) {
  var i;
  for (i in gotiRepalceAble[sourceInd]) {
    if (gotiRepalceAble[sourceInd][i] === index) return true;
  }
  return false;
} 

const myDoc = document.documentElement;

window.addEventListener("load", () => {
  // Add a click event listener to trigger fullscreen mode
  document.addEventListener("click", () => {
    myDoc.requestFullscreen();
  });
});