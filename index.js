/* eslint-disable no-restricted-globals */
/* global REDIRECTS */

function getDestination(requestURL) {
  const url = new URL(requestURL);
  let key = url.pathname;
  if (key.endsWith('/')) {
    key = key.slice(0, -1);
  }
  if (!key) {
    return null;
  }
  return REDIRECTS.get(key);
}

async function getRedirect(request) {
  const destination = await getDestination(request.url);
  if (!destination) {
    return null;
  }
  return Response.redirect(destination, 302);
}

async function handleRequest(request) {
  let response;
  try {
    response = await getRedirect(request);
  } catch (error) {
    console.error('Error while getting redirect data', error);
  }
  if (response) {
    return response;
  }
  return new Response(null, {
    status: 404,
    headers: { 'content-type': 'text/plain' },
  });
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
