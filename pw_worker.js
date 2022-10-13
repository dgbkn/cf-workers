addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    var crosHeaders = {
        "Access-Control-Allow-Origin": "*"
    };

    var urlObj = new URL(request.url);

    var action = urlObj.searchParams.get("action");

    var appendMainFormHtml = urlObj.searchParams.get("appendMainFormHtml");

    var actionPath = urlObj.pathname;

    var currentDomain = "https://" + urlObj.hostname + "/";
    var currentDomainRaw = urlObj.hostname;

    console.log("CURRENT DOMAIN: " + currentDomain);


    var html = `    
    <!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <title>
           PW Panel
        </title>
    </head>
    <body>
<style>
html,
body {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>


<main class="form-signin">

${appendMainFormHtml ? appendMainFormHtml : ""}

  <form action="/updateToken" method="GET">

    <img class="mb-4" src="https://physicswallah.pages.dev/assets/pw.svg" alt="" width="200" height="80">
    <h1 class="h3 mb-3 fw-normal">Update Main Token</h1>

    <div class="form-floating" bis_skin_checked="1">
      <input type="text" class="form-control" id="floatingInput" placeholder="TOKEN"  id="token" name="token" required>
      <label for="floatingInput">Token</label>
    </div>
    <div class="form-floating" bis_skin_checked="1">
      <input type="password" class="form-control" id="floatingPassword" placeholder="Password"  id="password" name="password" required>
      <label for="floatingPassword">Password</label>
    </div>

    <div class="form-floating" bis_skin_checked="1">

    <select class="form-select" aria-label="Default select example" id="floatingSelect" name="type">
    <option selected value="main_token">Main Token</option>
    <option value="vid_token">Video Token</option>
</select>

<label for="floatingSelect">Type of Token</label>
</div>
<br>

    <button class="w-100 btn btn-lg btn-primary" type="submit">Update</button>
    <p class="mt-5 mb-3 text-muted">© ${new Date().toISOString().slice(0, 10)} Made By PW Hacker</p>
  </form>
</main>

<!-- your HTML code --> 

</body>
</html>
    

`;


    if (actionPath == "/updateToken" && action == null) {

        if (urlObj.searchParams.get("password") == "rishab") {

            await PW_DB.put(urlObj.searchParams.get("type"), urlObj.searchParams.get("token"));
            var htmltoAppend = `
            <div class="alert alert-success">
  <strong>Success!</strong> Updated SuccessFully.
</div>`;
        }
        else {
            var htmltoAppend = `
            <div class="alert alert-danger">
  <strong>Danger!</strong> Enter Right Passw@rd.
</div>`;

        }

        return Response.redirect(currentDomain + "?appendMainFormHtml=" + encodeURIComponent(htmltoAppend), 301);

    }



    if (actionPath == "/" && action == null) {
        return new Response(html, {
            headers: {
                "content-type": "text/html;charset=UTF-8"
            }
        });
    }








    //api Paths

    if (actionPath == "/getBatches" && action == null) {

        var a = await pwFetchwithToken("https://api.penpencil.xyz/v3/batches/my-batches?page=1&mode=1", {}, "main_token");
        var b = await pwFetchwithToken("https://api.penpencil.xyz/v3/batches/my-batches?page=2&mode=1", {}, "main_token");

        var jsond = [
            ...a.data,
            ...b.data,
        ];

        return new Response(JSON.stringify(jsond), {
            headers: {
                ...crosHeaders,
                "content-type": "application/json"
            }
        });
    }


    if (actionPath == "/getBatchDetails" && action == null) {
        var batchid = urlObj.searchParams.get("batch_id");

        var jsond = await pwFetchwithToken(`https://api.penpencil.xyz/v3/batches/${batchid}/details`, {}, "main_token");

        return new Response(JSON.stringify(jsond.data), {
            headers: {
                ...crosHeaders,
                "content-type": "application/json"
            }
        });
    }


    if (actionPath == "/getTopicDetails" && action == null) {
        var batchid = urlObj.searchParams.get("batch_id");
        var subject_id = urlObj.searchParams.get("subject_id");


        var fetchd = await pwFetchwithToken(`https://api.penpencil.xyz/v2/batches/${batchid}/subject/${subject_id}/topics?page=1`, {}, "main_token");

        var jsond = [...fetchd.data];

        var p = 2;
        var count = fetchd.data.length;

        while (count < fetchd.paginate.totalCount) {
            var fetchdn = await pwFetchwithToken(`https://api.penpencil.xyz/v2/batches/${batchid}/subject/${subject_id}/topics?page=${p}`, {}, "main_token");
            jsond = [...jsond, ...fetchdn.data];
            count = count + fetchdn.data.length;
            p++;
        }


        return new Response(JSON.stringify(jsond), {
            headers: {
                ...crosHeaders,
                "content-type": "application/json"
            }
        });

    }



    if (actionPath == "/getSubTopicDetails" && action == null) {

        //  types:
        //  videos
        //  notes
        // DppNotes
        // DppVideos


        var batchid = urlObj.searchParams.get("batch_id");
        var subject_id = urlObj.searchParams.get("subject_id");
        var type = urlObj.searchParams.get("type");
        var tag = urlObj.searchParams.get("tag");


        var fetchd = await pwFetchwithToken(`https://api.penpencil.xyz/v2/batches/${batchid}/subject/${subject_id}/contents?page=1&contentType=${type}&tag=${tag}`, {}, "main_token");

        var jsond = [...fetchd.data];

        var p = 2;
        var count = fetchd.data.length;

        while (count < fetchd.paginate.totalCount) {
            var fetchdn = await pwFetchwithToken(`https://api.penpencil.xyz/v2/batches/${batchid}/subject/${subject_id}/contents?page=${p}&contentType=${type}&tag=${tag}`, {}, "main_token");
            jsond = [ ...jsond, ...fetchdn.data ];
            count = count + fetchdn.data.length;
            p++;
        }


        return new Response(JSON.stringify(jsond), {
            headers: {
                ...crosHeaders,
                "content-type": "application/json"
            }
        });

    }


    //api Paths








    //baseM3u8 METHORD
    if (actionPath == "/pwmultim3u8" && action == null && urlObj.searchParams.get("url")) {

        var urlToGet = urlObj.searchParams.get("url");

        var policy = await pwFetchwithToken("https://api.penpencil.xyz/v1/files/get-signed-cookie", { url: urlToGet.replace(".m3u8", ".mpd") },"vid_token", false);
        // var policy = await pwFetchwithCompetetionToken("https://api.penpencil.xyz/v1/files/get-signed-cookie", { url: urlToGet.replace(".m3u8", ".mpd") },false);

        policy = policy.data;


        html = await fetch(urlToGet + policy);
        var data = await html.text();

        var re = urlToGet.substring(0, urlToGet.lastIndexOf("/"));

        data = data.split("\n");
        var final = "";

        data.forEach((element) => {
            if (element[0] == "#") {
                final += element + "\n";
            } else if (element != "") {
                if (element.includes("http")) {
                    final += currentDomain + "pwsinglem3u8?url=" + encodeURIComponent(element + policy) + "\n";
                } else {
                    final += currentDomain + "pwsinglem3u8?url=" + encodeURIComponent(re + "/" + element + policy) + "&policy=" + encodeURIComponent(policy) + "\n";
                }
            }
        });


        return new Response(final, {
            headers: {
                ...crosHeaders,
                "content-type": "application/vnd.apple.mpegurl",
                "Access-Control-Expose-Headers": "Content-Length,Content-Range",
                "Access-Control-Allow-Headers": "Range",
                "Accept-Ranges": "bytes"
            }
        });
    }




    if (actionPath == "/pwsinglem3u8" && action == null && urlObj.searchParams.get("url")) {

        var urlToGet = urlObj.searchParams.get("url");
        var policy = urlObj.searchParams.get("policy");

        html = await fetch(urlToGet);
        var data = await html.text();

        var re = urlToGet.substring(0, urlToGet.lastIndexOf("/"));

        data = data.split("\n");
        var final = "";


        data.forEach((element) => {
            if (element[0] == "#" && !element.includes("EXT-X-KEY")) {
                final += element + "\n";
            }

            else if (element != "" && !element.includes("EXT-X-KEY")) {
                if (element.includes("http")) {
                    // final += domain + "api?uri=" + encodeURIComponent(element) + "\n";
                    final += element + "\n";
                } else {
                    // final += domain + "api?uri=" + re + "/" + encodeURIComponent(element) + "\n";
                    final += re + "/" + element + policy + "\n";
                }
            }

            else if (element.includes("EXT-X-KEY")) {
                element = element.replace(
                    "api-dev.penpencil.xyz/v1/videos/get-hls-key?",
                    `${currentDomainRaw}/keyWallah?t=1&`
                );

                element = element.replace(
                    "api.penpencil.xyz/v1/videos/get-hls-key?",
                    `${currentDomainRaw}/keyWallah?t=2&`
                );

                // element = element.replace("https://api","https://home.techiebank.workers.dev/http/https://api");

                final += element + "\n";
            }

        });




        return new Response(final, {
            headers: {
                ...crosHeaders,
                "content-type": "application/vnd.apple.mpegurl",
                "Access-Control-Expose-Headers": "Content-Length,Content-Range",
                "Access-Control-Allow-Headers": "Range",
                "Accept-Ranges": "bytes"
            }
        });
    }


    if (actionPath == "/keyWallah" && action == null && urlObj.searchParams.get("videoKey") && urlObj.searchParams.get("key")) {

        var videoKey = urlObj.searchParams.get("videoKey");
        var key = urlObj.searchParams.get("key");
        var t = urlObj.searchParams.get("t");

        var urltoGet = t == 1 ? `https://api-dev.penpencil.xyz/v1/videos/get-hls-key?videoKey=${videoKey}&key=${key}` : `https://api.penpencil.xyz/v1/videos/get-hls-key?videoKey=${videoKey}&key=${key}`;

        html = await fetch(urltoGet);
        var data = await html.blob();

        return new Response(data, {
            headers: {
                ...crosHeaders,
                "content-type": "binary/octet-stream"
            }
        });

    }
    //baseM3u8 METHORD








    return new Response(JSON.stringify({ status: "NOT FOUND 404" }), {
        headers: {
            ...crosHeaders,
            "content-type": "application/json"
        }
    });
}






//PW API
async function getCompetetionToken() {
    var token = await PW_DB.get("comp_token");

    if (!token) {
        console.log("REGENERATION OF comp_token");

        const rawResponse = await fetch("https://api.penpencil.xyz/v1/oauth/token", {
            method: "POST",
            headers: {
                'client-version' : '49',
                'Content-Type' : 'application/json',
                'Referer' : 'https://competishun.com/',
                'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36',
                'client-id' : '5c8f5d96a248bc40e600bfa4',
                'Client-Type' : 'WEB',
            },
            body: '{"username":"9413737698","password":"anu123456","client_id":"system-admin","client_secret":"KjPXuAVfC5xbmgreETNMaL7z","grant_type":"password","organizationId":"5c8f5d96a248bc40e600bfa4"}',
        });

        const content = await rawResponse.json();

        console.log(content, "COMP_LOGIN");

        token = content.data.access_token;
        await PW_DB.put("comp_token", token, { expirationTtl: 3100 });
    }

    return token;
}


async function pwFetchwithToken(urlToFetch, data = {}, token = "vid_token", getRequest = true) {

    var tokens = token ==  "vid_token" ?  await getVidToken() : await getMainToken();


    var headers = {
        'authority': 'api.penpencil.xyz',
        'authorization': "Bearer " + tokens,
        'client-id': '5eb393ee95fab7468a79d189',
        'client-type': 'WEB',
        'client-version': '99',
        'content-type': 'application/json',
        'origin': 'https://study.physicswallah.live',
        'randomid': 'c560b7b6-9298-4c1c-a62f-77ca92a18376',
        'referer': 'https://study.physicswallah.live/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36',
    }


    const rawResponse = getRequest ? await fetch(urlToFetch, {
        method:"GET",
        headers: headers,
    }): await fetch(urlToFetch, {
        method:"POST",
        headers: headers,
        body: JSON.stringify(data),
    });


    const content = await rawResponse.json();

    return content;
}


async function pwFetchwithCompetetionToken(urlToFetch, data = {}, getRequest = true) {

    var headers = {
        'authority' : 'api.penpencil.xyz',
        'authorization' : "Bearer " + getCompetetionToken(),
        'client-id' : '5eb393ee95fab7468a79d189',
        'client-type' : 'WEB',
        'client-version' : '99',
        'content-type' : 'application/json',
        'origin' : 'https://study.physicswallah.live',
        'randomid' : 'c560b7b6-9298-4c1c-a62f-77ca92a18376',
        'referer' : 'https://study.physicswallah.live/',
        'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36',
    }


    const rawResponse = getRequest ? await fetch(urlToFetch, {
        method:"GET",
        headers: headers,
    }): await fetch(urlToFetch, {
        method:"POST",
        headers: headers,
        body: JSON.stringify(data),
    });


    const content = await rawResponse.json();

    return content;
}




async function getMainToken() {
    var token = await PW_DB.get("main_token");
    return token;
}

async function getVidToken() {
    var token = await PW_DB.get("vid_token");
    return token;
}