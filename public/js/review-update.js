const form = document.querySelector("#inPageReview")
form.addEventListener("change", function () {
  const updateBtn = document.querySelector("button")
  updateBtn.removeAttribute("disabled");
  updateBtn.style.color = "black";
})





