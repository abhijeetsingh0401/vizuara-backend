const express = require('express');
const router = express.Router();
const { generateWorksheetPrompt } = require('../utils/prompts');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {

    console.log("inside worksheet generator")

    try {
        const { gradeLevel, numberOfQuestions, hardQuestions, mediumQuestions, easyQuestions, questionTypes, questionText} = req.body;

        console.log(gradeLevel, numberOfQuestions, hardQuestions, mediumQuestions, easyQuestions, questionTypes, questionText);
        
        const prompt = generateWorksheetPrompt(gradeLevel, numberOfQuestions, questionTypes, hardQuestions, mediumQuestions, easyQuestions, questionText);

        const result = await generateWorksheetQuestions(prompt);
        if (result) {
            console.log("RESULT:", result);
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

async function generateWorksheetQuestions(prompt){
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: "json_object" },
        });

        let questionsText = response.choices[0].message.content.trim();
        // const startIndex = questionsText.indexOf('[');
        // const endIndex = questionsText.lastIndexOf(']') + 1;

        // if (startIndex === -1 || endIndex === -1) {
        //     throw new Error("JSON array not found in the response");
        // }

        // // Extract and clean the JSON array
        // questionsText = questionsText.substring(startIndex, endIndex);
        // console.log("Native TEXT:", response.choices[0].message.content);

        // console.log("Trimmed Question:", questionsText);

        const questionParse = JSON.parse(questionsText);
        
        return questionParse;
    } catch (error) {
        console.error('Error generating questions:', error);
        return null;
    }
}