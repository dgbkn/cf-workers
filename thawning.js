
      function makeRequest(method, url) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve({
                        status: this.status,
                        statusText: xhr.statusText,
                        responseText: xhr.responseText
                    });
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
    }


    setInterval(checkStatus, 2500);

    
    function checkStatus(){
      makeRequest("GET", "/getStatus").then(async (response) => {

          if (response.status == 200) {
              console.log(response.responseText);
              var progdata = JSON.parse(response.responseText);

              localStorage.setItem('progdata', JSON.stringify(progdata));

              //if(progdata.status){
             //   location.replace("/slowSpeed");
            //  }

              var vids = await makeRequest("GET","/getVideos");

              if ((progdata.warnings && progdata.warnings != '[]' && !vids) || progdata.download_rate == 0 ) {
              var vids = await makeRequest("GET","/deleteAll");
              location.replace("/slowSpeed");
              }

              var prog = progdata.progress;

              if(progdata.status){
                location.replace("/seeAllFiles");
              }

              document.getElementById("progress").innerHTML = "Progress: " + prog + "%";
          }
      })
    }


    const myTimeout = setTimeout(myGreeting, 15000);
    
async function myGreeting() {
var pr = JSON.parse(localStorage.getItem("progdata"));
if ( !('status' in pr) && !('download_rate' in pr) && !('progress' in pr) ) {
var vids = await makeRequest("GET","/deleteAll");
location.replace("/slowSpeed");
}
}
