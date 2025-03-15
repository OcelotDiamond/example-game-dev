let errorCounter = 0;
window.onerror = (err, src, ln, col) => {
    if (errorCounter < 10) {
        alert(`Error: ${err} \n Line: ${ln}`);
    }
    errorCounter++;
}