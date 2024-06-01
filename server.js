const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/scrape', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const metadata = {
            title: $('title').text(),
            description: $('meta[name="description"]').attr('content'),
            canonical: $('link[rel="canonical"]').attr('href'),
            keywords: $('meta[name="keywords"]').attr('content'),
            ogTitle: $('meta[property="og:title"]').attr('content'),
            ogDescription: $('meta[property="og:description"]').attr('content'),
            ogImage: $('meta[property="og:image"]').attr('content'),
            ogUrl: $('meta[property="og:url"]').attr('content'),
            ogType: $('meta[property="og:type"]').attr('content'),
            ogSiteName: $('meta[property="og:site_name"]').attr('content'),
            twitterCard: $('meta[name="twitter:card"]').attr('content'),
            twitterTitle: $('meta[name="twitter:title"]').attr('content'),
            twitterDescription: $('meta[name="twitter:description"]').attr('content'),
            twitterImage: $('meta[name="twitter:image"]').attr('content'),
            robots: $('meta[name="robots"]').attr('content'),
            author: $('meta[name="author"]').attr('content'),
            viewport: $('meta[name="viewport"]').attr('content')
        };

        res.json(metadata);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching metadata', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
