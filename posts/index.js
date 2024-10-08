import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = { id, title };

  try {
    // Event Bus ClusterIP name
    await axios.post("http://event-bus-srv:4005/events", {
      type: "PostCreated",
      data: {
        id,
        title,
      },
    });

    res.status(201).send(posts[id]);
  } catch (err) {
    console.log(err.message);
    res.status(502).send({ error: err.message });
  }
});

app.post("/events", (req, res) => {
  console.log("Received event", req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log(`Latest update ${new Date().getTime()}`);
  console.log("Listening on port 4000");
});
