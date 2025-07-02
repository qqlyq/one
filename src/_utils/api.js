export const fetchActivities = async (generateRequestBody) => {
    try {
        console.log("Sending request body:", generateRequestBody);
        const response = await fetch("http://127.0.0.1:8002/api/generate_plan", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-User-Name": "testDan",
                "X-User-Id": "681a6db71771cb427864f564", //TODO: replace with dynamic user ID
            },
            body: JSON.stringify(generateRequestBody),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
    } catch (error) {
        console.error("Error fetching activities:", error);
        throw error;
    }
};

export const fetchActivities2 = async (generateRequestBody) => {
    try {
        console.log("Sending request body2:", generateRequestBody);
        const response = await fetch("http://127.0.0.1:8002/api/activities", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-User-Name": "testDan",
                "X-User-Id": "681a6db71771cb427864f564", //TODO: replace with dynamic user ID
            },
            body: JSON.stringify(generateRequestBody),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
    } catch (error) {
        console.error("Error fetching activities:", error);
        throw error;
    }
};

export const update_arrival_day = async (requestBody) => {
    try {
        const response = await fetch("https://citygetaway-backend-plan-service.vercel.app/api/update_arrival_day", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-User-Name": "testDan",
                "X-User-Id": "681a6db71771cb427864f564", //TODO: replace with dynamic user ID
            },
            body: JSON.stringify(requestBody),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
    } catch (error) {
        console.error("Error fetching activities:", error);
        throw error;
    }
}
export const updatePlanInDB = async (plan_id, activities, startDate, endDate, arrival_time) => {
    const requestBody = {
        plan_id: plan_id,
        arrival_time: arrival_time,
        multi_day_plan: activities,
        start_date: startDate,
        end_date: endDate,
    };

    try {
        const response = await fetch(`https://citygetaway-backend-plan-service.vercel.app/api/save_plan`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-User-Name": "testDan",
                "X-User-Id": "681a6db71771cb427864f564", //TODO: replace with dynamic user ID
            },
            body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
            throw new Error("Failed to update plan");
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating plan:", error);
    }
};

export const fetchEveningRecommendations = async (activities, dayIndex, user_input) => {
    try {
        const response = await fetch("https://citygetaway-backend-plan-service.vercel.app/api/get_evening_recommendations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-Name": "testDan",
                "X-User-Id": "681a6db71771cb427864f564",
            },
            body: JSON.stringify({
                multi_day_itinerary: activities,
                question: user_input,
            }),
        });
        const data = await response.json();
        return data.recommendations;
    } catch (error) {
        console.error("Error fetching night activities:", error);
        throw error;
    }
};

export const changeActivity = async (requestBody) => {
    try {
        const response = await fetch("https://citygetaway-backend-plan-service.vercel.app/api/change_activity", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-User-Name": "testDan",
                "X-User-Id": "681a6db71771cb427864f564", //TODO: replace with dynamic user ID
            },
            body: JSON.stringify(requestBody),
        });
        return response.ok ? await response.json() : false;
    } catch (error) {
        console.error("Error fetching activities:", error.message || "Unknown error");
        return false;
    }
};

export const askChatbot = async (question, dayIndex, activities) => {
    try {
        const response = await fetch("https://citygetaway-backend-plan-service.vercel.app/api/chatbot_ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "question": question,
                "day_index": dayIndex,
                "multi_day_itinerary": activities
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch chatbot response");
        }

        const data = await response.json();
        return data.answer || "No response from the server.";
    } catch (error) {
        console.error("Error in askChatbot:", error);
        throw new Error("An error occurred while fetching the response.");
    }
};
