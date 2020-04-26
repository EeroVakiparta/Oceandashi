var givenToken = "";

function digital(){
    var url = new URL("https://api.digitalocean.com/v2/droplets");
    console.log(url);
    fetch(url).then(response => {
        console.log(response);
        return response.json();
    })
    .then(responseData => {
        console.log(responseData);
    });

}

function getToken(){
    givenToken=document.getElementById("token").value;
    console.log(givenToken);
}

