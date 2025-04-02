const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => deg * (Math.PI / 180);
    
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in km
};

const getNearbyUsers = async (userId, userLatitude, userLongitude) => {
    // Example: Get all users from the database
    const users = await getAllUsersFromDb(); // Replace with actual DB query

    // Calculate distance for each user and sort by distance
    const distances = users.map(user => ({
        userId: user.id,
        name: user.name,
        distance: haversineDistance(userLatitude, userLongitude, user.latitude, user.longitude)
    }));

    // Sort by distance and return the 10 closest users
    distances.sort((a, b) => a.distance - b.distance);
    
    return distances.slice(0, 10);
};

// Example of usage
getNearbyUsers(1, 40.7128, -74.0060).then(nearbyUsers => {
    console.log(nearbyUsers); // Output the 10 nearest users
});
