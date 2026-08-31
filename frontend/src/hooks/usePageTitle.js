import { useEffect } from 'react';

// Mantém o título da aba consistente com a marca em todas as páginas.
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Care n' Share` : "Care n' Share";
  }, [title]);
}
