import { auth } from "@/auth";
import { ProfessorRepository } from "@/repositories/professorRepository";
import { db } from "@/drizzle/db";

const ACCESS_TOKEN = process.env.CALENDLY_ACCESS_TOKEN;
export async function fetchInviteeDetails(eventId: string, email: string) {
  const url = `https://api.calendly.com/scheduled_events/${eventId}/invitees?invitee_email=${email}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(
        ` Failed to fetch invitee details for event ${eventId}:,response.statusText`
      );
      return {};
    }
    const data = await response.json();
    const currentInviteeDetails = data.collection;
    return currentInviteeDetails || {};
  } catch (error) {
    console.error("Error fetching invitee details:", error);
    return {};
  }
}
export async function fetchScheduledEvents() {
  try {
    const organizationUri = await fetchUserOrganizationUri();
    const session = await auth();

    const res = await fetch(
      `https://api.calendly.com/scheduled_events?organization=${organizationUri}&invitee_email=${encodeURIComponent(
        session?.user?.email!
      )}`,
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
    // Append invitee details to each event
    const updatedEvents = await Promise.all(
      data.collection.map(async (event: any) => {
        const [inviteeDetails] = await fetchInviteeDetails(
          event.uri.split("/").pop()!,
          session?.user?.email!
        );

        return {
          ...event,
          cancel_url: inviteeDetails.cancel_url,
          reschedule_url: inviteeDetails.reschedule_url,
        };
      })
    );
    return updatedEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return null;
  }
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
export async function sendInvitation(email: string) {
  const orgUrl = await fetchUserOrganizationUri();
  const orgId = orgUrl.split("/").pop();

  const response = await fetch(
    `https://api.calendly.com/organizations/${orgId}/invitations`,
    {
      method: "POST", // Specify the request method as POST
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        email: email,
      }),
    }
  );
}
export async function checkInvitationStatus(email: string) {
  const orgUrl = await fetchUserOrganizationUri();
  const orgId = orgUrl.split("/").pop();
  const response = await fetch(
    `https://api.calendly.com/organizations/${orgId}/invitations`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  const invitation = data.collection.find((inv: any) => inv.email === email);

  if (invitation && invitation.status === "accepted") {
    return { accepted: true, userUri: invitation.user };
  }

  return { accepted: false };
}
export async function fetchUserDetails(userUri: string) {
  const response = await fetch(userUri, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data.resource;
}
export async function updateProfessorCalendlyInfo(
  professorId: number,
  schedulingUrl: string
) {
  const professorRepository = new ProfessorRepository(db);
  await professorRepository.updateProfessor(professorId, {
    calendly_link: schedulingUrl,
  });
}
