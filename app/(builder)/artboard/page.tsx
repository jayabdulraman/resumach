import { BuilderLayout } from './pages/builder';

interface BuilderLayoutProps {
  userId: string
}

export function ResumeBuilder({userId}: BuilderLayoutProps) {
  
  return (
    <BuilderLayout userId={userId} />
  )
}
