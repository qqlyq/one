const requestBody = {
    "budget": 500,
    "daily_config": {
        "0": {
            "end_time": "2025-02-01 19:00",
            "preferences": [
                "Shopping"
            ],
            "start_time": "2025-02-01 13:00"
        },
        "1": {
            "end_time": "2025-02-02 20:00",
            "preferences": [
                "Site Seeing"
            ],
            "start_time": "2025-02-02 09:00"
        },
        "2": {
            "end_time": "2025-02-03 18:00",
            "preferences": [
                "Site Seeing"
            ],
            "start_time": "2025-02-03 10:30"
        }
    },
    "end_date": "2025-02-03",
    "hotel_location": [
        45.4959,
        -73.6206
    ],
    "location": [
        45.4959,
        -73.6206
    ],
    "max_travel_time": 60,
    "radius": 5000,
    "start_date": "2025-02-01"
}

export default requestBody;
