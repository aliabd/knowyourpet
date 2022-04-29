var b64; var petClass;

function classify(event){
  if(event.target.files.length > 0){

    // show uploaded image
    var file = event.target.files[0];
    var src = URL.createObjectURL(event.target.files[0]);
    var preview = document.getElementById("file-ip-1-preview");
    preview.src = src;
    preview.style.display = "block";

    document.getElementById('upload-button').style.display = "none";


    // convert image to base64 string format required by gradio
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        b64 = reader.result;
   };


   const promise = new Promise((resolve) => {
       var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
              resolve(reader.result);
       }
       });

   promise.then(b64 => {
        // classify with gradio api
        fetch('https://hf.space/embed/jph00/pets/+/api/predict/',
            { method: "POST", body: JSON.stringify(
            {"data":[ b64 ]}),
            headers: { "Content-Type": "application/json" } }).then(function(response)
             { return response.json(); }).then(
             function(json_response){
             console.log(json_response)
             petClass = json_response["data"][0]["label"].replaceAll("_"," ");
             console.log(petClass);
             var text = " ";
             let numLetters = petClass.length;
             let repetitions = Math.floor(60 / numLetters);
            for(var i=0; i<repetitions; i++)
            {
                text += petClass + " ";
            }
            for (var i=0; i<20; i++){
                document.getElementById('pet-class-'+i).innerHTML = (text);
             };

//             showQuestion(petClass);

          });

  })
}
}


//petClassfunction classify(event){
