import React, {useEffect, useState, useRef, useContext} from "react";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from "@mui/lab";
import { Typography, Box } from "@mui/material";
import { AccessTime, AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import ActivityCard from "../common/ActivityCard";
import iconMapping from "../../_utils/IconMapping";
import CurrentTimeLine from "./CurrentTimeLine";
import {Button} from "react-bootstrap";
import {ActivitiesContext} from "../../context/ActivitiesContext";

const categoryColors = {
    "Breakfast": "#f4a261",  // Orange
    "Sightseeing": "#f4b400", // Yellow
    "Bars & Nightlife": "#9b5de5", // Purple
    "Shopping": "#e63946", // Red
    "Hotel Check-in": "#264653", // Dark Blue
};

const TimelineComponent = ({ activities, removedActivities, newActivities, day_index,  setModalType, setModalData, setShowModal }) => {
    const [showNightEventModal, setShowNightEventModal] = useState(false);
    const [nightActivities, setNightActivities] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date(2025, 2, 13, 9, 30, 0)); // Default to 8:00 AM
    const timlineRef = useRef(null);
    const { addActivity } = useContext(ActivitiesContext);
    console.log("in time line",activities)

    useEffect(() => {
        const interval = setInterval(() => {
            // console.log("Just updated the time");
            setCurrentTime(currentTime => new Date(currentTime.getTime() + 60000));
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const getCurrentTimePosition = (activities) => {
        for(let i = 0; i < activities.length; i++) {
            const [startHours, startMin] = activities[i].start_time.split(":");
            const [endHours, endMin] = activities[i].end_time.split(":");
            const startTime = new Date(currentTime.getFullYear(),currentTime.getMonth(),currentTime.getDate(), startHours, startMin);
            const endTime = new Date(currentTime.getFullYear(),currentTime.getMonth(),currentTime.getDate(), endHours, endMin);
            if(currentTime >= startTime && currentTime <= endTime) {
                return i+1;
            }
        }
        return -1;
    };

    const currentTimePosition = getCurrentTimePosition(activities);

    function getDistanceFromTop() {
        if(timlineRef.current) {
            const rect = timlineRef.current.getBoundingClientRect();
            return rect.top + window.scrollY;
        }
        return 0;
    }
    const formatTimeToAmPm = (time24) => {
        if (!time24) return "";
        const [hourStr, min] = time24.trim().split(":");
        let hour = parseInt(hourStr, 10);
        if (isNaN(hour)) return time24; // fallback in case input is bad
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${min} ${ampm}`;
      };
      const format12HourTimeWithDefaultAmPm = (time12, defaultAmPm = "AM") => {
        if (!time12) return "";
        const [hourStr, min] = time12.trim().split(":");
        let hour = parseInt(hourStr, 10);
        if (isNaN(hour)) return time12;
      
        // Just add default AM/PM, don't convert hour
        return `${hour}:${min} ${defaultAmPm}`;
      };
      function addAmPmIfMissing(timeStr) {
        if (/am|pm/i.test(timeStr)) return timeStr;
      
        // You decide default AM or PM here
        // For example, if hour < 8 assume PM else AM (or reverse)
        const hour = parseInt(timeStr.split(":")[0], 10);
      
        // Simple rule: if hour <= 8, assume PM (evening activities), else AM
        const defaultAmPm = hour <= 8 ? "PM" : "AM";
      
        return format12HourTimeWithDefaultAmPm(timeStr, defaultAmPm);
      }
      
    const getNextVisibleActivityIndex = (currentIndex) => {
      let nextIndex = currentIndex + 1;
      while (nextIndex < activities.length) {
        if (!activities[nextIndex].isRemoved && !activities[nextIndex].isNew) {
          return nextIndex;
        }
        nextIndex++;
      }
      return -1;
    };



    return (
        <div ref={timlineRef} id={'testTimeLine'} style={{position: 'relative'}}>
            <Timeline position="right">
                {activities.map((activity, index) => (
                    <TimelineItem key={activity.activity_id}>
                        {/* <TimelineSeparator> */}
                            {/* ✅ Start Time - Positioned Exactly Above Icon */}
                            {/* <Typography
                                sx={{
                                    fontSize: "10px",
                                    backgroundColor: "#f4f4f4",
                                    color: "#555",
                                    padding: "2px 6px",
                                    borderRadius: "10px",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    position: "relative",
                                    top: "-12px",
                                    display: "inline-block"
                                }}
                            >
                                {activity.start_time}
                            </Typography> */}

                            {/* Activity Icon */}
                            {/* {!activity.isRemoved && !activity.isNew && (
                                <TimelineDot sx={{ backgroundColor: categoryColors[activity.category] || "#4db5e5", color: "white" }}>
                                    {iconMapping[activity.category] || iconMapping["Sightseeing"]}
                                </TimelineDot>
                            )}

                            {activity.isRemoved && (
                                <TimelineDot color="error">
                                    <RemoveCircleOutline />
                                </TimelineDot>)}
                            {activity.isNew && (
                                <TimelineDot color="success">
                                    <AddCircleOutline />
                                </TimelineDot>)}

                            {/* Connector */}
                            {/* {index !== activities.length - 1 && <TimelineConnector />} */} 

                            {/* ✅ End Time - Positioned at the bottom before next activity */}
                            {/* {index < activities.length - 1 && (
                                <Typography
                                    sx={{
                                        fontSize: "10px",
                                        backgroundColor: "#f4f4f4",
                                        color: "#555",
                                        padding: "2px 6px",
                                        borderRadius: "10px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        position: "relative",
                                        bottom: "-12px",
                                        display: "inline-block"
                                    }}
                                >
                                    {activities[index + 1].start_time}
                                </Typography>
                            )} */}
                        {/* </TimelineSeparator> */}
                        <TimelineContent>
                            <Box mb={2}>
                                <ActivityCard
                                    key={activity.place_id || index}
                                    data={{
                                        day_index: day_index,
                                        start_time: activity.plan_start_time,
                                        end_time: activity.plan_end_time,
                                        place_id: activity.place_id,
                                        name: activity.name,
                                        budget: activity.budget,
                                        category: activity.category,
                                        description: activity.activity_desc,
                                        duration: `${addAmPmIfMissing(activity.start_time)} - ${addAmPmIfMissing(activity.end_time)}`,
                                        image: activity.image_url,
                                        cost: activity.avg_cost_per_person,
                                    }}
                                    setModalType={setModalType}
                                    setModalData={setModalData}
                                    setShowModal={setShowModal}
                                    isNew={activity.isNew}
                                    isRemoved={activity.isRemoved}
                                />
                            </Box>
                        </TimelineContent>
                    </TimelineItem>
                ))}
                
                {/* <CurrentTimeLine activities={activities} containerRef={timlineRef} /> */}
            </Timeline>
           
        </div>
    );
};

export default TimelineComponent;
