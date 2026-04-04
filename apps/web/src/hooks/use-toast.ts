export function useToast() {
  return {
    toast: ({ title, description, variant }: { title?: string, description?: string, variant?: string }) => {
      console.log(`TOAST: ${title} - ${description} [${variant || 'default'}]`);
      if (typeof window !== 'undefined') {
        alert(`${title}\n${description}`);
      }
    }
  };
}
