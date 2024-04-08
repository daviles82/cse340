let elements = document.getElementsByClassName('review_date');
for(let i=0; i < elements.length; i++){
    let date = new Date(elements[i].textContent);
    elements[i].textContent = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
