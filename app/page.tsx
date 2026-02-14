export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-8">
        {/* Logo */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gradient">
            StayMatch
          </h1>
          <p className="text-xl text-muted-foreground">
            Stop searching. Start matching.
          </p>
        </div>

        {/* Description */}
        <p className="text-lg text-muted-foreground leading-relaxed">
          AI-powered accommodation matching that learns what you actually want.
          No filters. No 500 results. Just your perfect match.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/onboarding" className="btn-primary">
            Find Your Match
          </a>
          <a href="/login" className="btn-secondary">
            Sign In
          </a>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="card text-left">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-foreground mb-1">
              Preference Learning
            </h3>
            <p className="text-sm text-muted-foreground">
              Swipe through hotels to build your taste profile
            </p>
          </div>
          <div className="card text-left">
            <div className="text-2xl mb-2">✓</div>
            <h3 className="font-semibold text-foreground mb-1">
              Truth Engine
            </h3>
            <p className="text-sm text-muted-foreground">
              Verified WiFi speeds, noise levels, and real photos
            </p>
          </div>
          <div className="card text-left">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-semibold text-foreground mb-1">
              AI Matching
            </h3>
            <p className="text-sm text-muted-foreground">
              3-5 curated matches with &quot;why this fits you&quot;
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm text-muted-foreground pt-8">
          Launching in Lisbon, Bali, and Bangkok
        </p>
      </div>
    </main>
  );
}
