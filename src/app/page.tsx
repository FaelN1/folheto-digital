// src/app/(site)/page.tsx ou src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/auth/login');
  return null; // Não renderiza nada
}
