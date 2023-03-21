const addProdToCart = async () => {

    /*
    fetch('/js/test.js')
  .then(response => response.text())
  .then(data => {
    // Evaluate the function and use it
    const myFunction = eval(data);
  })
  */
  const response = await fetch('/js/test.js');
  const data = await response.text()
  const funcion = await eval(data)
};