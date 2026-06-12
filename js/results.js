const players = [
    { username: "Florentin", points: 128 },
    { username: "Julie", points: 115 },
    { username: "Thomas", points: 97 }
];

players.sort((a, b) => b.points - a.points);