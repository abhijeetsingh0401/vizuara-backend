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

module.exports = { reportCardPrompt, LessonPlanPrompt, pptGeneratorPrompt, proofReaderPrompt };
