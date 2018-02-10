let hostname, port, ssl;

if (/glitch\.me$/.test(location.hostname)) {

  hostname = 'brigidde.glitch.me';
  port = 443;
  ssl = true;

} else {

  hostname = APP_SERVER_HOST;
  port = APP_SERVER_PORT;
  ssl = APP_SERVER_SSL;

}

export const serverConnectionOptions = {
  hostname,
  port,
  ssl
};

export function getServerBaseUrl(protocol: 'http' | 'ws' = 'http'): URL {
  return new URL(`${protocol}${ssl?'s':''}://${hostname}:${port}`);
}
