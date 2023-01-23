const chromium = require('chrome-aws-lambda');
//https://console.aws.amazon.com/

exports.handler = async event => {
	let url = '';

	if (event.body !== null && event.body !== undefined)
		let { url } = JSON.parse(event.body); // Retrives the input

  let res = null;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true
    });

    let page = await browser.newPage();

		await page.goto(url);

    let title = await page.title();
    let body = { title };

    res = {
			statusCode: 200, // Sets status to successful
			headers: { // Sets headers:
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
				'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
				'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
				'X-Requested-With': '*'
			},
			body: JSON.stringify(body)
    };

  } catch (err) {
    return { statusCode: 404, body: err };
  } finally {
    if (browser !== null)
      await browser.close();
  }

  return res;
};
