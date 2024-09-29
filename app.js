const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.get('/scrape', async (req, res) => {
  try {
    const { data } = await axios.get('https://www.ndtv.com/topic/crime-against-women');
    const $ = cheerio.load(data);

    // Array to store scraped data
    const scrapedData = [];

    // Select all list items with class 'src_lst-li'
    $('li.src_lst-li').each((i, el) => {
      const title = $(el).find('.src_itm-ttl a').text();
      const link = $(el).find('.src_itm-ttl a').attr('href');
      const description = $(el).find('.src_itm-txt').text().trim();
      const image = $(el).find('img').attr('src');

      // Push the extracted data into the array
      scrapedData.push({ title, link, description, image });
    });

    // Send the scraped data as JSON
    res.json(scrapedData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error scraping data');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
