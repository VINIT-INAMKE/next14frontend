import { useState, useEffect } from "react";

const GetCurrentAddress = (): { country: string; loading: boolean; error: string } => {
  const [country, setCountry] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return; 

    navigator.geolocation.getCurrentPosition(
      (pos: GeolocationPosition) => {
        const { latitude, longitude } = pos.coords;

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            const countryName = data.address?.country || "Unknown";
            setCountry(countryName);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error fetching location:", err);
            setError("Failed to fetch country");
            setLoading(false);
          });
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Permission denied");
        setLoading(false);
      }
    );
  }, []);

  return { country, loading, error };
};

export default GetCurrentAddress;
