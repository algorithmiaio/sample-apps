var input = {
   "height":300,
   "width":150,
   "binarize":true,
   "image":"https://upload.wikimedia.org/wikipedia/commons/f/f7/Hickory_Golfer.jpg"
};
Algorithmia.client("your_api_key")
  .algo("algo://media/ContentAwareResize/0.1.2")
  .pipe(input)
  .then(function(output) {
     console.log(output);
  });