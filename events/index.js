import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;
  events.push(event);

  try {
    // Posts ClusterIP name
    await axios.post("http://posts-clusterip-srv:4000/events", event);
    //await axios.post('http://localhost:4001/events', event);
    //await axios.post('http://localhost:4002/events', event);
    //await axios.post('http://localhost:4003/events', event);

    console.log("Events fired");
    res.send({ status: "OK" });
  } catch (err) {
    console.log(err.message);
    res.status(502).send({ error: err.message });
  }
});

app.get("/events", (req, res) => {
  console.log(events);
  res.send(events);
});

app.listen(4005, () => {
  console.log("Listening on port 4005");
});
