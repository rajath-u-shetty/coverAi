// // pages/api/generate-cover-letter.js
// import { Configuration, OpenAIApi } from 'openai';
//
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
//
// const openai = new OpenAIApi(configuration);
//
// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { text } = req.body;
//
//     const response = await openai.createCompletion({
//       model: 'text-davinci-003',
//       prompt: `Generate a cover letter based on the following resume text:\n\n${text}`,
//       temperature: 0.7,
//       max_tokens: 1024,
//       top_p: 1,
//       frequency_penalty: 0,
//       presence_penalty: 0,
//     });
//
//     res.status(200).json({ coverLetter: response.data.choices[0].text });
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }
