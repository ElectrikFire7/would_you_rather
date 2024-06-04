import { promises as fs } from 'fs';
import axios from 'axios';

const user_id = '665b6c0d6f4ff4ef502a8083';
const username = 'General Kenobi';
const anonymous = false;
const description = 'Would you rather';

const createQuestion = (option1, option2) => {
    axios.post('https://would-you-rather-ku9r.onrender.com/question/newQuestion', {
        description,
        option1,
        option2,
        anonymous,
        username,
        user_id
    })
    .catch((error) => {
        console.log(error.message);
    });
}


async function parseQuestions(filename) {
  try {
    // Read the text file
    const data = await fs.readFile(filename, 'utf8');

    // Split the text into lines
    const lines = data.split('\n');

    // Array to store parsed questions
    const parsedQuestions = [];

    // Loop through each line
    for (const line of lines) {
      // Split the line into three parts based on "Would you rather" and "or"
      const sanitizedLine = line.replace(/[?,]/g, '');
      const [wouldYouRather, middlePart, nextPart] = sanitizedLine.split(/Would you rather | or /);

      // Store the parts in a structured format
      parsedQuestions.push({
        wouldYouRather: wouldYouRather.trim(),
        middlePart: middlePart.trim(),
        nextPart: nextPart.trim()
      });
    }

    // Loop through each parsed question and create a question
    for (const question of parsedQuestions) {
      console.log(question);  
      // const option1 = question.middlePart;
        // const option2 = question.nextPart;
        // createQuestion(option1, option2);
    }
    
    return parsedQuestions;
  } catch (err) {
    console.error('Error reading file:', err);
    throw err;
  }
}

// Example usage
parseQuestions('wyr_data.txt')
  .then(parsedQuestions => {
    // Do something with the parsed questions
  })
  .catch(err => {
    // Handle errors
  });
