export const getGeolocation = (callback, fallback = "Montreal City Center") => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => callback(`${coords.latitude},${coords.longitude}`),
        () => callback(fallback)
      );
    } else {
      callback(fallback);
    }
  };
  