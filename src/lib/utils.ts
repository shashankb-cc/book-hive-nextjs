import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const day = daysOfWeek[date.getUTCDay()];
  const fullDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
  const time = date.toISOString().split("T")[1].split(".")[0]; // HH:MM:SS

  return `${day}, ${fullDate}, ${time}`;
};

// Function to get epoch time
  // export const getEpochTime = (date: Date) => {
  //   return date.getTime(); // Returns the time in milliseconds since the Unix epoch
  // };

// Function to format the epoch time for display
// export const formatDate = (epochTime: number) => {
//   const date = new Date(epochTime); // Convert epoch back to Date object
//   const daysOfWeek = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];

//   const day = daysOfWeek[date.getDay()]; // Local day
//   const fullDate = date.toLocaleDateString("en-CA"); // YYYY-MM-DD in local timezone
//   const time = date.toLocaleTimeString("en-GB", { hour12: false }); // HH:MM:SS in local timezone

//   return `${day}, ${fullDate}, ${time}`;
// };

// const now = new Date();
// const epochTime = getEpochTime(now); // Store this in your database
// const formattedDate = formatDate(epochTime); // Use this for displaying the formatted date

// console.log(epochTime); // Example: 1693910400000
// console.log(formattedDate); // Example: "Tuesday, 2024-09-05, 14:30:00"
