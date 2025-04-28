# **App Name**: DocuChat Anonymous

## Core Features:

- Anonymous PDF Upload: Implement a drag-and-drop interface for PDF uploads and display document upload progress.
- AI Chat: Use AI to generate answers based on the document content. The LLM will use a tool to retrieve relevant chunks using semantic search.
- Chat Interface: Design a chat interface to display questions, AI responses and document references.

## Style Guidelines:

- Primary color: White or light gray for a clean background.
- Secondary color: Dark gray or black for text to ensure readability.
- Accent: Teal (#008080) for interactive elements and highlights.
- Use a clean, single-column layout for the chat interface to focus user attention.
- Simple, modern icons for upload and send buttons.

## Original User Request:
Build a Chat-to-Document AI app that allows users to upload documents (PDFs) anonymously and ask questions about the document content in a chat interface. No user authentication or accounts are required. Each session is temporary and isolated, with documents and chat data stored only for the duration of the session or a limited time.
1. Core Concept

    Users upload a document (PDF) anonymously.
    The app extracts and processes the document text.
    Users ask questions in natural language.
    The AI answers based on the document content.
    The interaction is presented as a chat interface, similar to ChatPDF.
    No user accounts or persistent login; all data is session-based.

2. User Flow

    Landing Page / Upload Screen:
        User is prompted to upload a PDF document.
        Drag-and-drop or file picker available.
        Supported file types clearly indicated.
        No login/signup required.

    Document Processing:
        On upload, the document is sent to Firebase Storage.
        A Cloud Function triggers:
            Extracts text from the PDF.
            Splits text into chunks.
            Generates embeddings for semantic search.
            Stores embeddings and metadata temporarily in Firestore with a unique session ID.

    Chat Interface:
        After processing, the user is taken to a chat screen tied to the current session.
        User asks questions about the document.
        Each question triggers a backend call:
            Retrieves relevant chunks using semantic search.
            AI generates an answer based on the document.
        Answers are displayed in the chat UI.

    Session Management:
        Each session has a unique ID (e.g., UUID).
        Data (documents, embeddings, chat history) stored with this session ID.
        Data is automatically deleted after a set expiration time (e.g., 24 hours) via scheduled Cloud Functions or TTL policies.
        Users can refresh or close the browser to end the session.

3. Firebase Services Utilization

    Firebase Storage: Store uploaded PDFs temporarily.
    Firestore Database: Store document metadata, text chunks, embeddings, and chat history linked to session ID.
    Cloud Functions:
        Extract text and generate embeddings on upload.
        Handle AI question-answering requests.
        Scheduled cleanup of expired sessions and data.
    Hosting: Serve the frontend app.

4. UI/UX Details

General Style:
Clean, minimalistic, modern chat app style with clear visual hierarchy.

A. Landing / Upload Screen:

    Large drag-and-drop area with instructions:
    “Upload your PDF document to start chatting with it.”
    File picker button.
    Supported file types note: “PDF files only.”
    No login/signup prompts.
    After upload, show progress and then transition to chat.

B. Chat Interface:

    Header:
        Show document name.
        Button to upload a new document (starts a new session).
        Optional: session timer or expiration notice.

    Chat History:
        Scrollable message list.
        User messages aligned right with distinct background.
        AI responses aligned left with different background.
        Optional timestamps.
        AI answers can optionally show a snippet or page reference.

    Input Area:
        Multi-line text input with placeholder: “Ask a question about this document…”
        Send button.
        Disabled with loading indicator while waiting for AI response.

C. Session Expiry Handling:

    Notify user if session expires or data is deleted.
    Option to upload a new document to start fresh.

5. Additional Notes

    Since no user accounts exist, all data is ephemeral and tied to the session.
    Security: Ensure uploaded documents and data are isolated per session and deleted promptly.
    Scalability: Use Firestore TTL or scheduled Cloud Functions to clean up old sessions.
    Optionally, store session ID in browser local storage or URL to allow session persistence during the browser session.

Summary

This app provides a frictionless, anonymous experience for users to upload documents and chat with them using AI, without any login or signup. The UI is simple and intuitive, focusing on document upload and chat interaction, with backend powered by Firebase Storage, Firestore, and Cloud Functions managing ephemeral session data.
  