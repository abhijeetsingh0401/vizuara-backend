const { google } = require('googleapis');
const { getSubtitles } = require('youtube-captions-scraper');
const { parse } = require('url');

const express = require('express');
const router = express.Router();
const { youtubeGeneratorPrompt } = require('../utils/prompts');

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
    try {
        const { gradeLevel, numberOfQuestions, questionTypes, videoIdOrURL, hardQuestions, mediumQuestions, easyQuestions } = req.body;
        const { videoId, captionsAvailable } = await checkTranscriptAvailability(videoIdOrURL, process.env.YTAPI_KEY);

        if (!videoId) {
            return res.status(400).json({ error: 'Invalid video ID' });
        }

        let transcript = null;

        if (captionsAvailable) {
            transcript = await fetchTranscript(videoId);
        }

        if (!transcript) {
            return res.status(400).json({ error: 'Transcript not available' });
        }

        const prompt = youtubeGeneratorPrompt(gradeLevel, numberOfQuestions, questionTypes, hardQuestions, mediumQuestions, easyQuestions, transcript);

        console.log("PROMPT:", prompt)
        
        const result = await generateYoutubeQuestions(prompt);

        console.log("RESULTS:", result)
        
        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(500).json({ error: 'Failed to generate questions' });
        }
    } catch (error) {
        console.error('Error in POST handler:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

function normalizeUrl(videoUrl) {
    try {
        const parsedUrl = parse(videoUrl, true);
        let videoId = '';

        if (parsedUrl.hostname === 'youtu.be') {
            videoId = parsedUrl.pathname.substring(1);
            return `https://www.youtube.com/watch?v=${videoId}`;
        } else if (parsedUrl.hostname === 'www.youtube.com' || parsedUrl.hostname === 'youtube.com') {
            return videoUrl;
        } else {
            throw new Error('Invalid YouTube URL');
        }
    } catch (error) {
        console.error('Error normalizing URL:', error);
        throw new Error('Invalid YouTube URL');
    }
}

function getVideoIdFromUrl(videoUrl) {
    try {
        const normalizedUrl = normalizeUrl(videoUrl);
        const parsedUrl = parse(normalizedUrl, true);
        const videoId = parsedUrl.query.v || parsedUrl.pathname.split('/').pop();

        if (!videoId) {
            throw new Error('Invalid video ID');
        }

        return videoId;
    } catch (error) {
        console.error('Error extracting video ID from URL:', error);
        throw new Error('Invalid YouTube URL');
    }
}

async function checkTranscriptAvailability(videoUrl, apiKey) {
    const videoId = getVideoIdFromUrl(videoUrl);

    if (!videoId) {
        console.error('Invalid video URL');
        return { videoId: null, captionsAvailable: false };
    }

    const youtubeClient = google.youtube({
        version: 'v3',
        auth: apiKey,
    });

    try {
        const response = await youtubeClient.captions.list({
            part: 'snippet',
            videoId,
        });

        return {
            videoId,
            captionsAvailable: response.data.items && response.data.items.length > 0,
        };
    } catch (error) {
        console.error('Error fetching captions:', error);
        return { videoId, captionsAvailable: false };
    }
}

async function fetchTranscript(videoId) {
    try {
        const subtitles = await getSubtitles({
            videoID: videoId,
            lang: 'en',
        });
        return subtitles.map(subtitle => subtitle.text).join(' ');
    } catch (error) {
        console.error('Error fetching transcript:', error);
        return null;
    }
}

async function generateYoutubeQuestions(prompt){
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: "json_object" },
        });

        const questionsText = response.choices[0].message.content.trim();
        return JSON.parse(questionsText);
    } catch (error) {
        console.error('Error generating questions:', error);
        return null;
    }
}