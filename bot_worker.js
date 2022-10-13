addEventListener("fetch", (event) => {
    event.respondWith(
        handleRequest(event.request).catch(
            (err) => new Response(err.stack, { status: 500 })
        )
    );
});

/**
 * Many more examples available at:
 *   https://developers.cloudflare.com/workers/examples
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request) {
    var urlObj = new URL(request.url);

    var currentDomain = "https://" + urlObj.hostname + "/";
    var currentDomainRaw = urlObj.hostname;

    console.log("CURRENT DOMAIN: " + currentDomain);

    const { pathname } = urlObj;

    if (pathname.startsWith("/api")) {
        return new Response(JSON.stringify({ pathname }), {
            headers: { "Content-Type": "application/json" },
        });
    }

    if (pathname.startsWith("/status")) {
        const httpStatusCode = Number(pathname.split("/")[2]);

        return Number.isInteger(httpStatusCode)
            ? fetch("https://http.cat/" + httpStatusCode)
            : new Response("That's not a valid HTTP status code.");
    }

    if (pathname.startsWith("/torrent")) {
        var selector = ".clearfix ul li";
        var tamilmc = "https://1337x.to" + pathname + "/";
        var url = `https://scrap.torrentdev.workers.dev/?url=${encodeURIComponent(tamilmc)}&selector=${encodeURIComponent(selector)}`;
        var dat = await fetch(url);
        var links = await dat.json();
        var str = links.result[0].innerHTML;

        const magnet = str.substring(
            str.indexOf('href=\"') + 6,
            str.lastIndexOf('\" onclick=')
        );

        return Response.redirect("https://seedr.torrentdev.workers.dev/addMagnet?magnet=" + magnet, 301);


    }

    if (pathname.startsWith("/botRequest")) {
        // const reqBody = await readRequestBody(request);

        const reqBody = await request.json();

        var mes = reqBody.query.message;
        var sender = reqBody.query?.sender;

        var replies = [{ message: "🐱‍💻 Welcome " + sender }];
        var log = [{ "madeby": "Dev" }];

        if (mes.includes(".m3u8")) {
            replies.push({ "message": `https://study.physicswallah.workers.dev/pwmultim3u8?url=${encodeURIComponent(mes)}` });

        }



        


        
        
        if (mes.startsWith("news")) {
            var dat = await fetch("https://scrap.torrentdev.workers.dev/?url=indianexpress.com/section/india&selector=h2.title");
            var links = await dat.json();
            links = links.result;

            links.forEach(news => {
                replies.push({"message":news.text});
                
            });
        }



        if (mes.startsWith("torrent")) {
            var arr = mes.split("@");
            var dat = await fetch(getTorrentSearchurl(arr[1]));
            var links = await dat.json();
            links = links.result;


            for (let i = 0; i < links.length; i++) {
                var curLink = links[i];
                var snip = curLink.text.split("\n");
                log.push(curLink);

                if (curLink.text.includes("size info")) {
                    continue;
                }


                var name = snip[1];
                var href = `${curLink.innerHTML.split("/")[7]}/${curLink.innerHTML.split("/")[8]}/${curLink.innerHTML.split("/")[9]}`;
                //   var href = post.getElementsByTagName('a')[1].href;
                var seeds = snip[2];
                var ssiss = snip[5].substring(0, snip[5].indexOf('B') + 1);
                var size = parseFloat(ssiss);
                var GB = ssiss.includes('GB') ? true : false;
                var uploader = snip[6];
                var datae = snip[4];

                if (!GB || (GB && size <= 4.0)) {
                    replies.push({ "message": `Name:${name} size-${ssiss} date-${datae} Uploaded By-${uploader} Link:${currentDomain}${href}` });
                }
            }

        }


        if (mes.startsWith("ytdl")) {
            var arr = mes.split("@");
            var dat = await fetch(`https://ytdl.shreeram4.repl.co/getVidData?url=${encodeURIComponent(arr[1])}`);
            var formats = await dat.json();
            var aformats = formats.adaptiveFormats;
            formats = formats.formats;

            for (let i = 0; i < formats.length; i++) {
                if (formats[i].qualityLabel) {
                    var url = await shortenUrl(formats[i].url);
                    replies.push({ "message": "▶️:" + formats[i].qualityLabel + " URL:" + url });
                }
            }

        for (let i = 0; i < aformats.length; i++) {
                if (aformats[i].mimeType.includes("audio/mp4")) {
                    var url = await shortenUrl(aformats[i].url);
                    replies.push({ "message": "🎵:Audio URL:" + url });
                }
            }
        }

        
        var det = {
            replies: replies,
            log: log
        }

        return new Response(JSON.stringify(det), {
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ status: "NOT FOUND 404" }), {
        headers: {
            "content-type": "application/json"
        }
    });

}


function getTorrentSearchurl(query) {
    var tamilmc = `https://1337x.to/sort-search/${encodeURIComponent(query)}/time/desc/1/`;
    var selector = "tr";
    return `https://scrap.torrentdev.workers.dev/?url=${encodeURIComponent(tamilmc)}&selector=${encodeURIComponent(selector)}`;
}

async function shortenUrl(urllong) {
    var d = await fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer 38196364e6f7cfc2513c8d5d8a3088f00a0e54d4',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'long_url': urllong,
            'domain': 'bit.ly',
            'group_guid': 'Bm4ejfQx4RF'
        })
    });

    var link = await d.json();
    link = link.link;

    return link;
}