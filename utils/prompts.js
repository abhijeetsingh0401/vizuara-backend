const reportCardPrompt = ({ gradeLevel, studentPronouns, strengths, growths }) => {
  return `
      Generate a detailed evaluation for a student with the following details, include Student Pronouns in all cases:
      
      Grade Level: ${gradeLevel}
      Student Pronouns: ${studentPronouns}
      Strengths: ${strengths}
      Areas for Growth: ${growths}
      
      Format: json
      {
        "Title": "Title for storage",
        "Strength": {
          "subTitle": "Areas of Strength",
          "array": [
            "${studentPronouns} is strong in StrengthContent1",
            "${studentPronouns} excels at StrengthContent2",
            ...
          ]
        },
        "Weakness": {
          "subTitle": "Areas for Growth",
          "array": [
            "${studentPronouns} needs to improve in WeaknessContent1",
            "${studentPronouns} could work on WeaknessContent2",
            ...
          ]
        }
      }
    `;
};

const LessonPlanPrompt = ({ gradeLevel, content, additionalContext, alignedStandard }) => {
  return `
      Generate a lesson plan for the following details:
  
      Grade Level: ${gradeLevel}
      Topic/Standard: ${content}
      ${additionalContext ? `Additional Context: ${additionalContext}` : ""}
      ${alignedStandard ? `Standards Set to Align to: ${alignedStandard}` : ""}
  
      Format: json
      {
        "Title": "TitleContent",
        "Objective": "ObjectiveContent",
        "Assessment": ["AssessmentContent1", "AssessmentContent2", ...],
        "Key Points": ["Keypoint1", "Keypoint2", "Keypoint3", ...],
        "Opening": ["OpeningContent1", "OpeningContent2", "OpeningContent3", ...],
        "Introduction to New Material": ["IntroductionToNewMaterialContent1", "IntroductionToNewMaterialContent2", ...],
        "Guided Practice": ["GuidedPracticeContent1", "GuidedPracticeContent2", ...],
        "Independent Practice": ["IndependentPracticeContent1", "IndependentPracticeContent2", ...],
        "Closing": ["ClosingContent1", "ClosingContent2", ...],
        "Extension Activity": ["ExtensionActivityContent1", "ExtensionActivityContent2", ...],
        "Homework": ["HomeworkContent1", "HomeworkContent2", ...],
        "Standards Addressed": ["StandardsAddressedContent1", "StandardsAddressedContent2", ...]
      }
    `;
};

const pptGeneratorPrompt = (topic) => {
  return `
      Generate a detailed presentation outline on the following topic: ${topic}
      
      Format: json
      {
        "Title": "Presentation Title",
        "Slides1": {
          "subTitle": "Slide 1 Title",
          "array": ["Slide 1 Content", "Slide 1 Content", "Slide 1 Content", "..."]
        },
        "Slides2": {
          "subTitle": "Slide 2 Title",
          "array": ["Slide 2 Content", "Slide 2 Content", "Slide 2 Content", "..."]
        },
        "Slides3": {
          "subTitle": "Slide 3 Title",
          "array": ["Slide 3 Content", "Slide 3 Content", "Slide 3 Content", "..."]
        },
        ...
      }
    `;
};

function proofReaderPrompt(text) {
  const prompt = `Please proofread the following text for grammar, spelling, and punctuation errors. Make any necessary corrections. Also, list the changes made along with explanations for each change:

Text: ${text}

Format: JSON
{
  "Title": "Title for the input text context",
  "OriginalText": {
    "subTitle": "Original Text",
    "array": ["Original text line 1", "Original text line 2", ...]
  },
  "Correct": {
    "subTitle": "Proofread Text",
    "array": ["Proofread text line 1", "Proofread text line 2", ...]
  },
  "Changes": {
    "subTitle": "Changes Made",
    "array": ["Change 1 explanation", "Change 2 explanation", ...]
  }
}`;

  return prompt;
}

function rewritePrompt(originalText, rewriteText, pdfText) {
  let prompt = `Rewrite the following texts in the requested way:
Original Text: ${originalText}`;

  if (pdfText) {
    prompt += `\nPDF Text: ${pdfText}`;
  }

  prompt += `\nRewrite Text in the manner described adher to it strictly: ${rewriteText}\n :
    Format: json
    {
  "Title": "Title Based on Context of the originalText",
  "OriginalText": { "subTitle": "Original Text", "array": ["Sentence 1", "Sentence 2", ...] },
  "ReWrite": { "subTitle": "Rewritten Text", "array": ["Rewritten Sentence 1", "Rewritten Sentence 2", ...] }
}`;
  return prompt;
}

function essayGraderPrompt(gradeLevel, essay) {
  return `
        Please grade the following essay written by a ${gradeLevel} student based on grammar and sentence coherence. The total marks are 10.
        **Essay:**
        ${essay}

        Format:json
        {   
            "Title": "Title based on the Essay Context",
            "totalMarks": {subTitle:"Total Marks", array["10"]} // this is fixed 
             "marks": {
                "subTitle": "Obtained Marks",
                 array[] // "marks": 5 // Example mark, should be dynamically calculated based on the essay, should only contain single element
                },
            "mistakes": {
                "subTitle": "Mistakes",
                "array": [
                    "Incorrect verb tense usage (e.g., goes instead of went, bring instead of brought).",
                    "Lack of proper punctuation and capitalization.",
                    "Subject-verb agreement errors (e.g., 'My sister bring' instead of 'My sister brought').",
                    "Unclear sentence structures affecting readability."
                ]
            },
            "strengths": {
                "subTitle": "Strengths",
                "array": [
                    "The student has good ideas and a clear topic.",
                    "They show enthusiasm for their vacation, which makes the essay engaging."
                ]
            },
            "weaknesses": {
                "subTitle": "Weaknesses",
                "array": [
                    "Frequent grammar errors and a lack of sentence variety.",
                    "The essay also lacks proper punctuation and capitalization in several places."
                ]
            },
            "improvements": {
                "subTitle": "Improvements",
                "array": [
                    "Proper verb tense usage.",
                    "Correct sentence structures to enhance clarity.",
                    "Using a variety of sentences to make the essay more engaging.",
                    "Proper punctuation and capitalization."
                ]
            }
        }
        Use specific examples from the essay to illustrate each point.
    `;
}

function textSummaryPrompt(lengthSummary, inputText) {
  return `Summarize the following inputText after instructions into ${lengthSummary} and make sure to stick to defined lengthSummary. Ensure the summary is clear and concise, and each point is in a separate sentence: ${inputText}

Format: json
{
  "Title": "Generated Summary Title",
  "OriginalText": {
    "subTitle": "Original Text",
    "array": [${JSON.stringify(inputText)}]
  },
  "Summary": {
    "subTitle": "Summary Text",
    "array": []
  }
}`;
}

function textDependentQuestionPrompt(gradeLevel, numberOfQuestions, hardQuestions, mediumQuestions, easyQuestions, questionTypes, questionText) {
  let prompt = `
Generate ${numberOfQuestions} ${questionTypes} questions with correct answers for a ${gradeLevel} grade student. The questions should be divided into three categories: ${hardQuestions} hard questions, ${mediumQuestions} medium questions, and ${easyQuestions} easy questions. Provide an explanation for each question and answer. Provide the output in the following JSON format:

Format: array inside json 
{
"Title":"Context about the questionText in 5 under words",
"Questions":[
{
  "difficulty": "easy",
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "Correct Option",
  "explanation": "Explanation of the correct answer"
},
{
  "difficulty": "medium",
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "Correct Option",
  "explanation": "Explanation of the correct answer"
},
{
  "difficulty": "hard",
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "Correct Option",
  "explanation": "Explanation of the correct answer"
}
]
}
Text:
${questionText}`;

  return prompt;
}

function generateWorksheetPrompt(gradeLevel, numQuestions, questionType, hardQuestions, mediumQuestions, easyQuestions, transcript) {
  return `
You are an experienced educational content creator. I need you to generate a worksheet for students based on the following information:

1. Grade Level: ${gradeLevel}
2. Topic or Text: ${transcript}

Please follow this exact structure and format for the response to ensure uniformity:
Generate ${numQuestions} ${questionType} questions with correct answers for a ${gradeLevel} grade student based on the following video transcript. The questions should be divided into three categories: ${hardQuestions} hard questions, ${mediumQuestions} medium questions, and ${easyQuestions} easy questions. Provide an explanation for each question and answer. Provide the output in the following JSON format:

Format: array inside JSON 
{
"Title":"Context about the questionText in 5 under words",
"Questions":[
{
  "difficulty": "easy or medium or hard", //  based on difficulty
  "question": "Fill in the Blanks Questions Text _____ _____ ____",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "Correct Option",
  "explanation": "Explanation of the correct answer"
}
]
}

Text: ${transcript}
`;
}

module.exports = { reportCardPrompt, LessonPlanPrompt, pptGeneratorPrompt, proofReaderPrompt, rewritePrompt, essayGraderPrompt, textSummaryPrompt, textDependentQuestionPrompt, generateWorksheetPrompt };
