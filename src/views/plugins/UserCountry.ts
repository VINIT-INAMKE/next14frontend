const getLocationByIP = async (): Promise<string> => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    if (data.error) {
      throw new Error(data.reason || "Failed to get location from IP");
    }
    return data.country_name || "Unknown";
  } catch (error) {
    console.error("IP Geolocation error:", error);
    return "Unknown";
  }
};

const getLocationByGPS = (): Promise<string> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(getLocationByIP());
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos: GeolocationPosition) => {
        try {
          const { latitude, longitude } = pos.coords;
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
          
          const response = await fetch(url);
          const data = await response.json();
          
          if (!data.address?.country) {
            throw new Error("Country not found in response");
          }

          resolve(data.address.country);
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          // Fallback to IP-based geolocation
          const country = await getLocationByIP();
          resolve(country);
        }
      },
      async (error: GeolocationPositionError) => {
        console.error("Geolocation error:", error);
        // Fallback to IP-based geolocation
        const country = await getLocationByIP();
        resolve(country);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
};

const GetCurrentAddress = async (): Promise<string> => {
  if (typeof window === "undefined") return "Unknown";
  return getLocationByGPS();
};

export default GetCurrentAddress;
