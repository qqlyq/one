import React, {useEffect, useRef, useState} from "react";
import { Typography, Box } from "@mui/material";
import {Row} from "react-bootstrap";

const CurrentTimeLine = ({ activities, containerRef}) => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 23, 9, 30, 0));
    const [position, setPosition] = useState(0);
    const [rowPosition, setRowPosition] = useState([]);
    const timelineRef = containerRef || null;

    const convertTimeToMinutes = (time) => {
        const [hours, minutes] = time.split(":");
        return parseInt(hours) * 60 + parseInt(minutes);
    }

    const convertMinutesToTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        return `${hours}:${mins < 10 ? '0' + mins : mins}`;
    }

    const currentTime = convertTimeToMinutes(`${currentDate.getHours()}:${currentDate.getMinutes()}`);

    const isCurrentTimeWithinBounds = (currentTime) => {
        let maxAndMinTime = getMaxAndMinTime();
        return currentTime >= maxAndMinTime.minTime && currentTime <= maxAndMinTime.maxTime;
    }

    const getMaxAndMinTime = () => {
        let minTime = 20000;
        let maxTime = 0;
        activities.forEach(activity => {
            const startTime = convertTimeToMinutes(activity.start_time);
            const endTime = convertTimeToMinutes(activity.end_time);
            if (startTime < minTime) {
                minTime = startTime;
            }
            if (endTime > maxTime) {
                maxTime = endTime;
            }
        });
        return { minTime, maxTime };
    }

    useEffect(() => {
        if(timelineRef.current) {
            let maxAndMinTime = getMaxAndMinTime();
            let distanceInMinutes = maxAndMinTime.maxTime - maxAndMinTime.minTime;// hours between max and min time
            let rect = timelineRef.current.getBoundingClientRect();
            let minuteSlotHeight = rect.height / distanceInMinutes;
            const numRows = Math.floor(rect.height / minuteSlotHeight);
            let offset = (currentTime - maxAndMinTime.minTime) * minuteSlotHeight;
            setPosition(offset);
        }
    }, [currentDate, activities]);

    useEffect(() => {
        const interval = setInterval(() => {
            // console.log("Just updated the time");
            setCurrentDate(new Date());
        }, 300000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
        {isCurrentTimeWithinBounds(currentTime) && (
        <div>
            {/*//show the the time and the red line on the row*/}
                <Box
                    sx={{
                        position: "absolute",
                        top: `${position}px`,
                        left: 0,
                        right: 0,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        sx={{
                            marginLeft: "18px",
                            fontSize: "12px",
                            color: "black",
                            marginRight: "10px",
                        }}
                        >
                        {convertMinutesToTime(currentTime)}
                    </Typography>

                    <Box sx={{
                        flex: 1,
                        height: "2px",
                        width: "5s%",
                        backgroundColor: "red",
                        zIndex: -1,
                    }}
                         />
                </Box>
        </div>
        )}
    </>
    )

}

export default CurrentTimeLine;
