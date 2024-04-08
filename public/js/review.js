const dates = document.querySelectorAll('.date');
dates.forEach(function(element) {
    let dataDate = element.textContent;
    let date = new Date(dataDate);
    let format = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    element.textContent = format;
});


document.getElementById('review_date').value = new Date().toISOString();
