import { promises as fs } from 'fs';
import axios from 'axios';

const user_id = '665b6c0d6f4ff4ef502a8083';
const username = 'General Kenobi';
const anonymous = false;
const description = 'Would you rather';
const image1 = null;
const image2 = null;

const createQuestion = (option1, option2) => {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('option1', option1 || '');
  formData.append('option2', option2 || '');
  formData.append('image', image1);
  formData.append('image', image2);
  formData.append('user_id', user_id);
  formData.append('username', username);
  formData.append('anonymous', anonymous);  
  axios.post('http://localhost:443/createQuestion', formData)
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
      // Remove unwanted characters
      const sanitizedLine = line.replace(/[?,]/g, '');
      // Split the line into parts
      const parts = sanitizedLine.split(/Would you rather | or /);
    
      if (parts.length === 3) {
        // If we have exactly three parts, proceed
        const [wouldYouRather, middlePart, nextPart] = parts;
    
        // Store the parts in a structured format
        parsedQuestions.push({
          wouldYouRather: wouldYouRather.trim(),
          middlePart: middlePart.trim(),
          nextPart: nextPart.trim()
        });
      } else {
        // Handle the error or log it for debugging
        console.log('Unexpected format:', sanitizedLine);
      }
    }

    // Loop through each parsed question and create a question
    let i = 1;
    for (const question of parsedQuestions) {
      console.log(i, question);  
      const option1 = question.middlePart;
      const option2 = question.nextPart;
      createQuestion(option1, option2);
      i++;
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
