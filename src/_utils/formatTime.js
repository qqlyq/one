export const formatTime = (timeString) => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return { hours, minutes };
  };

export const toHHMM = (timeStr) => {
    const [h, m] = timeStr.split(":").map((t) => t.padStart(2, "0"));
    return `${h}:${m}`;
};

export const addHours = (time, hoursToAdd) => {
    const [timePart, modifier] = time.split(" ");
    let [h, m] = timePart.split(":").map(Number);

    if (modifier === "PM" && h !== 12) h += 12;
    if (modifier === "AM" && h === 12) h = 0;

    const date = new Date();
    date.setHours(h + hoursToAdd, m);

    const newHours = date.getHours();
    const newModifier = newHours >= 12 ? "PM" : "AM";
    const formattedHours = newHours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = date.getMinutes().toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${newModifier}`;
};

export const calculateEndTime = (currentActivity, nextActivity) => {
    if (nextActivity?.time) {
        const nextTime = toHHMM(nextActivity.time.split(" ")[0]);
        const nextDate = new Date(`1970-01-01T${nextTime}:00Z`);
        if (!isNaN(nextDate.getTime())) {
            return new Date(nextDate.getTime() - 5 * 60000)
                .toISOString()
                .split("T")[1]
                .slice(0, 5);
        }
    }
    return currentActivity.time.split(" ")[0] || "00:00";
};
