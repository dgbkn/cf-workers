import html from './html.js'
import contentTypes from './content-types.js'
import Scraper from './scraper.js'
import { generateJSONResponse, generateErrorJSONResponse } from './json-response.js'
import cheerio from 'cheerio'


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const searchParams = new URL(request.url).searchParams

  let url = searchParams.get('url')
  if (url && !url.match(/^[a-zA-Z]+:\/\//)) url = 'http://' + url

  const selector = searchParams.get('selector')
  const attr = searchParams.get('attr')
  const spaced = searchParams.get('spaced') // Adds spaces between tags
  const pretty = searchParams.get('pretty')

  if (!url || !selector) {
    return handleSiteRequest(request)
  }

  return handleAPIRequest({ url, selector, attr, spaced, pretty })
}

async function handleSiteRequest(request) {
  const url = new URL(request.url)

  if (url.pathname === '/' || url.pathname === '') {
    return new Response(html, {
      headers: { 'content-type': contentTypes.html }
    })
  }

  return new Response('Not found', { status: 404 })
}

async function handleAPIRequest({ url, selector, attr, spaced, pretty }) {
  let scraper, result

  try {
    scraper = await new Scraper().fetch(url)
  } catch (error) {
    return generateErrorJSONResponse(error, pretty)
  }

  try {
    if (!attr) {
     // result = await scraper.querySelector(selector).getText({ spaced })

     var response = await fetch(url);
     var data = await response.text();
     
     const $ =  cheerio.load(data);

    var jsonResult = [];

     var selector = $(selector);

     if (selector.length > 0) {
       selector.each((i, element) => {
           jsonResult.push({
               text: $(element).text(),
               innerHTML:$(element).html()
           });
       });
     }

     result = jsonResult;

    }

    else{
       //   result = await scraper.querySelector(selector).getAttribute(attr)
      var response = await fetch(url);
      var data = await response.text();
      
      const $ =  cheerio.load(data);

     var jsonResult = [];

      var selector = $(selector);

      if (selector.length > 0) {
        selector.each((i, element) => {
            jsonResult.push({
                text: $(element).text(),
                attrVal:$(element).attr(attr),
                innerHTML:$(element).html()
            });
        });
      }

      result = jsonResult;

    } 


  } catch (error) {
    console.log(error)
    return generateErrorJSONResponse(error, pretty)
  }

  return generateJSONResponse({ result }, pretty)
}
