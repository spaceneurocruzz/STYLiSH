function addToCartCount(data) {
  const cartCountNodes = document.getElementsByClassName("cartCountNode");
  if (data === null || data.length === 0) {
    return;
  } else {
    for (let ix = 0; ix < cartCountNodes.length; ix++) {
      cartCountNodes[ix].innerHTML = data.length;
    }
  }
}