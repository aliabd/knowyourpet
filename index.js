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
        document.getElementById('progress').innerHTML = "Classifying...";
        document.getElementById('progress').style.display = "block";
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
            document.getElementById('progress').innerHTML = "";
            document.getElementById('progress').style.display = "none";
            for (var i=0; i<20; i++){
                document.getElementById('pet-class-'+i).innerHTML = (text);
             };

             showQuestion(petClass);

          });

  })
}
}


function showQuestion(label) {
    petClass = label;
    document.getElementById('search-box').style.display = "block";
}


$(document).keypress(function(e) {
  if (e.which == 13) {
    search();
  }
})

$('#search-btn').click(function() {
    search();
    return false;
})

var answer;

function search() {
    document.getElementById('progress').innerHTML = "answering...";
    document.getElementById('progress').style.display = "block";
    var question_input = document.getElementById('search').value;

    fetch('https://hf.space/embed/tyang/electra_wikipedia_qa/+/api/predict/',
    { method: "POST", body: JSON.stringify({"data": [ petClass, question_input]}),
            headers: { "Content-Type": "application/json" } }).then(function(response)
             { return response.json(); }).then(
             function(json_response){
             console.log(json_response)
             answer = json_response["data"][0];
             link = json_response["data"][1];
             link_pre = "For more info, click <a href='"
             link_post = "'>here</a>."
             link = link_pre + link + link_post;
             answer += "\n\n" + link;
             document.getElementById('progress').innerHTML = ""
             document.getElementById('progress').style.display = "none";
             document.getElementById('answer').innerHTML = answer;
             document.getElementById('answer').style.display = "block";
             console.log(answer);
             });
}