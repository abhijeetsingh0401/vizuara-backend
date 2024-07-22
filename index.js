const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000'
}));

// Import routes
const reportCardRoute = require('./routes/reportCardRoute');
const lessonPlannerRoute = require('./routes/lessonPlannerRoute');
const pptGeneratorRoute = require('./routes/pptGeneratorRoute') 
const proofReaderRoute = require('./routes/proofReaderRoute');
const rewriteRoute = require('./routes/rewriteRoute');
const essayGraderRoute = require('./routes/essayGraderRoute');
//const translatorRoute = require('./routes/translatorRoute');
const textSummarizerRoute = require('./routes/textSummarizerRoute');
const textDependentQuestionRoute = require('./routes/textDependentQuestionRoute');
const workSheetGeneratorRoute = require('./routes/workSheetGeneratorRoute');
const mcqGeneratorRoute = require('./routes/mcqGeneratorRoute');
// Add other routes as needed

//youtube

// Use routes
app.use('/api/report-card', reportCardRoute);
app.use('/api/lesson-planner', lessonPlannerRoute);
app.use('/api/ppt-generator', pptGeneratorRoute);
app.use('/api/proof-reader', proofReaderRoute);
app.use('/api/rewrite', rewriteRoute);
app.use('/api/essay-grader', essayGraderRoute);
//app.use('/api/translator', translatorRoute);
app.use('/api/text-summarizer', textSummarizerRoute);
app.use('/api/text-dependent-question', textDependentQuestionRoute);
app.use('/api/worksheet-generator', workSheetGeneratorRoute);
app.use('/api/mcq-generator', mcqGeneratorRoute);

// Add other routes as needed

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
