const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const port = 3000;

const mongoURI = 'mongodb://localhost:27017/'

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/",(req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const playerSchema = new mongoose.Schema({
    type: Map,
    of: new mongoose.Schema({
        login_times: Number,
        logout_times: Number,
        missions_completed: Number,
        items_purchased: Number,
        hours_played: Number,
        day_played: Number,
    })
}, { strict: false });

const Player = mongoose.model('Player', playerSchema)

app.get("/players", async (req,res)=>{
    try {
        const players = await Player.find();
        res.json(players);
    } catch (error) {
        console.log("error", error)
    }
})

app.post("/create-players", async (req, res) => {
    try {
        const playerData = req.body;
        const players = new Player(playerData);
        await players.save();
        res.json(players);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาด" });
    }
});

app.post("/create-player", async (req, res)=>{
    try {
        const playerData = req.body
        const player = new Player({
            login_times : playerData.login_times,
            logout_times: playerData.logout_times,
            missions_completed : playerData.missions_completed,
            item_purchased : playerData.item_purchased,
            hours_played : playerData.hours_played,
            day_played: playerData.day_played,
        })
        await player.save()
        res.json({
            player
        })
    } catch (error) {
        console.log("error", error)
    }
})

app.listen(port, async ()=>{
    try {
        await mongoose.connect(mongoURI)
    } catch (error) {
        console.log("server fail", error)
    }
    console.log("server running on port",port)
});