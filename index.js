const express = require("express");
const mailSender = require("./mailsender")
const dotenv = require("dotenv");
const axios = require('axios');
const bodyParser = require('body-parser');

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const noticesUrl = process.env.n_url;
let latestNoticeId = 6663;

async function fetchNotices() {
    try {
        const response = await axios.get(noticesUrl);
        const notices = response.data.data;

        if (notices.length > 0) {
            const newNotices = [];
            
            for (const notice of notices) {
                if (!latestNoticeId || notice.id > latestNoticeId) {
                    newNotices.push(notice);
                } else {
                    break;  // Stop if we reach the last processed notice
                }
            }

            if (newNotices.length > 0) {
                newNotices.reverse(); // Reverse to send the oldest notice first
                newNotices.forEach(sendSmsNotification);
                latestNoticeId = newNotices[0].id; // Update the latestNoticeId to the most recent
            }
        }
    } catch (error) {
        console.error('Error fetching notices. Institute server may be down.', error.message);
        return;
    }
}

async function sendSmsNotification(notice) {
    const messageBody = `New Notice: ${notice.title}\nLink: ${notice.path}`;
    await mailSender(`${notice.title}` , messageBody);
    
}

const interval =   process.env.intervel;

function retryFetchNotices(retries = 3, delay = 5000) {
    fetchNotices()
        .catch(error => {
            if (retries > 0) {
                console.log(`Retrying... Attempts left: ${retries}`);
                setTimeout(() => retryFetchNotices(retries - 1, delay), delay);
            } else {
                console.error('Max retry attempts reached. Skipping this round.');
            }
        });
}

setInterval(()=>{
    console.log("hello")
}, interval);

app.get("/", (req, res) => {
  res.send("kya aapke tooth paste mein namak hai ?");
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
