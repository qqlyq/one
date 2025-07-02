import React, {createContext, useEffect, useRef, useState, useContext} from "react";
import {useParams, useLocation} from "react-router-dom";
import requestBody from "../data/mockBody";
import {addHours, calculateEndTime} from "../_utils/formatTime";
import {fetchActivities, update_arrival_day, updatePlanInDB, fetchActivities2} from "../_utils/api";

export const ActivitiesContext = createContext();

export const ActivitiesProvider = ({ children }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [travelTime, setTravelTime] = useState("");
    const [removedActivities, setRemovedActivities] = useState([]);
    const [previousActivities, setPreviousActivities] = useState([]);
    const [newActivities, setNewActivities] = useState([]);
    const [planId, setPlanId] = useState("684c2d3a8e4360cebe0d6003");
    // const { dayNumber } = useParams();
    const { dayNumber: rawDayNumber } = useParams();
const dayNumber = Number(rawDayNumber) || 1;
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 2)));
    const prevActivitiesRef = useRef([]);
    const location = useLocation();
    useEffect(() => {
        console.log("Initial planId state:", planId);
    }, []);
    console.log(location)
    const getDynamicDailyConfig = (startDate, endDate) => {
        let result = {};
        let dayIndex = 0;
        const hardcodedTimes = [
            { start_time: "13:00", end_time: "19:00", preferences: ["Shopping", "Site Seeing"] },
            { start_time: "09:00", end_time: "20:00", preferences: ["Site Seeing"] },
            { start_time: "10:30", end_time: "18:00", preferences: ["Site Seeing"] }
        ];
        let currentDate = new Date(startDate);
        while (startDate <= endDate) {
            const formattedDate = startDate.toISOString().split("T")[0];
            result = { ...result,
                [dayIndex]: {
                    start_time: `${formattedDate} ${hardcodedTimes[dayIndex].start_time}`,
                    end_time: `${formattedDate} ${hardcodedTimes[dayIndex].end_time}`,
                    preferences: hardcodedTimes[dayIndex].preferences
                }
            };
            startDate.setDate(startDate.getDate() + 1); // Increment the date
            dayIndex++;
        }
        return result;
    };

    
    const generateRequestBody = { ...requestBody,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        arrival_time: travelTime,
        // plan_id: planId,
        plan_id: "685ed899b69da8e95c15417d",
        daily_config: getDynamicDailyConfig(
        startDate,
        endDate
    ),
};
const buildRequestBody = () => ({
    ...requestBody,
    start_date: startDate.toISOString().split("T")[0],
    end_date: endDate.toISOString().split("T")[0],
    arrival_time: travelTime,
    plan_id: planId,
    daily_config: getDynamicDailyConfig(startDate, endDate),
  });
    const updatedRequestBody = { ...requestBody,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        arrival_time: travelTime,
        plan_id: planId,
        daily_config: getDynamicDailyConfig(startDate, endDate),
        multi_day_itinerary: activities,
    };
    const buildUpdatedRequestBody = () => ({
        ...requestBody,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        arrival_time: travelTime,
        plan_id: planId,
        daily_config: getDynamicDailyConfig(startDate, endDate),
        multi_day_itinerary: activities,
      });
      
    
    useEffect(() => {
        // if(travelTime) {
            const body = {
                ...generateRequestBody,
                source_page: location.pathname,
              };
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0RGFuIiwidXNlcl9pZCI6IjY4MWE2NzUzMDc3MzQ5NmU4MDFlODhiOCJ9.OF9et0t_eV-1AZQOcyK2obns5KhVnsG3Efl7bBzoSe4"
        const fetchData = async () => {
            try {
              let result;
              result = await fetchActivities2(body); // Use your new API for "/oneday"
                console.log("Data from fetchActivities2:", result);
        
            //   if (location.pathname === "/oneday") {
            //     result = await fetchActivities2(body); // Use your new API for "/oneday"
            //     console.log("Data from fetchActivities2:", result);
            //   } else {
            //     result = await fetchActivities(body); // Use your existing API
            //     console.log("Data from fetchActivities:", result);
            //   }
            //   console.log("result",result.multi_day_itinerary)
        
              setPlanId(result.plan_id);
              setActivities(result.multi_day_itinerary);
              setArrivalTime(result.arrival_time);
              setLoading(false);
            } catch (err) {
              console.error("Fetching error:", err);
              setError(err);
              setLoading(false);
            }
          };
        
          fetchData();
        }, [location.pathname]);
        


    useEffect(() => {
        if (travelTime) {
            update_arrival_day(updatedRequestBody).then(r => {
                setActivities(r.multi_day_itinerary);
                setLoading(false);
                console.log("=====================")
                console.log("2",r.multi_day_itinerary)
                updatePlanInDB(planId, r.multi_day_itinerary, startDate, endDate, travelTime);
            }).catch(error => {
                setError(error);
                setLoading(false);
            })
        }
    }, [travelTime]);

    useEffect(() => {
        const dayIdx = Number(dayNumber) - 1;
        const prevDayPlan = extractNonTransitActivities(prevActivitiesRef.current[dayIdx]);
        const currDayPlan = extractNonTransitActivities(activities[dayIdx]);

        const added = currDayPlan.filter(
            act => !prevDayPlan.some(prevAct => prevAct.place_id === act.place_id)
        );

        const removed = prevDayPlan.filter(
            act => !currDayPlan.some(currAct => currAct.place_id === act.place_id)
        );

        setNewActivities(processNewActivities(added));
        setRemovedActivities(processNewActivities(removed));

        prevActivitiesRef.current = activities;
    }, [activities, dayNumber]);

    function extractNonTransitActivities(dayPlan) {
        return (dayPlan?.plan || [])
            .filter(a => a.activity !== "transit");
    }

    const setArrivalTime = (time) => {
        //set date to today with the time provided
        const date = new Date();

        setTravelTime(time);
    }

    const removeActivity = (activityId) => {
        setActivities((prevActivities) => prevActivities.filter(activity => activity.id !== activityId));
    };

    const addActivity = (activity) => {
        const dayIdx = dayNumber - 1;
        const lastActivity = activities[dayNumber - 1].plan[activities[dayNumber - 1].plan.length - 1];

        const newActivityStartTime = addHours(lastActivity.end_time, 1);
        const newActivityEndTime = addHours(newActivityStartTime, 3);

        activity.start_time = `${newActivityStartTime}`;
        activity.end_time = `${newActivityEndTime}`;


        setActivities((prevActivities) => {
            const updatedActivities = [...prevActivities];
            updatedActivities[dayNumber - 1].plan.push(activity);
            // console.log("Updated Activities:", updatedActivities);
            return updatedActivities;
        });
        updatePlanInDB(planId, activities, startDate, endDate, travelTime);

    }

    const changeAllActivities = (newActivities) => {
        // setPreviousActivities(activities);
        setActivities(newActivities);
        // getNewlyAddedActivities();
    };

    function extractActivities(dayPlan) {
        const allActivities = [];
            if (dayPlan && dayPlan.plan) {
                dayPlan.plan.forEach(activity => {
                    if(activity.activity !== "transit") {
                        allActivities.push(activity);
                    }});
            }
        return allActivities;
    }

    const getNewlyAddedActivities = () => {
        const extractedActivities = extractActivities(activities[dayNumber -1]);
        const extractedPrevActivities = extractActivities(previousActivities[dayNumber -1]);
        // console.log("Previous Activities:", extractedPrevActivities, extractedActivities);
        const newActivities = extractedActivities.filter(activity => {
            return !extractedPrevActivities.some(prevActivity => prevActivity.place_id === activity.place_id);
        });
        setNewActivities(processNewActivities(newActivities));
    }
    // console.log("act",activities[0])
    const processedActivities = (plan_index) => {
        // console.log("act",activities)
        if (!activities || !Array.isArray(activities)) return [];
        const plan = activities[plan_index].plan;
        if (!activities[plan_index] || !activities[plan_index].plan) return [];
        const planStartTime = activities[plan_index].start_time;
        const planEndTime = activities[plan_index].end_time;
        const updated_activities = plan.map((activity, index) => {
            return ({
                ...activity,
                activity_id: Math.floor(Math.random() * 1000000),
                name: activity.location,
                start_time: activity.start_time.split(" ")[0],
                start_time_amPm: activity.start_time.split(" ")[1],
                plan_start_time: planStartTime,
                plan_end_time: planEndTime,
                end_time: activity.end_time.split(" ")[0] || calculateEndTime(activity, plan[index + 1]),
                end_time_amPm: activity.end_time.split(" ")[1],
            });
        });

        return updated_activities.filter(
            (dayPlan) => dayPlan.activity !== "transit"
        );
    }

    const processNewActivities = (actvts) => {
        return actvts.map((activity, index) => {
            return ({
                ...activity,
                activity_id: Math.floor(Math.random() * 1000000),
                name: activity.location,
            });
        });
    }


    return (
        <ActivitiesContext.Provider value={{ planId,activities, loading, removeActivity, changeAllActivities, setRemovedActivities, removedActivities, planId, processedActivities, newActivities, travelTime, setArrivalTime, startDate, endDate, addActivity, dayNumber }}>
            {children}
        </ActivitiesContext.Provider>
    );
}
