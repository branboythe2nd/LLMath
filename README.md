# AI Chat Interface

A React-based chat interface for text and image interactions with AI, designed to provide a seamless user experience for generating and displaying AI-powered responses.

## Features
- React frontend with TypeScript
- Shadcn UI components
- Text and image input support
- Ready for OpenAI API integration
- In-memory storage for chat interactions

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5000

## Project Structure

- `/client` - Frontend React application
  - `/src/components` - React components
  - `/src/pages` - Page components
  - `/src/lib` - Utility functions
- `/server` - Backend Express server
  - `/lib` - Server utilities
  - `routes.ts` - API routes
  - `storage.ts` - In-memory storage implementation
- `/shared` - Shared types and schemas

## API Integration
The project is set up for OpenAI API integration. To implement the API:

1. Update `server/lib/openai.ts` with your API implementation
2. Uncomment the API code in `server/routes.ts`
3. Remove the mock responses

## Technologies Used
- React
- TypeScript
- Express
- OpenAI API (ready for implementation)
- Shadcn UI
- React Query
- Zod for validation
