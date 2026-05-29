# Resumach

Tailor your resume easily with an intelligent resume builder and editor.

## Overview

Resumach is a modern web application that helps you create, customize, and manage professional resumes. With an intuitive interface and powerful tools, you can tailor your resume for different job applications quickly and efficiently.

## Features

- **Resume Builder**: Create beautiful, professional resumes from scratch
- **AI-Powered Customization**: Leverage AI to tailor your resume content
- **Real-time Editor**: Edit and preview your resume in real-time
- **Multiple Templates**: Choose from various professionally designed templates
- **PDF Export**: Download your resume as a high-quality PDF
- **Drag & Drop**: Easily rearrange resume sections with drag-and-drop functionality
- **Dark Mode**: Built-in dark theme support
- **Cloud Storage**: Save and sync your resumes with Supabase
- **Form Validation**: Smart form validation with Zod
- **Rich Text Editing**: Format your content with Tiptap editor

## Tech Stack

### Frontend
- **Next.js 14**: React framework for production
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component library
- **Framer Motion**: Animation library
- **React Hook Form**: Efficient form handling

### Backend & Services
- **Supabase**: Backend-as-a-service with PostgreSQL
- **OpenAI API**: AI-powered content generation
- **Stripe**: Payment processing
- **Upstash Redis**: Caching and rate limiting

### Document Processing
- **jsPDF & html2pdf**: PDF generation
- **Puppeteer**: Server-side PDF rendering
- **Tiptap**: Rich text editor
- **Mammoth**: Word document parsing

### UI & Icons
- **@phosphor-icons**: Icon library
- **@radix-ui**: Component library
- **Lucide React**: Additional icons
- **React Icons**: Popular icon sets

### Utilities
- **Zustand**: State management
- **TanStack Query**: Data fetching and caching
- **Immer**: Immutable state updates
- **date-fns**: Date utilities

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Supabase account
- OpenAI API key
- Stripe account (optional, for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jayabdulraman/resumach.git
   cd resumach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## Project Structure

```
resumach/
├── app/              # Next.js app directory
├── components/       # Reusable React components
├── pages/           # API routes and pages
├── lib/             # Utility functions and helpers
├── types/           # TypeScript type definitions
├── styles/          # Global styles and Tailwind config
└── public/          # Static assets
```

## Key Features Explained

### Resume Editor
The drag-and-drop resume editor allows you to organize sections intuitively. Sections can be reordered using the built-in DnD Kit integration.

### AI Integration
Use OpenAI API to generate tailored bullet points and descriptions based on your job description. The AI helps optimize your resume content for applicant tracking systems (ATS).

### PDF Generation
Export your resume as a PDF with professional formatting using jsPDF and html2canvas. For server-side rendering, Puppeteer is available.

### Authentication
Secure user authentication powered by Supabase, supporting email/password and OAuth providers.

## Configuration

### Tailwind CSS
Customized Tailwind configuration with:
- Custom color schemes
- Animation utilities
- Container queries support

### TypeScript
Strict TypeScript configuration for type safety and better development experience.

## API Integration

### Supabase
- User authentication
- Resume data storage
- Real-time synchronization

### OpenAI
- Content generation
- Resume optimization suggestions

### Stripe
- Payment processing for premium features

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private. Please check with the owner for licensing information.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the maintainer.

## Roadmap

- [ ] Enhanced AI recommendations
- [ ] More resume templates
- [ ] Collaboration features
- [ ] Mobile app
- [ ] Letter templates
- [ ] Interview prep tools

---

**Built with ❤️ by [jayabdulraman](https://github.com/jayabdulraman)**
