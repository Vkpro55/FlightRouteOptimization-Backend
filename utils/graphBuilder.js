
/*
class Graph {
    constructor() {
        this.nodes = {};  // Cities as nodes
    }

    addNode(city, data) {
        this.nodes[city] = data;
    }

    addEdge(fromCity, toCity, edgeData) {
        if (!this.nodes[fromCity].edges) {
            this.nodes[fromCity].edges = [];
        }
        this.nodes[fromCity].edges.push({ toCity, ...edgeData });
    }

    findRoute(departureCity, arrivalCity, option) {
        // Logic to find the route based on option (cheapest/fastest)
        // Implement Dijkstra's algorithm or similar
        const visited = new Set();
        const queue = [{ city: departureCity, cost: 0, time: 0, path: [] }];
        const routes = []; // To store all possible routes

        while (queue.length > 0) {
            const currentCity = queue.shift();
            const currentNode = this.nodes[currentCity.city];

            // If we reached the arrival city, add the route without adding overlay time
            if (currentCity.city === arrivalCity) {
                routes.push({ route: [...currentCity.path], cost: currentCity.cost, time: currentCity.time });
                continue;  // Don't stop, continue to find other possible routes
            }

            if (!visited.has(currentCity.city)) {
                visited.add(currentCity.city);

                const neighbors = currentNode.edges || [];
                neighbors.forEach(neighbor => {
                    const newCost = currentCity.cost + neighbor.cost;
                    const newTime = currentCity.time + neighbor.time;

                    // If the neighbor is the arrival city, skip adding overlay time
                    const totalTime = (neighbor.toCity === arrivalCity)
                        ? newTime // No overlay for arrival city
                        : newTime + neighbor.overlay;

                    queue.push({
                        city: neighbor.toCity,
                        cost: newCost,
                        time: totalTime,
                        path: [...currentCity.path, {
                            from: currentCity.city,
                            to: neighbor.toCity,
                            cost: neighbor.cost,
                            time: neighbor.time,
                            overlay: (neighbor.toCity === arrivalCity) ? 0 : neighbor.overlay, // Exclude overlay for arrival city
                            airlineName: neighbor.airlineName
                        }]
                    });
                });
            }
        }

        if (routes.length === 0) {
            return null; // No route found
        }

        // Now choose the best route based on the option (cheapest or fastest)
        if (option === "cheapest") {
            // Sort by total cost
            routes.sort((a, b) => a.cost - b.cost);
        } else if (option === "fastest") {
            // Sort by total time
            routes.sort((a, b) => a.time - b.time);
        }

        // Return the best route (first route after sorting)
        const bestRoute = routes[0];
        return {
            totalCost: bestRoute.cost,
            totalTime: bestRoute.time,
            route: bestRoute.route
        };
    }
}

const buildGraph = (airportsData, routesData, option) => {
    const graph = new Graph();

    airportsData.forEach(airport => {
        graph.addNode(airport.City, {
            airportName: airport['Airport Real Name'],
            lat: airport.Latitude,
            lon: airport.Longitude,
            altitude: airport.Altitude
        });
    });

    routesData.forEach(route => {
        const { 'From City Real Name': fromCity, 'To City Real Name': toCity, Cost, 'Time (hours)': time, 'Overlay Time (hours)': overlay, 'Airway Line Real Name': airlineName } = route;

        graph.addEdge(fromCity, toCity, {
            cost: parseFloat(Cost),
            time: parseFloat(time),
            overlay: parseFloat(overlay),
            airlineName
        });
    });

    return graph;
};

module.exports = { buildGraph };




*/


class Graph {
    constructor() {
        this.nodes = {};  // Cities as nodes
    }

    addNode(city, data) {
        this.nodes[city] = data;
    }

    addEdge(fromCity, toCity, edgeData) {
        if (!this.nodes[fromCity] || !this.nodes[toCity]) {
            console.error(`Error: City "${fromCity}" or "${toCity}" not found in graph.`);
            return; // Or throw an error as needed
        }

        if (!this.nodes[fromCity].edges) {
            this.nodes[fromCity].edges = [];
        }
        this.nodes[fromCity].edges.push({ toCity, ...edgeData });
    }

    findRoute(departureCity, arrivalCity, option) {
        if (!this.nodes[departureCity]) {
            console.error(`Error: Departure city "${departureCity}" not found in graph.`);
            return null; // Or throw an error
        }
        if (!this.nodes[arrivalCity]) {
            console.error(`Error: Arrival city "${arrivalCity}" not found in graph.`);
            return null; // Or throw an error
        }

        const visited = new Set();
        const queue = [{ city: departureCity, cost: 0, time: 0, path: [] }];
        const routes = []; // To store all possible routes

        while (queue.length > 0) {
            const currentCity = queue.shift();
            const currentNode = this.nodes[currentCity.city];

            if (currentCity.city === arrivalCity) {
                routes.push({ route: [...currentCity.path], cost: currentCity.cost, time: currentCity.time });
                continue; // Continue to explore other routes
            }

            if (!visited.has(currentCity.city)) {
                visited.add(currentCity.city);

                const neighbors = currentNode.edges || [];
                neighbors.forEach(neighbor => {
                    const newCost = currentCity.cost + neighbor.cost;
                    const newTime = currentCity.time + neighbor.time;
                    const totalTime = (neighbor.toCity === arrivalCity)
                        ? newTime // No overlay for arrival city
                        : newTime + neighbor.overlay;

                    const neighborNode = this.nodes[neighbor.toCity];

                    queue.push({
                        city: neighbor.toCity,
                        cost: newCost,
                        time: totalTime,
                        path: [...currentCity.path, {
                            from: currentCity.city,
                            to: neighbor.toCity,
                            cost: neighbor.cost,
                            time: neighbor.time,
                            overlay: (neighbor.toCity === arrivalCity) ? 0 : neighbor.overlay,
                            airlineName: neighbor.airlineName,
                            fromLat: currentNode.lat,
                            fromLon: currentNode.lon,
                            toLat: neighborNode.lat,
                            toLon: neighborNode.lon
                        }]
                    });
                });
            }
        }

        if (routes.length === 0) {
            return null; // No route found
        }

        // Sort and return the best route based on the option
        routes.sort((a, b) => (option === "cheapest" ? a.cost - b.cost : a.time - b.time));
        const bestRoute = routes[0];

        return {
            departureCity,
            arrivalCity,
            totalCost: bestRoute.cost,
            totalTime: bestRoute.time,
            route: bestRoute.route
        };
    }

}

const buildGraph = (airportsData, routesData, option) => {
    const graph = new Graph();

    airportsData.forEach(airport => {
        graph.addNode(airport.City, {
            airportName: airport['Airport Real Name'],
            lat: airport.Latitude,
            lon: airport.Longitude,
            altitude: airport.Altitude
        });
    });

    routesData.forEach(route => {
        const { 'From City Real Name': fromCity, 'To City Real Name': toCity, Cost, 'Time (hours)': time, 'Overlay Time (hours)': overlay, 'Airway Line Real Name': airlineName } = route;

        graph.addEdge(fromCity, toCity, {
            cost: parseFloat(Cost),
            time: parseFloat(time),
            overlay: parseFloat(overlay),
            airlineName
        });
    });

    return graph;
};

module.exports = { buildGraph };






