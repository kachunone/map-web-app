export async function fetchTimeZoneInfo(coordinates) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/timezone/json?location=${
        coordinates.lat
      },${coordinates.lng}&timestamp=${timestamp}&key=${
        import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY
      }`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.timeZoneId);

    const localTime = new Date(
      (timestamp + data.dstOffset + data.rawOffset) * 1000
    ).toUTCString();

    return {
      timeZone: data.timeZoneName,
      localTime: localTime,
    };
  } catch (error) {
    console.error("Error fetching time zone data:", error);
    throw error;
  }
}
