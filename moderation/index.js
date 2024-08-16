import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    try {
      await axios.post("http://event-bus-srv:4005/events", {
        type: "CommentModerated",
        data: {
          status,
          id: data.id,
          postId: data.postId,
          content: data.content,
        },
      });
    } catch (err) {
      console.log(err.message);
      res.status(502).send({ error: err.message });
    }
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});
