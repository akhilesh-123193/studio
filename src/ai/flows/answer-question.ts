'use server';
/**
 * @fileOverview An AI agent that answers questions about the content of the uploaded document.
 *
 * - answerQuestion - A function that handles the question answering process.
 * - AnswerQuestionInput - The input type for the answerQuestion function.
 * - AnswerQuestionOutput - The return type for the answerQuestion function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnswerQuestionInputSchema = z.object({
  question: z.string().describe('The question about the document content.'),
  sessionId: z.string().describe('The ID of the current session.'),
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

const AnswerQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  return answerQuestionFlow(input);
}

const getRelevantChunks = ai.defineTool({
  name: 'getRelevantChunks',
  description: 'Retrieves relevant chunks from the document based on the question using semantic search.',
  inputSchema: z.object({
    question: z.string().describe('The question to find relevant chunks for.'),
    sessionId: z.string().describe('The ID of the current session.'),
  }),
  outputSchema: z.array(z.string()).describe('An array of relevant text chunks from the document.'),
},
async input => {
    // TODO: Implement this by calling the semantic search.
    return ['This is the relevant text from the document.'];
});

const prompt = ai.definePrompt({
  name: 'answerQuestionPrompt',
  input: {
    schema: z.object({
      question: z.string().describe('The question about the document content.'),
      relevantChunks: z.array(z.string()).describe('The relevant chunks from the document.'),
    }),
  },
  output: {
    schema: z.object({
      answer: z.string().describe('The answer to the question.'),
    }),
  },
  prompt: `You are an AI assistant that answers questions based on the content of the document.

  Question: {{{question}}}

  Relevant Document Content:
  {{#each relevantChunks}}
  {{this}}
  {{/each}}

  Answer: `,
  tools: [getRelevantChunks]
});

const answerQuestionFlow = ai.defineFlow<
  typeof AnswerQuestionInputSchema,
  typeof AnswerQuestionOutputSchema
>({
  name: 'answerQuestionFlow',
  inputSchema: AnswerQuestionInputSchema,
  outputSchema: AnswerQuestionOutputSchema,
}, async input => {
  const {output} = await prompt({
    question: input.question,
    relevantChunks: await getRelevantChunks({
      question: input.question,
      sessionId: input.sessionId
    })
  });
  return output!;
});
