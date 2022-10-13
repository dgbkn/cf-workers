import useReflare from 'reflare';

const handleRequest = async (request) => {
  const reflare = await useReflare();

  reflare.push({
    path: '/*',
    upstream: {
      domain: 'freepw-5effb-default-rtdb.asia-southeast1.firebasedatabase.app',
      protocol: 'https',
    },
  cors: {
    origin: '*',
  },
  });

  var response = await reflare.handle(request);
  
 // var data = await response.text();
  
    //  console.log(data);



  
 //data = data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
 
 //data = data.replaceAll("display: none","");
 //data = data.replaceAll("display:none","");
 //data = data.replaceAll("d2ers4gi7coxau","");
 //data = data.replaceAll(".cloudfront.net/?","");
 //data = data.replaceAll("101desire.com","reflare-app.torrentdev.workers.dev");
  
 

//response = new Response(data, response);

  // Set CORS headers
  //response.headers.set('Access-Control-Allow-Origin', '*');


  return response;
};

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
