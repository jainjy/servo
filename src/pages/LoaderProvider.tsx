import { useEffect, useState } from "react";
import PageLoader from "@/components/Loading/PageLoader";

export default function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <PageLoader isLoading={isLoading} type="logo">
      {children}
    </PageLoader>
  );
}