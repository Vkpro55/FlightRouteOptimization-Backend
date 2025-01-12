const { parseCsvData } = require("../utils/csvParser")
const { buildGraph } = require('../utils/graphBuilder');
const path = require('path');

const airportsFilePath = path.join(__dirname, '../data/airports.csv');
const routesFilePath = path.join(__dirname, '../data/routes.csv');


const getRouteDetails = async (req, res, next) => {
    try {
        const { departureCity, arrivalCity, option } = req.body;

        // Parse CSV Data
        const { airportsData, routesData } = await parseCsvData(airportsFilePath, routesFilePath);

        // Build Graph
        const graph = await buildGraph(airportsData, routesData, option);

        // Capitalize city names
        const capitalizedDepartureCity = departureCity.replace(/\b\w/g, (l) => l.toUpperCase());
        const capitalizedArrivalCity = arrivalCity.replace(/\b\w/g, (l) => l.toUpperCase());
        // const capitalizedOption = option.replace(/\b\w/g, (l) => l.toUpperCase())
        console.log("option is ", option)
        // Find the route between the cities
        const routeDetails = graph.findRoute(capitalizedDepartureCity, capitalizedArrivalCity, option);


        if (!routeDetails) {
            return res.status(404).json({ message: 'Route not found between the cities' });
        }

        const { route } = routeDetails; // Extract the route array from the result
        console.log(route)

        // Calculate total cost and total time
        let totalCost = 0;
        let totalTime = 0;

        // Check if the route is an array before calling forEach
        if (Array.isArray(route)) {
            route.forEach(leg => {
                totalCost += leg.cost;
                totalTime += leg.time + leg.overlay;
            });
        } else {
            return res.status(400).json({ message: 'Route format is invalid' });
        }

        return res.json({
            departureCity,
            arrivalCity,
            totalCost,
            totalTime,
            route
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getRouteDetails };