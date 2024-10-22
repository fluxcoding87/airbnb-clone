"use client";

import { useEffect, useState } from "react";

const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [isMounting, setIsMounting] = useState(false);

  useEffect(() => {
    setIsMounting(true);
  }, []);

  if (!isMounting) {
    return null;
  }

  return <>{children}</>;
};

export default ClientOnly;
