import express from 'express';
import bodyParser from 'body-parser';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id: commentId, content });
    commentsByPostId[req.params.id] = comments;

    try {
        await axios.post('http://localhost:4005/events', {
            type: 'CommentCreated',
            data: {
                content,
                id: commentId,
                postId: req.params.id
            }
        });

        res.status(201).send(comments);
    } catch (err) {
        console.log(err.message);
        res.status(502).send({ error: err.message });
    }
});

app.post('/events', (req, res) => {
    console.log('Received event', req.body.type);
    res.send({});
});

app.listen(4001, () => {
    console.log('Listening on port 4001');
});
