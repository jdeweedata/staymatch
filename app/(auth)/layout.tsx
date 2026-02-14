import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-display font-bold text-gradient">
              StayMatch
            </h1>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            Stop searching. Start matching.
          </p>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
