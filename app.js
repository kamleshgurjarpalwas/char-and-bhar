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

const gotiStands = document.querySelectorAll(".goti-stand");
let turn = true;
gotiStands.forEach((gs, index) => {
  gs.addEventListener("click", function () {
    if (!this.clicked) {
      if (turn === true) {
        gs.style.background = "#05f545";
        turn = false;
      } else {
        gs.style.background = "red";
        turn = true;
      }
      this.clicked = true;
    }
  });
});
