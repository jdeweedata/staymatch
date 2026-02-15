import Link from "next/link";
import Image from "next/image";

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
            <Image
              src="/staymatch_logo.svg"
              alt="StayMatch"
              width={180}
              height={45}
              className="h-10 w-auto mx-auto"
            />
          </Link>
          <p className="text-sm text-muted-foreground mt-2">
            Stop searching. Start matching.
          </p>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
