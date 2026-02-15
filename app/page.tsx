import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingPage from "./LandingPage";

export default async function Page() {
  try {
    const user = await getCurrentUser();

    // Authenticated users go to matches
    if (user) {
      redirect("/matches");
    }
  } catch (error) {
    // Log error but continue to show landing page
    console.error("Auth check failed:", error);
  }

  // Show marketing landing page to visitors (and on auth errors)
  return <LandingPage />;
}
