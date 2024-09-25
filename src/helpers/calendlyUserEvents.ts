import { auth } from "@/auth";

const ACCESS_TOKEN = process.env.CALENDLY_ACCESS_TOKEN;
export async function fetchScheduledEvents() {
  const organizationUri = await fetchUserOrganizationUri();
  const session = await auth();
  const res = await fetch(
    `https://api.calendly.com/scheduled_events?organization=${organizationUri}&invitee_email=${session?.user.email}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch scheduled events from Calendly.");
  }
  const data = await res.json();
  return data.collection;
}
const fetchUserOrganizationUri = async () => {
  const response = await fetch("https://api.calendly.com/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.resource.current_organization;
};
