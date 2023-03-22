const addProdToCart = (id) => {

    /*
    fetch('/js/test.js')
  .then(response => response.text())
  .then(data => {
    // Evaluate the function and use it
    const myFunction = eval(data);
  })
  
  const response = await fetch('/js/test.js');
  const data = await response.text()
  const funcion = await eval(data)
  */

  fetch(`http://localhost:8080/mongodb/api/carts/641501090cd3fa0a61861a7c/product/${id}`, {
    method: 'POST',
    mode: "cors",
  })
  .then(result => {
    if(result.status==200){
      alert("producto agregado");
    }
  });
  
};