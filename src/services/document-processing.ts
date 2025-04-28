/**
 * Represents a document with its metadata.
 */
export interface DocumentMetadata {
  /**
   * The name of the document.
   */
  name: string;
}

/**
 * Asynchronously extracts text from a document.
 *
 * @param file The document file to extract text from.
 * @returns A promise that resolves to the extracted text from the document.
 */
export async function extractTextFromDocument(file: File): Promise<string> {
  // TODO: Implement this by calling an API.
  // Simulate async call
  await new Promise(resolve => setTimeout(resolve, 500));
  return 'This is the extracted text from the document.';
}
