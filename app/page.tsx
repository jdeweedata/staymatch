import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingPage from "./LandingPage";

export default async function Page() {
  const user = await getCurrentUser();

  // Authenticated users go to matches
  if (user) {
    redirect("/matches");
  }

  // Show marketing landing page to visitors
  return <LandingPage />;
}
