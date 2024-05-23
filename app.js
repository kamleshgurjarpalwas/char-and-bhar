const gotiStand = document.querySelectorAll(".goti-stand");
const redGoti = document.querySelectorAll(".redGoti");
const greenGoti = document.querySelectorAll(".greenGoti");
let turn = 1; // Change const to let
let count=0//for count that how many gotis comein stands

redGoti.forEach((p) => {
  if (turn === 1) p.addEventListener("dragstart", dragStart);
});

greenGoti.forEach((p) => {
  if (turn === 0) p.addEventListener("dragstart", dragStart);
});

gotiStand.forEach((s) => {
  s.addEventListener("drop", drop);
  s.addEventListener("dragover", allowDrop);
});

function dragStart(e) {
  console.log("Up");
  e.dataTransfer.setData("text", e.target.id);
}

function allowDrop(e) {
  console.log("on drop");
  e.preventDefault();
}

function drop(e) {
  console.log("Successful");
  e.preventDefault();

  var data = e.dataTransfer.getData("text");
  const draggedElement = document.getElementById(data);
  draggedElement.style.pointerEvents = "none";
  const target1 = e.target;
  if (
    target1.classList.contains("goti-stand") && // here classlist is a property and contains is a method and target1 is a constant
    target1.childElementCount === 0
  ) {
    target1.appendChild(draggedElement);
  }
  count++;//updation of count
  // Toggle turn between 1 and 0
  if (turn === 1) turn = 0;
  else turn = 1;

  // You might want to update the event listeners based on the turn
  updateDragEventListeners();
}

function updateDragEventListeners() {
  redGoti.forEach((p) => {
    p.removeEventListener("dragstart", dragStart);
    if (turn === 1) p.addEventListener("dragstart", dragStart);
  });

  greenGoti.forEach((p) => {
    p.removeEventListener("dragstart", dragStart);
    if (turn === 0) p.addEventListener("dragstart", dragStart);
  });
}