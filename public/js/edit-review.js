const form = document.querySelector("#updateReview")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#updateReview_button")
      updateBtn.removeAttribute("disabled");
      updateBtn.style.color = "black";
    })



  
  
  
