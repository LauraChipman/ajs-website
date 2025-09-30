// backend/routes/social.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID;
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;

router.get('/', async (req, res) => {
    console.log("🌐 /api/social called");
    console.log("🔑 ENV:", {
        INSTAGRAM_ACCESS_TOKEN,
        INSTAGRAM_USER_ID,
        FACEBOOK_ACCESS_TOKEN,
        FACEBOOK_PAGE_ID
    });
    const noCreds =
        !INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID ||
        !FACEBOOK_ACCESS_TOKEN || !FACEBOOK_PAGE_ID;

    if (noCreds) {
        console.warn("⚠️ Missing social media credentials. Returning mock data.");

        return res.status(200).json({
            instagram: [
                { image: 'https://dummyimage.com/300x300/000/fff&text=Insta1', link: '#' },
                { image: 'https://dummyimage.com/300x300/111/fff&text=Insta2', link: '#' },
            ],
            facebook: [
                { image: 'https://dummyimage.com/300x300/222/fff&text=FB1', link: '#' },
                { image: 'https://dummyimage.com/300x300/444/fff&text=FB2', link: '#' },
            ]
        });
    }

    try {
        // Real Instagram API call
        const instaRes = await axios.get(
            `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media`,
            {
                params: {
                    fields: 'id,caption,media_url,permalink,media_type,timestamp',
                    access_token: INSTAGRAM_ACCESS_TOKEN
                }
            }
        );

        // Real Facebook API call
        const fbRes = await axios.get(
            `https://graph.facebook.com/${FACEBOOK_PAGE_ID}/posts`,
            {
                params: {
                    access_token: FACEBOOK_ACCESS_TOKEN,
                    fields: 'message,created_time,permalink_url'
                }
            }
        );

        res.status(200).json({
            instagram: instaRes.data.data.map(post => ({
                image: post.media_url,
                link: post.permalink
            })),
            facebook: fbRes.data.data.map(post => ({
                image: 'https://dummyimage.com/300x300/333/fff&text=FB', // No image from FB by default
                link: post.permalink_url
            }))
        });
    } catch (err) {
        console.error('❌ Error fetching social media:', err.message);
        res.status(500).json({ message: 'Social media fetch failed' });
    }
});

module.exports = router;